import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

// Next 16 renamed `middleware` to `proxy`. This negotiates the locale on `/`
// (NEXT_LOCALE cookie first, then Accept-Language) and redirects to the
// prefixed route. It cannot run under `output: 'export'`, which is why the
// site is server-rendered.
export default createMiddleware(routing);

export const config = {
  // Excludes API routes, Next internals, and anything with a file extension.
  // The three dotless metadata routes have to be named explicitly, or locale
  // negotiation redirects /icon to /en/icon - which silently breaks the
  // manifest's icon references and every raster favicon request. Anchored
  // with $ so a future /icons page would still be localized.
  matcher: '/((?!api|_next|_vercel|icon$|apple-icon$|manifest\\.webmanifest$|.*\\..*).*)'
};
