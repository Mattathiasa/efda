// Regenerates assets/js/locales.js from locales/*.json.
// Run after editing any locale file:  node tools/build-locales.mjs
// (locales.js exists so the design opens straight from disk, where fetch() of JSON is blocked.)
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const langs = ['en', 'am', 'om'];
const data = Object.fromEntries(
  langs.map((l) => [l, JSON.parse(readFileSync(join(root, 'locales', `${l}.json`), 'utf8'))])
);
const header = '/* Generated from locales/*.json by tools/build-locales.mjs. Do not edit by hand. */\n';
writeFileSync(join(root, 'assets/js/locales.js'), `${header}window.EFDA_LOCALES = ${JSON.stringify(data)};\n`);
console.log('assets/js/locales.js written for', langs.join(', '));
