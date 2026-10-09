/* Generates a micro-subset of Noto Sans Ethiopic holding only the glyphs in
   EFDA's Amharic name.

   That name appears in the header lockup and the footer on every page, in
   every language. Without this, an English or Afaan Oromoo visitor downloads
   the full 193 KB Ethiopic face to render eighteen characters - a real cost
   on the mid-range Android phone over a mobile connection this site is
   designed for.

   The subset is declared as its own family, listed ahead of the full face in
   the font stacks. Because @font-face only fetches when a glyph in its
   unicode-range is actually rendered, English and Oromo pages now stop at the
   subset, while Amharic pages still pull the full face for body text.

   Re-run with: node scripts/subset-lockup-font.mjs */
import {readFileSync, writeFileSync} from 'node:fs';
import subsetFont from 'subset-font';

const LOCKUP = 'ትምህርት ለልማት ማህበር';

const src = new URL('../public/fonts/noto-sans-ethiopic-ethiopic-wght-normal.woff2', import.meta.url);
const out = new URL('../public/fonts/noto-sans-ethiopic-lockup.woff2', import.meta.url);

const original = readFileSync(src);
const subset = await subsetFont(original, LOCKUP, {targetFormat: 'woff2'});

writeFileSync(out, subset);

const chars = [...new Set(LOCKUP.replace(/\s/g, ''))].length;
console.log(
  `Subset ${chars} glyphs: ${(original.length / 1024).toFixed(0)} KB -> ` +
    `${(subset.length / 1024).toFixed(1)} KB`
);
