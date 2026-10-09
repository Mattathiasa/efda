import type {PhotoKey} from './photos';

export interface Office {
  id: 'woliso' | 'shambu' | 'asosa';
  photo?: PhotoKey;
}

// Asosa has no photo yet - open item 5. The card shows a labelled panel.
export const offices: Office[] = [
  {id: 'woliso', photo: 'officeWoliso'},
  {id: 'shambu', photo: 'officeShambu'},
  {id: 'asosa'}
];
