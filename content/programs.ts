import {photos} from './photos';
import type {PhotoKey} from './photos';

export interface Program {
  id: string;
  photo?: PhotoKey;
}

// Five programs. Program 5 has no photo, so the detail panel shows a pull
// quote instead - see open item 6 (a peacebuilding photo).
export const programs: Program[] = [
  {id: 'education', photo: 'library'},
  {id: 'environment', photo: 'terracing'},
  {id: 'livelihoods', photo: 'honey'},
  {id: 'health', photo: 'elders'},
  {id: 'peace'}
];

export {photos};
