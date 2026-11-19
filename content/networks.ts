// The networks and consortia EFDA belongs to, from the membership list in its
// due-diligence folder. Corroborated by the 2024-2028 strategic plan, which
// names the same bodies, and by CCRDA's own 2016 letter confirming membership.
//
// Names stay in Latin script in every language, like content/funders.ts.
// Expansions live in the locale copy so they can be translated.
export interface Network {
  abbr: string;
}

export const networks: Network[] = [
  {abbr: 'CCRDA'},
  {abbr: 'BGDAN'},
  {abbr: 'NeCSOO'},
  {abbr: 'NaSAC'},
  {abbr: 'PELUM Ethiopia'},
  {abbr: 'CECOE'},
  {abbr: 'BEN'},
  {abbr: 'COSAP'}
];
