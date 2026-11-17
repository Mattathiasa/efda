import type {PhotoKey} from './photos';

export interface Area {
  id: string;
  photo: PhotoKey;
}

// The eight areas EFDA's 2025 profile lists as its experience. They overlap
// the five current programs rather than extending them - this is the historical
// inventory, not the portfolio. Titles live in t.about.areas[i], by position.
export const areas: Area[] = [
  {id: 'livelihood', photo: 'kochoProcessing'},
  {id: 'education', photo: 'eldersTeaching'},
  {id: 'environment', photo: 'ploughing'},
  {id: 'peace', photo: 'peaceElders'},
  {id: 'health', photo: 'healthGirls'},
  {id: 'rural', photo: 'chituIsland'},
  {id: 'skills', photo: 'shoeWorkshop'},
  {id: 'women', photo: 'handpump'}
];
