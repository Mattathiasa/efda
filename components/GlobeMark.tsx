/* The Globe E mark. Gaps between tiles are real cut-outs, so the mark works on
   any background. Variants differ only in which three colours fill the disc,
   the Ethiopia tile and the grid. Never recolour single tiles or rotate it. */

type Variant = 'forest' | 'reversed' | 'white' | 'badge';

const palettes: Record<Variant, {disc: string; tile: string; grid: string}> = {
  // Primary, on chalk / paper / white.
  forest: {disc: '#0E2B22', tile: '#B5491F', grid: '#F2F1EC'},
  // On forest or other dark grounds.
  reversed: {disc: '#F2F1EC', tile: '#F0B43C', grid: '#0E2B22'},
  // One colour, on laterite or photos.
  white: {disc: '#FFFFFF', tile: '#0E2B22', grid: '#0E2B22'},
  // Inside the rotating laterite badge.
  badge: {disc: '#F2F1EC', tile: '#0E2B22', grid: '#B5491F'}
};

export function GlobeMark({
  variant = 'forest',
  size = 44,
  className
}: {
  variant?: Variant;
  size?: number;
  className?: string;
}) {
  const {disc, tile, grid} = palettes[variant];
  const ring = variant === 'forest' ? '#0E2B22' : '#F2F1EC';

  return (
    <svg
      className={className}
      viewBox="8 8 84 84"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="50" cy="50" r="40" fill={disc} />
      <path d="M50 50H70A20 40 0 0 0 67.32 30H50Z" fill={tile} />
      <g fill="none" stroke={grid} strokeWidth="3.6">
        <ellipse cx="50" cy="50" rx="20" ry="40" />
        <ellipse cx="50" cy="50" rx="34.64" ry="40" />
        <path d="M50 10V90M10 50H90M15.36 30H84.64M15.36 70H84.64" />
      </g>
      <circle cx="50" cy="50" r="38.3" fill="none" stroke={ring} strokeWidth="3.4" />
    </svg>
  );
}

/* Outline-only globe used as a large decorative watermark behind the hero, the
   call-to-action band and the contact form. Built from the same paths with
   fill: none (set in CSS via .watermark). */
export function GlobeWatermark({
  className,
  tile
}: {
  className?: string;
  /** Fill colour for the lit Ethiopia tile, or omit to leave it outlined. */
  tile?: {fill: string; opacity?: number};
}) {
  return (
    <svg className={className} viewBox="8 8 84 84" aria-hidden="true" focusable="false">
      <circle cx="50" cy="50" r="40" />
      <ellipse cx="50" cy="50" rx="20" ry="40" />
      <ellipse cx="50" cy="50" rx="34.64" ry="40" />
      <path d="M50 10V90M10 50H90M15.36 30H84.64M15.36 70H84.64" />
      {tile ? (
        <path
          d="M50 50H70A20 40 0 0 0 67.32 30H50Z"
          style={{fill: tile.fill, stroke: 'none', opacity: tile.opacity}}
        />
      ) : null}
    </svg>
  );
}
