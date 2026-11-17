import {photos} from './photos';
import type {PhotoKey} from './photos';

export interface Program {
  id: string;
  photo?: PhotoKey;
}

// Five programs, each with the photograph the 2025 profile uses for it. The
// pull-quote panel in ProgramSwitcher is kept as a fallback for any program
// that loses its photo, but nothing uses it today.
export const programs: Program[] = [
  {id: 'education', photo: 'library'},
  {id: 'environment', photo: 'terracing'},
  {id: 'livelihoods', photo: 'honey'},
  {id: 'health', photo: 'elders'},
  {id: 'peace', photo: 'peaceWorkshop'}
];

export {photos};
