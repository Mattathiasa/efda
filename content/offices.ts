import type {PhotoKey} from './photos';

export interface Office {
  id: 'woliso' | 'shambu' | 'asosa';
  photo?: PhotoKey;
  /** Staffed today, per EFDA's current staff roster. Shambu and Asosa served
      earlier programme phases; whether they are closed, dormant or simply
      unstaffed is an open question - see the README. */
  active?: boolean;
}

// Asosa has no photo yet - open item 5. The card shows a labelled panel.
export const offices: Office[] = [
  {id: 'woliso', photo: 'officeWoliso', active: true},
  {id: 'shambu', photo: 'officeShambu'},
  {id: 'asosa'}
];
