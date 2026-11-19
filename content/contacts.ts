import {site} from './site';

export interface Contact {
  name: string;
  phone: {display: string; tel: string};
  email: string;
}

// The people EFDA lists on the Contact page.
//
// Names are here because they are not private - EFDA publishes all three in
// its own organisational profile, and the board is named on the About page
// already. Their PHONE NUMBERS AND MAILBOXES ARE NOT. The only ones EFDA has
// supplied are personal mobiles and personal Gmail accounts, and a public
// page is the wrong place for either.
//
// So every row defaults to the organisation's own landline and mailbox: one
// shared channel, reached through whoever is on the desk, rather than three
// people's private details that go stale the moment someone leaves.
//
// A deployment that does have role addresses - programs@, finance@ - can set
// them per person without touching this file:
//   NEXT_PUBLIC_CONTACT_0_NAME, NEXT_PUBLIC_CONTACT_0_PHONE_DISPLAY,
//   NEXT_PUBLIC_CONTACT_0_PHONE_TEL, NEXT_PUBLIC_CONTACT_0_EMAIL
//   NEXT_PUBLIC_CONTACT_1_NAME, ... and so on for each row.
// The settings table at /admin/settings overrides those again at runtime.
const row = (i: number, name: string): Contact => {
  const p = (k: string) => process.env[`NEXT_PUBLIC_CONTACT_${i}_${k}`] ?? '';
  return {
    name: p('NAME') || name,
    phone: {
      display: p('PHONE_DISPLAY') || site.phone.display,
      tel: p('PHONE_TEL') || site.phone.tel
    },
    email: p('EMAIL') || site.email
  };
};

export const contacts: Contact[] = [
  row(0, 'Guta Abdi'),
  row(1, 'Dechassa Sisay'),
  row(2, 'Tucho Enkossa')
];
