import { createHash } from 'node:crypto';
import pg from 'pg';
import { args, readJson, required, runMain, writeJson } from './lib.mjs';
import { validateManifest } from './media.mjs';

const quote = (name) => `"${name.replaceAll('"', '""')}"`;
const mediaFields = [
  ['products', 'image', 'images', true], ['products', 'video_url', 'videos'], ['products', 'video_thumbnail', 'thumbnails'],
  ['variants', 'image', 'images'], ['categories', 'image', 'images'], ['categories', 'website_image', 'images'],
  ['banners', 'ad_banners', 'images', true], ['banners', 'cam_banners', 'images', true],
  ['reviews', 'image', 'images', true], ['reviews', 'customer_avatar', 'images'], ['reviews', 'video_url', 'videos'], ['reviews', 'video_thumbnail', 'thumbnails'],
  ['zalo_videos', 'video_url', 'videos'], ['zalo_videos', 'video_thumbnail', 'thumbnails'], ['users', 'avatar', 'images'],
];

export function mediaReference(value, kind) {
  if (!value) return { value, key: null, external: false };
  if (typeof value !== 'string') throw new Error('Unexpected non-string media value');
  if (/^(data:|blob:)/i.test(value)) return { value, key: null, external: true };
  let path = value;
  let absolute = false;
  if (/^https?:\/\//i.test(value)) {
    const url = new URL(value);
    if (!['server.mhhome.shop', 'media.mhhome.shop'].includes(url.hostname)) return { value, key: null, external: true };
    path = decodeURIComponent(url.pathname);
    absolute = true;
  }
  path = path.replace(/^\//, '');
  const prefixes = kind === 'images'
    ? ['mhhome-media/images/', 'public/images/', 'images/']
    : [`mhhome-media/${kind}/`, `public/images/${kind}/`, `images/${kind}/`, `${kind}/`];
  for (const prefix of prefixes) {
    if (path.startsWith(prefix)) { path = path.slice(prefix.length); break; }
  }
  // Never basename() arbitrary paths: that can silently link to a different file.
  if (!path || path.includes('/') || path.includes('\\') || path === '.' || path === '..') throw new Error(`Unrecognized ${kind} reference: ${value}`);
  return { value: absolute ? value : path, key: `${kind}/${path}`, external: false };
}

async function tables(client) {
  return (await client.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename")).rows.map((row) => row.tablename);
}

async function* rows(client, sql) {
  await client.query(`DECLARE migration_rows NO SCROLL CURSOR FOR ${sql}`);
  try {
    while (true) {
      const batch = await client.query('FETCH 500 FROM migration_rows');
      if (!batch.rows.length) break;
      yield* batch.rows;
    }
  } finally { await client.query('CLOSE migration_rows'); }
}

export async function snapshot(client) {
  await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
  try {
    await client.query("SET LOCAL TIME ZONE 'UTC'");
    await client.query("SET LOCAL DateStyle = 'ISO, YMD'");
    const result = { version: 1, project: 'mhhome', createdAt: new Date().toISOString(), tables: {}, sequences: {} };
    for (const table of await tables(client)) {
      const hash = createHash('sha256');
      let count = 0;
      for await (const row of rows(client, `SELECT to_jsonb(t)::text AS body FROM public.${quote(table)} t ORDER BY (to_jsonb(t)::text) COLLATE "C"`)) {
        hash.update(row.body + '\n');
        count++;
      }
      result.tables[table] = { count, sha256: hash.digest('hex') };
    }
    const sequences = await client.query("SELECT sequencename FROM pg_sequences WHERE schemaname = 'public' ORDER BY sequencename");
    for (const { sequencename } of sequences.rows) {
      result.sequences[sequencename] = (await client.query(`SELECT last_value::text, is_called FROM public.${quote(sequencename)}`)).rows[0];
    }
    await client.query('COMMIT');
    return result;
  } catch (error) { await client.query('ROLLBACK'); throw error; }
}

export function compareSnapshots(before, after) {
  if (before.version !== 1 || after.version !== 1 || before.project !== 'mhhome' || after.project !== 'mhhome') throw new Error('Invalid DB snapshots');
  const differences = [];
  for (const section of ['tables', 'sequences']) {
    for (const name of new Set([...Object.keys(before[section]), ...Object.keys(after[section])])) {
      if (JSON.stringify(before[section][name]) !== JSON.stringify(after[section][name])) differences.push(`${section}.${name}`);
    }
  }
  return differences;
}

export async function auditMedia(client, manifest, { apply = false, reportPath } = {}) {
  validateManifest(manifest);
  const keys = new Set(manifest.files.filter((file) => file.key).map((file) => file.key));
  const report = { version: 1, project: 'mhhome', createdAt: new Date().toISOString(), changes: [], missing: [], invalid: [], external: 0 };
  await client.query(apply ? 'BEGIN ISOLATION LEVEL SERIALIZABLE' : 'BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
  try {
    if (apply) {
      // All writers should already be stopped; lock relevant tables to avoid overwriting concurrent edits.
      await client.query(`LOCK TABLE ${[...new Set(mediaFields.map(([table]) => table))].map((table) => `public.${quote(table)}`).join(', ')} IN SHARE ROW EXCLUSIVE MODE`);
    }
    function check(value, kind, location) {
      try {
        const ref = mediaReference(value, kind);
        if (ref.external) report.external++;
        if (ref.key && !keys.has(ref.key)) report.missing.push({ location, key: ref.key });
        return ref.value;
      } catch (error) { report.invalid.push({ location, message: error.message }); return value; }
    }
    for (const [table, column, kind, array] of mediaFields) {
      for await (const row of rows(client, `SELECT id, ${quote(column)} AS value FROM public.${quote(table)}`)) {
        const location = `${table}.${column}:${row.id}`;
        const next = array && row.value !== null ? row.value.map((value) => check(value, kind, location)) : check(row.value, kind, location);
        if (JSON.stringify(next) !== JSON.stringify(row.value)) report.changes.push({ table, column, id: row.id, before: row.value, after: next });
      }
    }
    // Also inspect persisted JSON snapshots / rich descriptions for historical absolute URLs.
    function visit(value, location) {
      if (Array.isArray(value)) return value.forEach((item) => visit(item, location));
      if (value && typeof value === 'object') return Object.values(value).forEach((item) => visit(item, location));
      if (typeof value !== 'string') return;
      for (const match of value.matchAll(/https?:\/\/server\.mhhome\.shop\/public\/images\/[^"'<>\\\r\n]+/g)) {
        const url = match[0].replaceAll('&amp;', '&');
        const kind = url.includes('/public/images/videos/') ? 'videos' : url.includes('/public/images/thumbnails/') ? 'thumbnails' : 'images';
        check(url, kind, location);
      }
    }
    for (const table of await tables(client)) {
      for await (const row of rows(client, `SELECT to_jsonb(t) AS body FROM public.${quote(table)} t`)) visit(row.body, `${table}:embedded-url`);
    }
    // Persist the exact before/after mapping before making any changes.
    if (reportPath) await writeJson(reportPath, report);
    if (apply) {
      if (report.missing.length || report.invalid.length) throw new Error('Media audit has missing/invalid references; no database changes applied');
      if (!reportPath) throw new Error('An exclusive report file is required before normalization');
      for (const change of report.changes) {
        await client.query(`UPDATE public.${quote(change.table)} SET ${quote(change.column)} = $1 WHERE id = $2`, [change.after, change.id]);
      }
    }
    await client.query('COMMIT');
    return report;
  } catch (error) { await client.query('ROLLBACK'); throw error; }
}

async function main() {
  const { positionals: [command], values } = args({ output: { type: 'string' }, before: { type: 'string' }, after: { type: 'string' }, manifest: { type: 'string' } });
  if (command === 'compare') {
    const differences = compareSnapshots(await readJson(values.before), await readJson(values.after));
    if (differences.length) throw new Error(`Database mismatch: ${differences.join(', ')}`);
    console.log('All table counts/content hashes and sequence values match.');
    return;
  }
  if (!['snapshot', 'media'].includes(command)) throw new Error('Usage: database.mjs snapshot --output FILE | compare --before FILE --after FILE | media --manifest FILE --output FILE [--apply]');
  if (values.apply && (command !== 'media' || !process.env.TARGET_DATABASE_URL || process.env.MIGRATION_DATABASE_URL !== process.env.TARGET_DATABASE_URL || process.env.TARGET_DATABASE_URL === process.env.LEGACY_DATABASE_URL)) {
    throw new Error('--apply requires MIGRATION_DATABASE_URL to equal the explicit TARGET_DATABASE_URL, distinct from LEGACY_DATABASE_URL');
  }
  const client = new pg.Client({ connectionString: required(process.env.MIGRATION_DATABASE_URL, 'MIGRATION_DATABASE_URL'), connectionTimeoutMillis: 10000 });
  await client.connect();
  try {
    if (command === 'snapshot') {
      await writeJson(values.output, await snapshot(client));
      console.log('Database snapshot written (counts/hashes, sequences; no row data).');
    } else {
      required(values.output, '--output');
      const report = await auditMedia(client, await readJson(values.manifest), { apply: values.apply, reportPath: values.output });
      console.log(JSON.stringify({ normalizations: report.changes.length, missing: report.missing.length, invalid: report.invalid.length, applied: values.apply }));
      if (report.missing.length || report.invalid.length) process.exitCode = 1;
    }
  } finally { await client.end(); }
}

runMain(import.meta.url, main);
