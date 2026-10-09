import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

// Next 16 renamed `middleware` to `proxy`. This negotiates the locale on `/`
// (NEXT_LOCALE cookie first, then Accept-Language) and redirects to the
// prefixed route. It cannot run under `output: 'export'`, which is why the
// site is server-rendered.
export default createMiddleware(routing);

export const config = {
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)'
};
