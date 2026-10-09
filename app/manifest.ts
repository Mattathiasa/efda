import type {MetadataRoute} from 'next';

/* Makes the site installable to an Android home screen, which is worth having
   for an audience that reaches it mostly by phone. Icons come from
   app/icon.tsx, generated at build from the same Globe E paths. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EFDA — Education For Development Association',
    short_name: 'EFDA',
    description:
      'Education For Development Association works alongside rural communities in Oromia and Benishangul Gumuz.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0E2B22',
    theme_color: '#0E2B22',
    // The locale the manifest itself is written in; each page still declares
    // its own via <html lang>.
    lang: 'en',
    dir: 'ltr',
    categories: ['education', 'nonprofit'],
    icons: [
      {src: '/icon', sizes: '512x512', type: 'image/png', purpose: 'any'},
      {src: '/apple-icon', sizes: '180x180', type: 'image/png'}
    ]
  };
}
