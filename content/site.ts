// Organisation-level constants. These are the same in every language.
//
// Contact details here are EFDA's ORGANISATIONAL ones: the head-office
// landline, the mailbox EFDA puts on its own letterhead and profile, and the
// registered street address. They are published by EFDA itself and belong to
// the organisation rather than to any individual, so they ship in the source
// the way the P.O. box and city always have.
//
// What still must NOT ship here is personal data - a director's mobile, a
// staff member's own mailbox. Those stay in the environment or the settings
// table, which is what content/contacts.ts is for.
//
// Every value below can still be overridden per deployment by its env var,
// and the settings table overrides that again at runtime.
export const site = {
  // Replace once EFDA controls edu-development.org (open item 16).
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://edu-development.org',

  // Head-office landline, from EFDA's governance file. An organisational line
  // survives staff changes; a mobile does not.
  phone: {
    display: process.env.NEXT_PUBLIC_SITE_PHONE_DISPLAY ?? '+251 11 259 4649',
    tel: process.env.NEXT_PUBLIC_SITE_PHONE_TEL ?? '+251112594649'
  },

  // EFDA's working mailbox. A free webmail address is not ideal on a public
  // page, but it reaches them - and a role address on a domain EFDA does not
  // yet own would bounce, which costs real enquiries. Swap this the day
  // edu-development.org is registered.
  email: process.env.NEXT_PUBLIC_SITE_EMAIL ?? 'efhda@yahoo.com',

  poBox: 'P.O. Box 25725, Code 1000',
  // From EFDA's 2025 profile. The 2016 TIN certificate gives the same
  // sub-city but an older woreda and house number - see the README.
  street: 'Gullele Sub City, Woreda 9, House No. 430',
  city: 'Addis Ababa, Ethiopia',
  csoNumber: '0035',
  tin: '0004826138',
  founded: '1999'
};
