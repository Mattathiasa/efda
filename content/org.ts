// Org-chart geometry, lifted verbatim from the design's about.html. The chart
// is a fixed 1120x632 box that scrolls sideways inside .org-wrap; below 720px
// the CSS hides it and shows the indented .org-list tree instead.

export interface OrgLine {
  axis: 'v' | 'h';
  left: number;
  top: number;
  /** height for vertical lines, width for horizontal ones */
  size: number;
  dashed?: boolean;
}

export interface OrgBox {
  /** key into t.about.chart */
  key: string;
  /** second line: another chart key, or a person's name in Latin script */
  sub?: {key: string} | {name: string};
  variant: 'board' | 'md' | 'audit' | 'l3' | 'l4';
  left: number;
  top: number;
}

export const orgLines: OrgLine[] = [
  {axis: 'v', left: 559, top: 96, size: 96},
  {axis: 'h', left: 560, top: 143, size: 420, dashed: true},
  {axis: 'v', left: 979, top: 144, size: 48, dashed: true},
  {axis: 'v', left: 559, top: 264, size: 48},
  {axis: 'h', left: 280, top: 311, size: 560},
  {axis: 'v', left: 279, top: 312, size: 48},
  {axis: 'v', left: 839, top: 312, size: 48},
  {axis: 'v', left: 279, top: 432, size: 48},
  {axis: 'h', left: 140, top: 479, size: 280},
  {axis: 'v', left: 139, top: 480, size: 48},
  {axis: 'v', left: 419, top: 480, size: 48},
  {axis: 'v', left: 839, top: 432, size: 48},
  {axis: 'h', left: 700, top: 479, size: 280},
  {axis: 'v', left: 699, top: 480, size: 48},
  {axis: 'v', left: 979, top: 480, size: 48}
];

export const orgBoxes: OrgBox[] = [
  {key: 'board', sub: {key: 'boardSub'}, variant: 'board', left: 448, top: 24},
  {key: 'md', sub: {name: 'Guta Abdi'}, variant: 'md', left: 448, top: 192},
  {key: 'auditor', sub: {key: 'auditorSub'}, variant: 'audit', left: 868, top: 192},
  {key: 'pm', sub: {name: 'Dechassa Sisay'}, variant: 'l3', left: 168, top: 360},
  {key: 'fa', variant: 'l3', left: 728, top: 360},
  {key: 'pi', sub: {key: 'piSub'}, variant: 'l4', left: 28, top: 528},
  {key: 'me', variant: 'l4', left: 308, top: 528},
  {key: 'fin', variant: 'l4', left: 588, top: 528},
  {key: 'hr', variant: 'l4', left: 868, top: 528}
];
