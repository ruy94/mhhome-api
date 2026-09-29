import assert from 'node:assert/strict';
import { test } from 'node:test';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { randomUUID } from 'node:crypto';
import { request } from 'node:https';
import { setTimeout as delay } from 'node:timers/promises';
import pg from 'pg';
import { Queue } from 'bullmq';
import { S3Client, CreateBucketCommand, PutObjectCommand, PutBucketPolicyCommand } from '@aws-sdk/client-s3';
import { inventory, transfer, remoteDigest } from './media.mjs';
import { snapshot, compareSnapshots, auditMedia } from './database.mjs';
import { Redis } from 'ioredis';

const exec = promisify(execFile);
const enabled = process.env.RUN_MIGRATION_INTEGRATION === '1';
const minioImage = 'minio/minio@sha256:14cea493d9a34af32f524e538b8346cf79f3321eff8e708c1e2960462bd8936e';

test('migration rehearses on isolated PostgreSQL, Redis and MinIO containers', { skip: !enabled, timeout: 240000 }, async (t) => {
  const containers = [];
  const clients = [];
  const dir = await mkdtemp(join(tmpdir(), 'mhhome-migration-test-'));
  const network = `mhhome-migration-test-${randomUUID().slice(0, 8)}`;
  await exec('docker', ['network', 'create', network]);
  t.after(async () => {
    for (const close of clients.reverse()) await close().catch(() => undefined);
    for (const name of containers.reverse()) await exec('docker', ['rm', '-f', name]).catch(() => undefined);
    await exec('docker', ['network', 'rm', network]).catch(() => undefined);
    await rm(dir, { recursive: true, force: true });
  });
  async function container(image, port, extra = [], command = []) {
    const name = `mhhome-migration-test-${randomUUID().slice(0, 8)}`;
    containers.push(name);
    await exec('docker', ['run', '-d', '--rm', '--name', name, '--network', network, '-p', `127.0.0.1::${port}`, ...extra, image, ...command]);
    const { stdout } = await exec('docker', ['inspect', '--format', `{{(index (index .NetworkSettings.Ports "${port}/tcp") 0).HostPort}}`, name]);
    return { name, port: Number(stdout.trim()) };
  }
  async function ready(check) {
    for (let i = 0; i < 80; i++) {
      try { if (await check()) return; } catch { /* isolated services are starting */ }
      await delay(250);
    }
    throw new Error('Isolated test service did not become ready');
  }
  const postgres = await container('postgres:16-alpine', 5432, ['-e', 'POSTGRES_PASSWORD=migration-test-only', '-e', 'POSTGRES_DB=mhhome']);
  const legacyPostgres = await container('postgres:14.23-alpine', 5432, ['-e', 'POSTGRES_PASSWORD=migration-test-only', '-e', 'POSTGRES_DB=mhhome']);
  const redis = await container('redis:7-alpine', 6379);
  const minio = await container(minioImage, 9000, ['-e', 'MINIO_ROOT_USER=migrationtest', '-e', 'MINIO_ROOT_PASSWORD=migration-test-only'], ['server', '/data']);
  await ready(async () => { await exec('docker', ['exec', postgres.name, 'pg_isready', '-U', 'postgres']); return true; });
  await ready(async () => { await exec('docker', ['exec', legacyPostgres.name, 'pg_isready', '-U', 'postgres']); return true; });
  await ready(async () => { await exec('docker', ['exec', redis.name, 'redis-cli', 'ping']); return true; });
  await ready(async () => (await fetch(`http://127.0.0.1:${minio.port}/minio/health/live`)).ok);
  const s3 = new S3Client({ endpoint: `http://127.0.0.1:${minio.port}`, region: 'ap-southeast-1', forcePathStyle: true, credentials: { accessKeyId: 'migrationtest', secretAccessKey: 'migration-test-only' } });
  clients.push(async () => s3.destroy());
  const bucket = 'mhhome-media';
  await s3.send(new CreateBucketCommand({ Bucket: bucket }));
  const uploads = join(dir, 'uploads');
  await mkdir(join(uploads, 'videos'), { recursive: true });
  await mkdir(join(uploads, 'input-videos'));
  // Valid minimal PNG, and an archived/queued fixture whose bytes must remain unchanged.
  await writeFile(join(uploads, 'ảnh test.png'), Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64'));
  await writeFile(join(uploads, 'videos/a.mp4'), Buffer.from('000000186674797069736f6d0000020069736f6d69736f32', 'hex'));
  await writeFile(join(uploads, 'input-videos/unfinished.mp4'), Buffer.from('000000186674797069736f6d0000020069736f6d69736f32', 'hex'));
  const manifest = await inventory(uploads);

  await t.test('MinIO dry run, exact-byte copy, repeat, missing object and collision checks', async () => {
    const options = { root: uploads, manifest, client: s3, bucket };
    assert.equal((await transfer(options)).copied, 0);
    assert.equal(await remoteDigest(s3, bucket, 'images/ảnh test.png'), null);
    await assert.rejects(transfer({ ...options, verifyOnly: true }), /missing/);
    assert.equal((await transfer({ ...options, apply: true })).copied, 2);
    assert.equal((await transfer({ ...options, apply: true })).copied, 0);
    await transfer({ ...options, verifyOnly: true });
    assert.equal(await remoteDigest(s3, bucket, 'input-videos/unfinished.mp4'), null);
    await s3.send(new PutObjectCommand({ Bucket: bucket, Key: 'images/ảnh test.png', Body: 'conflicting bytes' }));
    await assert.rejects(transfer({ ...options, apply: true }), /refusing overwrite/);
    // Restore this test fixture directly; the migration tool itself never overwrites collisions.
    const file = manifest.files.find((file) => file.path === 'ảnh test.png');
    await s3.send(new PutObjectCommand({ Bucket: bucket, Key: file.key, Body: await readFile(join(uploads, file.path)), ContentType: file.contentType }));
    await writeFile(join(uploads, 'added.png'), 'new upload');
    await assert.rejects(transfer({ ...options, apply: true }), /changed since inventory/);
    await rm(join(uploads, 'added.png'));
  });

  await t.test('PostgreSQL 14.23 → 16 restores all migrations/data/sequences with v16 tools, then normalizes media transactionally', async () => {
    const url = `postgresql://postgres:migration-test-only@127.0.0.1:${legacyPostgres.port}/mhhome`;
    await exec('yarn', ['prisma:migrate:deploy'], { cwd: resolve(import.meta.dirname, '../..'), env: { ...process.env, NODE_ENV: 'test', DATABASE_URL: url }, maxBuffer: 1024 * 1024 });
    const client = new pg.Client({ connectionString: url });
    await client.connect();
    clients.push(() => client.end());
    await client.query("INSERT INTO categories (name, image, website_image) VALUES ('Giữ tên tiếng Việt', 'public/images/ảnh test.png', 'ảnh test.png')");
    await client.query("INSERT INTO products (category_id, name, detail, image) VALUES ('{1}', 'Existing product', '<img src=\"https://server.mhhome.shop/public/images/ảnh%20test.png\">', ARRAY['public/images/ảnh test.png'])");
    await client.query("SELECT setval('categories_id_seq', 45)");
    const before = await snapshot(client);
    assert.match((await client.query('SHOW server_version')).rows[0].server_version, /^14\.23/);
    assert.equal(before.tables._prisma_migrations.count, 21);
    // Use v16 clients over TCP to read the independent v14 server; never reuse its data volume.
    for (const tool of ['pg_dump', 'pg_restore', 'psql']) {
      const { stdout } = await exec('docker', ['exec', postgres.name, tool, '--version']);
      assert.match(stdout, /PostgreSQL\) 16\./);
      t.diagnostic(stdout.trim());
    }
    await exec('docker', ['exec', '-e', 'PGPASSWORD=migration-test-only', postgres.name, 'pg_dump', '-h', legacyPostgres.name, '-p', '5432', '-U', 'postgres', '-d', 'mhhome', '-Fc', '-f', '/tmp/mhhome.dump']);
    await exec('docker', ['exec', postgres.name, 'pg_restore', '-U', 'postgres', '-d', 'mhhome', '--no-owner', '--no-acl', '--exit-on-error', '--single-transaction', '/tmp/mhhome.dump']);
    const targetUrl = `postgresql://postgres:migration-test-only@127.0.0.1:${postgres.port}/mhhome`;
    const restored = new pg.Client({ connectionString: targetUrl });
    await restored.connect();
    clients.push(() => restored.end());
    assert.match((await restored.query('SHOW server_version')).rows[0].server_version, /^16\./);
    assert.deepEqual(compareSnapshots(before, await snapshot(restored)), []);
    assert.deepEqual(compareSnapshots(before, await snapshot(client)), [], 'dump must leave source unchanged');
    const schemaObjects = async (db) => (await db.query(`
      SELECT 'constraint' AS kind, c.relname AS relation, con.conname AS name,
             pg_get_constraintdef(con.oid) AS definition
      FROM pg_constraint con JOIN pg_class c ON c.oid = con.conrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public'
      UNION ALL
      SELECT 'index', tablename, indexname, indexdef FROM pg_indexes WHERE schemaname = 'public'
      ORDER BY kind, relation, name
    `)).rows;
    assert.deepEqual(await schemaObjects(restored), await schemaObjects(client));
    await exec('yarn', ['prisma', 'migrate', 'status'], { cwd: resolve(import.meta.dirname, '../..'), env: { ...process.env, NODE_ENV: 'test', DATABASE_URL: targetUrl }, maxBuffer: 1024 * 1024 });
    t.diagnostic(`Verified ${Object.keys(before.tables).length} tables, ${Object.keys(before.sequences).length} sequences, 21 migrations, constraints and indexes across 14.23 → 16`);
    const preview = await auditMedia(restored, manifest, { reportPath: join(dir, 'preview.json') });
    assert.equal(preview.missing.length, 0);
    assert.equal(preview.changes.length, 2);
    assert.deepEqual(compareSnapshots(before, await snapshot(restored)), []);
    await restored.query("UPDATE categories SET image = 'missing.png'");
    await assert.rejects(auditMedia(restored, manifest, { apply: true, reportPath: join(dir, 'blocked.json') }), /no database changes/);
    assert.equal((await restored.query('SELECT image FROM products')).rows[0].image[0], 'public/images/ảnh test.png');
    await restored.query("UPDATE categories SET image = 'public/images/ảnh test.png'");
    await auditMedia(restored, manifest, { apply: true, reportPath: join(dir, 'applied.json') });
    assert.equal((await restored.query('SELECT image FROM products')).rows[0].image[0], 'ảnh test.png');
    assert.equal((await auditMedia(restored, manifest)).changes.length, 0);
    assert.equal((await restored.query('SELECT detail FROM products')).rows[0].detail, '<img src="https://server.mhhome.shop/public/images/ảnh%20test.png">');
  });

  await t.test('real Nginx routes preserve old/new image URLs and video Range responses', async () => {
    await s3.send(new PutBucketPolicyCommand({ Bucket: bucket, Policy: JSON.stringify({ Version: '2012-10-17', Statement: [{ Effect: 'Allow', Principal: '*', Action: ['s3:GetObject'], Resource: [`arn:aws:s3:::${bucket}/*`] }] }) }));
    const certDir = join(dir, 'cert');
    await mkdir(certDir);
    await exec('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-days', '1', '-keyout', join(certDir, 'privkey.pem'), '-out', join(certDir, 'fullchain.pem'), '-subj', '/CN=mhhome.shop']);
    const config = (await readFile(resolve(import.meta.dirname, '../../ops/nginx/mhhome.conf'), 'utf8'))
      .replaceAll('/etc/letsencrypt/live/mhhome.shop', '/etc/nginx/testcert')
      .replaceAll('include /etc/letsencrypt/options-ssl-nginx.conf;', '')
      .replaceAll('ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;', '')
      .replaceAll('127.0.0.1:9999', `${minio.name}:9000`);
    await writeFile(join(dir, 'mhhome.conf'), config);
    const nginx = await container('nginx:stable-alpine', 443, ['-v', `${certDir}:/etc/nginx/testcert:ro`, '-v', `${join(dir, 'mhhome.conf')}:/etc/nginx/conf.d/default.conf:ro`]);
    await exec('docker', ['exec', nginx.name, 'nginx', '-t']);
    const get = (host, path, headers = {}) => new Promise((resolve, reject) => {
      const req = request({ hostname: '127.0.0.1', port: nginx.port, path: encodeURI(path), rejectUnauthorized: false, headers: { Host: host, ...headers } }, (response) => {
        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => resolve({ status: response.statusCode, headers: response.headers, body: Buffer.concat(chunks) }));
      });
      req.on('error', reject);
      req.end();
    });
    await ready(async () => (await get('server.mhhome.shop', '/public/images/ảnh test.png')).status === 200);
    const old = await get('server.mhhome.shop', '/public/images/ảnh test.png');
    const modern = await get('media.mhhome.shop', '/mhhome-media/images/ảnh test.png');
    assert.equal(old.status, 200);
    assert.equal(modern.status, 200);
    assert.deepEqual(old.body, modern.body);
    assert.deepEqual(old.body, await readFile(join(uploads, 'ảnh test.png')));
    for (const [host, path] of [['server.mhhome.shop', '/public/images/videos/a.mp4'], ['media.mhhome.shop', '/mhhome-media/videos/a.mp4']]) {
      const response = await get(host, path, { Range: 'bytes=0-3' });
      assert.equal(response.status, 206);
      assert.equal(response.body.length, 4);
      assert.match(response.headers['content-range'], /^bytes 0-3\//);
    }
  });

  await t.test('built API image boots, authenticates, validates uploads, compresses and deletes media', { skip: !process.env.MIGRATION_API_TEST_IMAGE }, async () => {
    const environment = {
      NODE_ENV: 'production', PORT: '3000',
      DATABASE_URL: `postgresql://postgres:migration-test-only@${postgres.name}:5432/mhhome`,
      REDIS_HOST: redis.name, REDIS_PORT: '6379', REDIS_DB: '8', REDIS_KEY_PREFIX: 'mhhome:prod:', REDIS_QUEUE_PREFIX: 'mhhome-prod',
      MINIO_ENDPOINT: `http://${minio.name}:9000`, MINIO_REGION: 'ap-southeast-1', MINIO_MEDIA_BUCKET: bucket,
      MINIO_ACCESS_KEY: 'migrationtest', MINIO_SECRET_KEY: 'migration-test-only', MINIO_FORCE_PATH_STYLE: 'true',
      JWT_ACCESS_SECRET: 'migration-test-access-only', JWT_REFRESH_SECRET: 'migration-test-refresh-only',
      ZALO_OA_ID: 'test', ZALO_APP_SECRET_KEY: 'test', CHECKOUT_SECRET_KEY: 'test', ZALO_OPENAPIS_KEY: 'test',
      SPX_ENABLED: 'false', VTP_ENABLED: 'false', SALEWORK_ENABLED: 'false', MARKETPLACE_ENABLED: 'false', ELECTRONIC_INVOICE_ENABLED: 'false',
    };
    const redisClient = new Redis(`redis://127.0.0.1:${redis.port}/8`);
    clients.push(async () => redisClient.disconnect());
    assert.equal(await redisClient.dbsize(), 0, 'API starts with a fresh Redis database');
    const api = await container(process.env.MIGRATION_API_TEST_IMAGE, 3000, Object.entries(environment).flatMap(([key, value]) => ['-e', `${key}=${value}`]));
    const base = `http://127.0.0.1:${api.port}`;
    try {
      await ready(async () => (await fetch(`${base}/health`)).ok);
      // Test database only. Exercise the same seed step as the deployment workflow.
      await exec('docker', ['exec', api.name, 'yarn', 'db:seed'], { maxBuffer: 1024 * 1024 });
      const db = new pg.Client({ connectionString: `postgresql://postgres:migration-test-only@127.0.0.1:${postgres.port}/mhhome` });
      await db.connect();
      clients.push(() => db.end());
      const adminsBefore = (await db.query('SELECT id, username, password FROM admins ORDER BY id')).rows;
      assert.deepEqual(adminsBefore.map((row) => row.username).sort(), ['mhhome', 'superadmin']);
      for (const admin of adminsBefore) await redisClient.set(`mhhome:prod:auth:permissions:${admin.id}`, 'stale');
      await redisClient.set('other-shop:auth:permissions:sentinel', 'untouched');
      await exec('docker', ['exec', api.name, 'yarn', 'db:seed'], { maxBuffer: 1024 * 1024 });
      assert.deepEqual((await db.query('SELECT id, username, password FROM admins ORDER BY id')).rows, adminsBefore);
      for (const admin of adminsBefore) assert.equal(await redisClient.get(`mhhome:prod:auth:permissions:${admin.id}`), null);
      assert.equal(await redisClient.get('other-shop:auth:permissions:sentinel'), 'untouched');
      const actions = (await db.query('SELECT action FROM permissions')).rows.map((row) => row.action);
      for (const action of ['salework:view', 'salework:create', 'salework:warehouse', 'salework:banking', 'kiotviet:view', 'kiotviet:sync', 'kiotviet:write']) assert.ok(actions.includes(action), action);
      const login = await fetch(`${base}/api/v1/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'superadmin', password: 'superadmin' }) });
      assert.equal(login.status, 201);
      const token = (await login.json()).data.access_token;
      assert.ok(token);
      const headers = { Authorization: `Bearer ${token}` };
      const form = new FormData();
      form.append('files', new Blob([await readFile(join(uploads, 'ảnh test.png'))], { type: 'image/png' }), 'test.png');
      const upload = await fetch(`${base}/api/v1/uploads/images`, { method: 'POST', headers, body: form });
      assert.equal(upload.status, 201);
      const imageName = (await upload.json()).data.urls[0];
      assert.equal((await remoteDigest(s3, bucket, `images/${imageName}`)).contentType, 'image/png');
      const invalid = new FormData();
      invalid.append('files', new Blob(['not an image'], { type: 'image/png' }), 'fake.png');
      assert.equal((await fetch(`${base}/api/v1/uploads/images`, { method: 'POST', headers, body: invalid })).status, 400);
      await exec('docker', ['exec', api.name, '/app/node_modules/ffmpeg-static/ffmpeg', '-f', 'lavfi', '-i', 'color=c=black:s=32x32:d=5', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-y', '/tmp/migration-test.mp4']);
      await exec('docker', ['cp', `${api.name}:/tmp/migration-test.mp4`, join(dir, 'valid.mp4')]);
      const videoForm = new FormData();
      videoForm.append('video', new Blob([await readFile(join(dir, 'valid.mp4'))], { type: 'video/mp4' }), 'test.mp4');
      const videoResponse = await fetch(`${base}/api/v1/uploads/video`, { method: 'POST', headers, body: videoForm });
      assert.equal(videoResponse.status, 201);
      const video = (await videoResponse.json()).data;
      const queue = new Queue('upload-video', { connection: redisClient, prefix: 'mhhome-prod', skipMetasUpdate: true });
      try { await ready(async () => (await queue.getCompletedCount()) === 1); } finally { await queue.close(); }
      assert.equal((await remoteDigest(s3, bucket, `videos/${video.videoUrl}`)).contentType, 'video/mp4');
      assert.equal((await remoteDigest(s3, bucket, `thumbnails/${video.thumbnailUrl}`)).contentType, 'image/jpeg');
      assert.equal((await fetch(`${base}/api/v1/uploads/image?filename=${encodeURIComponent(imageName)}`, { method: 'DELETE', headers })).status, 200);
      assert.equal((await fetch(`${base}/api/v1/uploads/video?filename=${encodeURIComponent(video.videoUrl)}`, { method: 'DELETE', headers })).status, 200);
      await ready(async () => await remoteDigest(s3, bucket, `images/${imageName}`) === null && await remoteDigest(s3, bucket, `videos/${video.videoUrl}`) === null && await remoteDigest(s3, bucket, `thumbnails/${video.thumbnailUrl}`) === null);
    } catch (error) {
      const logs = await exec('docker', ['logs', '--tail', '80', api.name]);
      throw new Error(`${error.message}\nIsolated test API logs:\n${logs.stdout}\n${logs.stderr}`, { cause: error });
    }
  });
});

// Kept visible rather than counting the known upstream bug as a passing smoke test.
test('KNOWN ISSUE: 1-second video upload has no frame at 3s and can fail/crash the stream', { todo: 'Source-exact video.utils.ts/storage.service.ts; fix both projects together later' });
