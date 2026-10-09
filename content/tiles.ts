import type {PhotoKey} from './photos';

export interface Tile {
  photo: PhotoKey;
  wide?: boolean;
  tall?: boolean;
  /** Caption headline is a word rather than a number - smaller type. */
  word?: boolean;
}

// Ten track-record tiles, matching projects.tiles[i] in the locale files.
export const tiles: Tile[] = [
  {photo: 'treeClass', wide: true, tall: true},
  {photo: 'library'},
  {photo: 'terraces'},
  {photo: 'hives'},
  {photo: 'apples'},
  {photo: 'sewing', wide: true},
  {photo: 'hydro'},
  {photo: 'stoves', wide: true, word: true},
  {photo: 'elders', word: true},
  {photo: 'pottery', wide: true, word: true}
];
