// Organisation-level constants. These are the same in every language.
//
// Contact details are NOT hardcoded here. They come from the environment, so
// no personal mailbox or mobile number ships in the source. The placeholders
// below are visible on the page until they are set, which is intentional -
// see scripts/check-placeholders.mjs, which lists anything still in
// [BRACKETS] rather than letting it render silently blank.
export const site = {
  // Replace once EFDA controls edu-development.org (open item 16).
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://edu-development.org',

  phone: {
    display: process.env.NEXT_PUBLIC_SITE_PHONE_DISPLAY ?? '[PHONE — CONFIRM]',
    tel: process.env.NEXT_PUBLIC_SITE_PHONE_TEL ?? '+251XXXXXXXXX'
  },

  // A personal mailbox on a public page attracts spam. Use a role address
  // (info@, programs@) once EFDA has a domain of its own.
  email: process.env.NEXT_PUBLIC_SITE_EMAIL ?? '[EMAIL — CONFIRM]',

  poBox: 'P.O. Box 25725, Code 1000',
  city: 'Addis Ababa, Ethiopia',
  csoNumber: '0035',
  founded: '1999'
};
