import { createReadStream } from 'node:fs';
import { lstat, readdir } from 'node:fs/promises';
import { join, resolve, posix } from 'node:path';
import { fileTypeFromFile } from 'file-type';
import { S3Client, GetObjectCommand, HeadBucketCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { args, readJson, required, runMain, sha256File, sha256Stream, writeJson } from './lib.mjs';

export function objectKey(relativePath) {
  if (!relativePath || relativePath.startsWith('/') || relativePath.includes('\\') || relativePath.split('/').some((p) => !p || p === '.' || p === '..')) {
    throw new Error(`Unsafe media path: ${relativePath}`);
  }
  const parts = relativePath.split('/');
  if (parts[0] === 'input-videos' && parts.length > 1) return null;
  if (parts.length === 1) return `images/${relativePath}`;
  if (parts.length === 2 && ['videos', 'thumbnails'].includes(parts[0])) return relativePath;
  throw new Error(`Unrecognized upload layout: ${relativePath}. Archive and review it before copying.`);
}

export async function inventory(root) {
  root = resolve(root);
  if (!(await lstat(root)).isDirectory()) throw new Error('Uploads root must be a real directory');
  const files = [];
  async function walk(relative = '') {
    for (const entry of (await readdir(join(root, relative))).sort()) {
      const path = posix.join(relative, entry);
      const fullPath = join(root, path);
      const stat = await lstat(fullPath);
      if (stat.isSymbolicLink()) throw new Error(`Symlink requires manual review: ${path}`);
      if (stat.isDirectory()) {
        if (!['videos', 'thumbnails', 'input-videos'].includes(path) && !path.startsWith('input-videos/')) throw new Error(`Unexpected directory: ${path}`);
        await walk(path);
      } else if (stat.isFile()) {
        const key = objectKey(path);
        const detected = await fileTypeFromFile(fullPath);
        const mime = detected?.mime ?? ({ '.svg': 'image/svg+xml', '.avif': 'image/avif' }[posix.extname(path).toLowerCase()] ?? 'application/octet-stream');
        files.push({ path, key, bytes: stat.size, sha256: await sha256File(fullPath), contentType: mime });
      } else throw new Error(`Unsupported filesystem entry: ${path}`);
    }
  }
  await walk();
  return { version: 1, project: 'mhhome', root, createdAt: new Date().toISOString(), files };
}

export function validateManifest(manifest) {
  if (manifest.version !== 1 || manifest.project !== 'mhhome' || !Array.isArray(manifest.files)) throw new Error('Invalid MH Home media manifest');
  const paths = new Set();
  for (const file of manifest.files) {
    if (file.key !== objectKey(file.path) || paths.has(file.path) || !/^[a-f0-9]{64}$/.test(file.sha256) || !Number.isSafeInteger(file.bytes) || file.bytes < 0 || !file.contentType) throw new Error(`Invalid manifest entry: ${file.path}`);
    paths.add(file.path);
  }
}

export async function remoteDigest(client, bucket, key) {
  try {
    const result = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    return { sha256: await sha256Stream(result.Body), bytes: result.ContentLength, contentType: result.ContentType };
  } catch (error) {
    if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) return null;
    throw error;
  }
}

export async function transfer({ root, manifest, client, bucket, apply = false, verifyOnly = false }) {
  validateManifest(manifest);
  root = resolve(root);
  // Re-inventory first: reject symlinks, missing/new/modified files before ANY upload.
  const current = await inventory(root);
  if (JSON.stringify(current.files) !== JSON.stringify(manifest.files)) throw new Error('Uploads changed since inventory. Stop writers and create a new manifest.');
  await client.send(new HeadBucketCommand({ Bucket: bucket }));
  let matched = 0;
  let missing = 0;
  const pending = [];
  // Preflight all object collisions before writing; never overwrite mismatched content.
  for (const file of manifest.files.filter((file) => file.key)) {
    const existing = await remoteDigest(client, bucket, file.key);
    if (existing) {
      if (existing.sha256 !== file.sha256 || existing.bytes !== file.bytes || existing.contentType !== file.contentType) throw new Error(`Target object differs; refusing overwrite: ${file.key}`);
      matched++;
    } else {
      missing++;
      pending.push(file);
    }
  }
  if (verifyOnly && missing) throw new Error(`${missing} media objects are missing`);
  if (apply && !verifyOnly) {
    for (const file of pending) {
      if (await sha256File(join(root, file.path)) !== file.sha256) throw new Error(`Source changed during copy: ${file.path}`);
      await client.send(new PutObjectCommand({ Bucket: bucket, Key: file.key, Body: createReadStream(join(root, file.path)), ContentLength: file.bytes, ContentType: file.contentType, IfNoneMatch: '*' }));
      const uploaded = await remoteDigest(client, bucket, file.key);
      if (uploaded?.sha256 !== file.sha256 || uploaded?.bytes !== file.bytes || uploaded?.contentType !== file.contentType) throw new Error(`Post-upload verification failed: ${file.key}`);
    }
  }
  return { matched, missing, copied: apply && !verifyOnly ? pending.length : 0, archivedInputFiles: manifest.files.filter((file) => !file.key).length };
}

async function main() {
  const { positionals: [command], values } = args({ root: { type: 'string' }, manifest: { type: 'string' } });
  const root = required(values.root, '--root');
  if (command === 'inventory') {
    const manifest = await inventory(root);
    await writeJson(values.manifest, manifest);
    console.log(`Inventoried ${manifest.files.length} files; input-videos are archived, not published.`);
    return;
  }
  if (!['copy', 'verify'].includes(command)) throw new Error('Usage: media.mjs inventory|copy|verify --root DIR --manifest FILE [--apply]');
  const client = new S3Client({
    endpoint: required(process.env.MIGRATION_MINIO_ENDPOINT, 'MIGRATION_MINIO_ENDPOINT'),
    region: process.env.MIGRATION_MINIO_REGION || 'ap-southeast-1',
    forcePathStyle: true,
    credentials: { accessKeyId: required(process.env.MIGRATION_MINIO_ACCESS_KEY, 'MIGRATION_MINIO_ACCESS_KEY'), secretAccessKey: required(process.env.MIGRATION_MINIO_SECRET_KEY, 'MIGRATION_MINIO_SECRET_KEY') },
  });
  const bucket = required(process.env.MIGRATION_MINIO_BUCKET, 'MIGRATION_MINIO_BUCKET');
  if (bucket !== 'mhhome-media') throw new Error('This runbook only targets mhhome-media');
  try {
    console.log(JSON.stringify(await transfer({ root, manifest: await readJson(values.manifest), client, bucket, apply: values.apply, verifyOnly: command === 'verify' })));
  } finally { client.destroy(); }
}

runMain(import.meta.url, main);
