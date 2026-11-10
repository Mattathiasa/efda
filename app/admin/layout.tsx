import type {Metadata} from 'next';

/* Its own root layout: there is no shared app/layout.tsx (see
   app/global-error.tsx for the same situation), and this area is
   deliberately outside app/[locale] - it's internal tooling, not public,
   multi-language content. No NextIntlClientProvider, no theme-init script,
   no analytics. */

import '@/styles/styles.css';
import '@/styles/admin.css';

export const metadata: Metadata = {
  title: 'EFDA admin',
  robots: {index: false, follow: false}
};

export default function AdminLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="admin-shell">{children}</body>
    </html>
  );
}
