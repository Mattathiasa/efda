import {ImageResponse} from 'next/og';

export const size = {width: 180, height: 180};
export const contentType = 'image/png';

/* iOS home-screen icon. No rounded corners of our own - iOS applies its own
   mask - and no transparency, which iOS would render as black. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: '#0E2B22'
        }}
      >
        <svg viewBox="8 8 84 84" width={132} height={132}>
          <circle cx="50" cy="50" r="40" fill="#F2F1EC" />
          <path d="M50 50H70A20 40 0 0 0 67.32 30H50Z" fill="#F0B43C" />
          <g fill="none" stroke="#0E2B22" strokeWidth="3.6">
            <ellipse cx="50" cy="50" rx="20" ry="40" />
            <ellipse cx="50" cy="50" rx="34.64" ry="40" />
            <path d="M50 10V90M10 50H90M15.36 30H84.64M15.36 70H84.64" />
          </g>
          <circle cx="50" cy="50" r="38.3" fill="none" stroke="#F2F1EC" strokeWidth="3.4" />
        </svg>
      </div>
    ),
    size
  );
}
