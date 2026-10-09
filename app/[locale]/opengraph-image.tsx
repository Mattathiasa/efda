import {ImageResponse} from 'next/og';

export const size = {width: 1200, height: 630};
export const contentType = 'image/png';
export const alt = 'EFDA — Education For Development Association';

/* The Globe E mark on forest with the wordmark.

   Deliberately text-light: the wordmark is "efda" in every language, and the
   localized title and description already travel in og:title and
   og:description. Rendering the Amharic name here would mean shipping a TTF
   of Noto Sans Ethiopic purely for image generation - the site's own fonts
   are woff2, which the image renderer cannot read. */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 48,
          background: '#0E2B22'
        }}
      >
        <svg viewBox="8 8 84 84" width="260" height="260">
          <circle cx="50" cy="50" r="40" fill="#F2F1EC" />
          <path d="M50 50H70A20 40 0 0 0 67.32 30H50Z" fill="#F0B43C" />
          <g fill="none" stroke="#0E2B22" strokeWidth="3.6">
            <ellipse cx="50" cy="50" rx="20" ry="40" />
            <ellipse cx="50" cy="50" rx="34.64" ry="40" />
            <path d="M50 10V90M10 50H90M15.36 30H84.64M15.36 70H84.64" />
          </g>
          <circle cx="50" cy="50" r="38.3" fill="none" stroke="#F2F1EC" strokeWidth="3.4" />
        </svg>

        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div style={{fontSize: 150, color: '#F2F1EC', letterSpacing: -6, lineHeight: 1}}>
            efda
          </div>
          <div style={{fontSize: 30, color: '#A9BDB2', marginTop: 16}}>
            Education For Development Association
          </div>
        </div>
      </div>
    ),
    size
  );
}
