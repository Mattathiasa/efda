import type {PhotoKey} from './photos';

export interface Office {
  id: 'woliso' | 'shambu' | 'asosa' | 'arsi';
  photo?: PhotoKey;
  /** Staffed today, per EFDA's current staff roster. Shambu and Asosa served
      earlier programme phases; whether they are closed, dormant or simply
      unstaffed is an open question - see the README. */
  active?: boolean;
}

// Entries without a photo render a labelled panel instead; the label is
// officeCopy[i].photoNote, so each one says why it has no photograph.
// Guna and Merti is a field team, not a building - open item 5 is the Asosa
// office photo only.
export const offices: Office[] = [
  {id: 'woliso', photo: 'officeWoliso', active: true},
  {id: 'arsi', active: true},
  {id: 'shambu', photo: 'officeShambu'},
  {id: 'asosa'}
];
