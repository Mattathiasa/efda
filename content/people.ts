export interface Person {
  name: string;
  initials: string;
  badge?: 'chair' | 'md';
  /** Portraits are open item 4; initials stand in until they arrive. */
  portrait?: string;
}

// Names stay in Latin script until EFDA supplies each person's own Ge'ez
// spelling (open item 12). Roles come from t.about.roles[i].
export const board: Person[] = [
  {name: 'Ililli Hordofa', initials: 'IH', badge: 'chair'},
  {name: 'Guta Abdi', initials: 'GA', badge: 'md'},
  {name: 'Nardos Chuta', initials: 'NC'},
  {name: 'Gemechis Tiruneh', initials: 'GT'},
  {name: 'Asfaw Kaba', initials: 'AK'},
  {name: 'Sr. Zehara Kedir', initials: 'ZK'}
];
