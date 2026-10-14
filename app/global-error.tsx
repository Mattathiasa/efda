'use client';

import {site} from '@/content/site';

/* Last line of defence: catches an error in the root layout itself, which
   means it must render its own <html> and <body>.

   Deliberately English-only and self-contained. If the layout failed, the
   locale may never have resolved and the translation bundle may not have
   loaded, so reaching for useTranslations here could throw a second time
   inside the handler for the first. Styles are inline for the same reason -
   the stylesheet is imported by the layout that just failed. The contact
   details come from the shared site config rather than being repeated here,
   so this fallback and the live site can never disagree. */
export default function GlobalError({
  error,
  reset
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0E2B22',
          color: '#F2F1EC',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          padding: 32
        }}
      >
        <main style={{maxWidth: 520}}>
          <svg viewBox="8 8 84 84" width="64" height="64" aria-hidden="true">
            <circle cx="50" cy="50" r="40" fill="#F2F1EC" />
            <path d="M50 50H70A20 40 0 0 0 67.32 30H50Z" fill="#F0B43C" />
            <g fill="none" stroke="#0E2B22" strokeWidth="3.6">
              <ellipse cx="50" cy="50" rx="20" ry="40" />
              <ellipse cx="50" cy="50" rx="34.64" ry="40" />
              <path d="M50 10V90M10 50H90M15.36 30H84.64M15.36 70H84.64" />
            </g>
            <circle cx="50" cy="50" r="38.3" fill="none" stroke="#F2F1EC" strokeWidth="3.4" />
          </svg>

          <h1 style={{fontSize: 34, lineHeight: 1.1, margin: '24px 0 12px', letterSpacing: '-0.03em'}}>
            Something went wrong.
          </h1>
          <p style={{margin: 0, lineHeight: 1.6, color: '#C9D6CE'}}>
            This page could not be loaded. Please try again, or call EFDA on{' '}
            <a href={`tel:${site.phone.tel}`} style={{color: '#F0B43C'}}>
              {site.phone.display}
            </a>
            .
          </p>

          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 28,
              minHeight: 52,
              padding: '0 24px',
              borderRadius: 999,
              border: 0,
              cursor: 'pointer',
              background: '#B5491F',
              color: '#fff',
              font: 'inherit',
              fontWeight: 600
            }}
          >
            Try again
          </button>

          {error.digest ? (
            <p style={{marginTop: 24, fontSize: 12, color: '#8FA89A'}}>
              Reference: {error.digest}
            </p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
