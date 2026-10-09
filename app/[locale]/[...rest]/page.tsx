import {notFound} from 'next/navigation';

/* Catch-all so unmatched URLs get the branded, translated 404.

   Next renders the ROOT not-found.tsx for an unmatched URL, and this app's
   root layout lives at app/[locale]/layout.tsx - so a not-found nested inside
   [locale] is never reached on its own. Calling notFound() from a route that
   does match puts the visitor inside the locale layout, where the translated
   page and the normal header and footer exist.

   Static segments outrank a catch-all, so /en/about still resolves to the
   real About page. Unprefixed paths reach here too: proxy.ts sends /nope to
   /en/nope first.

   Note for anyone adding a loading.tsx at the [locale] level: don't. A
   streaming boundary above this route commits a 200 before notFound() can
   set the status, turning every missing page into a soft 404. */
export default function CatchAll() {
  notFound();
}
