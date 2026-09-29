import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';

export function args(options) {
  return parseArgs({ options: { apply: { type: 'boolean', default: false }, ...options }, allowPositionals: true });
}

export function required(value, name) {
  if (!value) throw new Error(`${name} is required`);
  return value;
}

export async function readJson(path) {
  return JSON.parse(await readFile(required(path, 'JSON file'), 'utf8'));
}

// Never replace an earlier audit/backup by accident.
export async function writeJson(path, value) {
  await writeFile(required(path, 'output file'), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
}

export async function sha256Stream(stream) {
  const hash = createHash('sha256');
  for await (const chunk of stream) hash.update(chunk);
  return hash.digest('hex');
}

export const sha256File = (path) => sha256Stream(createReadStream(path));

export function runMain(url, main) {
  if (process.argv[1] && pathToFileURL(process.argv[1]).href === url) {
    main().catch((error) => {
      // These tools never print connection URLs or environment contents.
      console.error(error.message);
      process.exitCode = 1;
    });
  }
}
