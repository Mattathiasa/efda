export interface Contact {
  name: string;
  phone: {display: string; tel: string};
  email: string;
}

// TODO(EFDA): these are personal mailboxes. Swap for role addresses
// (info@, programs@) once the domain exists - open item 16.
// Departments and roles come from t.contact.people[i].
export const contacts: Contact[] = [
  {
    name: 'Guta Abdi',
    phone: {display: '+251 911 218 169', tel: '+251911218169'},
    email: 'efhda@yahoo.com'
  },
  {
    name: 'Dechassa Sisay',
    phone: {display: '+251 912 457 529', tel: '+251912457529'},
    email: 'dasiadu2@gmail.com'
  },
  {
    name: 'Tucho Enkossa',
    phone: {display: '+251 911 962 639', tel: '+251911962639'},
    email: 'tuchoenkossa12@gmail.com'
  }
];
