export type Theme = 'edu' | 'live' | 'health' | 'peace';
export type Region = 'or' | 'bg';

export interface Project {
  id: string;
  theme: Theme;
  region: Region;
}

// Seven projects, in the order the locale files list them. Words live in
// t.projects.projects[i] and t.home.projects[i]; only the filter keys are here.
export const projects: Project[] = [
  {id: 'speed-school-woliso', theme: 'edu', region: 'or'},
  {id: 'speed-school-sibu-sire', theme: 'edu', region: 'or'},
  {id: 'enset-woliso', theme: 'live', region: 'or'},
  {id: 'peacebuilding-west-wollega', theme: 'peace', region: 'or'},
  {id: 'national-dialogue', theme: 'peace', region: 'or'},
  {id: 'reproductive-health-arsi', theme: 'health', region: 'or'},
  {id: 'education-quality-bg', theme: 'edu', region: 'bg'}
];

export const themeKeys: Theme[] = ['edu', 'live', 'health', 'peace'];
export const regionKeys: Region[] = ['or', 'bg'];
