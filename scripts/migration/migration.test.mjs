import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { inventory, objectKey } from './media.mjs';
import { mediaReference, compareSnapshots } from './database.mjs';

test('legacy media layout maps only published files and refuses ambiguous paths', () => {
  assert.equal(objectKey('ảnh món hàng.jpg'), 'images/ảnh món hàng.jpg');
  assert.equal(objectKey('videos/a.mp4'), 'videos/a.mp4');
  assert.equal(objectKey('thumbnails/a.jpg'), 'thumbnails/a.jpg');
  assert.equal(objectKey('input-videos/a.mp4'), null);
  for (const path of ['../a.jpg', '/a.jpg', 'images/a.jpg', 'videos/../a.mp4', 'videos/x/a.mp4', 'a\\b']) assert.throws(() => objectKey(path));
});

test('media inventory detects bytes and rejects symlinks rather than following them', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'mhhome-inventory-'));
  try {
    await writeFile(join(dir, 'logo.svg'), '<svg xmlns="http://www.w3.org/2000/svg"></svg>');
    await mkdir(join(dir, 'input-videos'));
    await writeFile(join(dir, 'input-videos/pending.mp4'), 'archived pending upload');
    const manifest = await inventory(dir);
    assert.equal(manifest.files.length, 2);
    assert.equal(manifest.files.find((file) => file.path === 'logo.svg').contentType, 'image/svg+xml');
    await symlink(join(dir, 'logo.svg'), join(dir, 'linked.svg'));
    await assert.rejects(inventory(dir), /Symlink/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('normalization preserves absolute URLs and only strips recognized relative prefixes', () => {
  assert.deepEqual(mediaReference('public/images/a.png', 'images'), { value: 'a.png', key: 'images/a.png', external: false });
  assert.equal(mediaReference('/public/images/videos/a.mp4', 'videos').value, 'a.mp4');
  const url = 'https://server.mhhome.shop/public/images/a%20b.png';
  assert.deepEqual(mediaReference(url, 'images'), { value: url, key: 'images/a b.png', external: false });
  assert.equal(mediaReference('https://external.example/avatar.png', 'images').external, true);
  assert.throws(() => mediaReference('unknown/a.png', 'images'));
});

test('database comparison catches content and sequence drift, not just row counts', () => {
  const a = { version: 1, project: 'mhhome', tables: { products: { count: 1, sha256: 'a' } }, sequences: { products_id_seq: { last_value: '9', is_called: true } } };
  const b = structuredClone(a);
  assert.deepEqual(compareSnapshots(a, b), []);
  b.tables.products.sha256 = 'b';
  b.sequences.products_id_seq.last_value = '1';
  assert.deepEqual(compareSnapshots(a, b), ['tables.products', 'sequences.products_id_seq']);
});

