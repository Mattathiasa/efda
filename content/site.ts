// Organisation-level constants. These are the same in every language.
export const site = {
  // Replace once EFDA controls edu-development.org (open item 16).
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://edu-development.org',

  phone: {display: '+251 911 218 169', tel: '+251911218169'},

  // TODO(EFDA): swap for role addresses (info@, programs@) once the domain
  // exists. A personal mailbox on a public page also attracts spam.
  email: 'efhda@yahoo.com',

  poBox: 'P.O. Box 25725, Code 1000',
  city: 'Addis Ababa, Ethiopia',
  csoNumber: '0035',
  founded: '1999'
};
