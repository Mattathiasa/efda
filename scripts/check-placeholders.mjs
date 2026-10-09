/* Lists every [BRACKETED] placeholder still on the site. Launch checklist item
   one is "no bracketed placeholder left on any page, in any language", so this
   is the check for it. Exits non-zero only with --strict, so it runs
   informationally day to day and as a gate at launch. */
import {readFileSync, readdirSync} from 'node:fs';

const strict = process.argv.includes('--strict');
const found = [];

function walk(value, path, file) {
  if (typeof value === 'string') {
    const hits = value.match(/\[[^\]]+\]/g);
    if (hits) hits.forEach((h) => found.push({file, path, text: h}));
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => walk(v, `${path}[${i}]`, file));
    return;
  }
  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([k, v]) => walk(v, path ? `${path}.${k}` : k, file));
  }
}

for (const lang of ['en', 'am', 'om']) {
  const file = `locales/${lang}.json`;
  walk(JSON.parse(readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')), '', file);
}

// content/ holds names, phones and images; a placeholder there shows on the
// page just as a locale one does. Comments are skipped.
const contentDir = new URL('../content/', import.meta.url);
for (const name of readdirSync(contentDir)) {
  if (!name.endsWith('.ts')) continue;
  readFileSync(new URL(name, contentDir), 'utf8')
    .split('\n')
    .forEach((line, i) => {
      const trimmed = line.trimStart();
      if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
      const hits = line.match(/'\[[^\]]+\]'|"\[[^\]]+\]"/g);
      if (hits) {
        hits.forEach((h) =>
          found.push({file: `content/${name}`, path: `line ${i + 1}`, text: h})
        );
      }
    });
}

if (!found.length) {
  console.log('No bracketed placeholders remain.');
  process.exit(0);
}

const unique = new Map();
for (const f of found) {
  if (!unique.has(f.text)) unique.set(f.text, []);
  unique.get(f.text).push(`${f.file}:${f.path}`);
}

console.log(`${unique.size} open content item(s), ${found.length} occurrence(s):\n`);
for (const [text, where] of unique) {
  console.log(`  ${text}`);
  where.forEach((w) => console.log(`      ${w}`));
}

if (strict) {
  console.error('\nPlaceholders must be resolved before launch.');
  process.exit(1);
}
