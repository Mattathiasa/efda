export interface Contact {
  name: string;
  phone: {display: string; tel: string};
  email: string;
}

// The people EFDA lists on the Contact page, and how to reach them.
//
// Names, phones and mailboxes are NOT committed here. Each one is a visible
// placeholder that renders on the page until it is supplied at deploy time -
// scripts/check-placeholders.mjs lists anything still in [BRACKETS] rather
// than letting it render silently blank. The `key` on each row is the email
// placeholder, which is unique per person and never a real address.
//
// To publish real details, set these per-person environment variables and
// rebuild. The placeholders stay in the source so the page never ships with
// a blank slot where a phone number should be:
//   NEXT_PUBLIC_CONTACT_0_NAME, NEXT_PUBLIC_CONTACT_0_PHONE_DISPLAY,
//   NEXT_PUBLIC_CONTACT_0_PHONE_TEL, NEXT_PUBLIC_CONTACT_0_EMAIL
//   NEXT_PUBLIC_CONTACT_1_NAME, ... and so on for each row.
const row = (i: number): Contact => {
  const p = (k: string) => process.env[`NEXT_PUBLIC_CONTACT_${i}_${k}`] ?? '';
  const name = p('NAME') || `[PERSON ${i + 1} — CONFIRM]`;
  const display = p('PHONE_DISPLAY') || `[PHONE — CONFIRM]`;
  const tel = p('PHONE_TEL') || '+251XXXXXXXXX';
  const email = p('EMAIL') || `[EMAIL — CONFIRM]`;
  return {name, phone: {display, tel}, email};
};

export const contacts: Contact[] = [row(0), row(1), row(2)];