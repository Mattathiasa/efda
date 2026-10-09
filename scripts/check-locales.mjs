/* Asserts the three locale files carry identical key sets. Arrays are indexed
   by position in the components, so a missing or extra entry in one language
   silently shifts content - this catches that before it ships. */
import {readFileSync} from 'node:fs';

const LANGS = ['en', 'am', 'om'];
const read = (lang) =>
  JSON.parse(readFileSync(new URL(`../locales/${lang}.json`, import.meta.url), 'utf8'));

function leaves(value, path = '') {
  if (Array.isArray(value)) return value.flatMap((v, i) => leaves(v, `${path}[${i}]`));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k));
  }
  return [path];
}

const files = Object.fromEntries(LANGS.map((lang) => [lang, read(lang)]));
const base = new Set(leaves(files.en));
let failed = false;

for (const lang of LANGS.slice(1)) {
  const other = new Set(leaves(files[lang]));
  const missing = [...base].filter((k) => !other.has(k));
  const extra = [...other].filter((k) => !base.has(k));

  if (missing.length || extra.length) {
    failed = true;
    console.error(`\n${lang}.json differs from en.json:`);
    missing.forEach((k) => console.error(`  missing: ${k}`));
    extra.forEach((k) => console.error(`  extra:   ${k}`));
  }
}

for (const lang of LANGS) {
  const status = files[lang]._meta?.status ?? '';
  if (/draft/i.test(status)) {
    console.warn(`note: ${lang}.json is still a DRAFT - needs native-speaker review`);
  }
}

if (failed) {
  console.error('\nLocale key sets do not match.');
  process.exit(1);
}

console.log(`All three locale files share ${base.size} keys.`);
