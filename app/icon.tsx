import {ImageResponse} from 'next/og';

export const size = {width: 512, height: 512};
export const contentType = 'image/png';

/* PNG favicon generated from the same Globe E paths the site uses, so the SVG
   stays the single source and no rasteriser is needed in the toolchain.
   Next emits the <link> tags itself.

   This is the simplified favicon form from the brand kit - a solid disc with
   the Ethiopia tile lit and a coarse grid - because the full mark's fine
   stroke work disappears below about 32px. */
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{display: 'flex', width: '100%', height: '100%'}}>
        <svg viewBox="0 0 32 32" width={512} height={512}>
          <rect width="32" height="32" rx="7" fill="#0E2B22" />
          <circle cx="16" cy="16" r="11.5" fill="#F2F1EC" />
          <path d="M16 16H27.5A11.5 11.5 0 0 0 16 4.5Z" fill="#F0B43C" />
          <path d="M16 4V28M4 16H28" stroke="#0E2B22" strokeWidth="2.2" />
        </svg>
      </div>
    ),
    size
  );
}
