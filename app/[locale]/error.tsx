'use client';

import {useEffect} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {SiteHeader} from '@/components/SiteHeader';
import {SiteFooter} from '@/components/SiteFooter';
import {site} from '@/content/site';

/* Error boundary for everything inside [locale]. Branded and translated -
   without it a runtime error falls through to Next's default page, which is
   unstyled and English-only on a trilingual site.

   The phone number is here on purpose: if the page itself is broken, the
   contact form on it may be too, and a funder should still be able to reach
   someone. */
export default function Error({
  error,
  reset
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  const c = useTranslations('common');

  useEffect(() => {
    // The digest is what correlates this with the server log.
    console.error('[efda] render error:', error.digest ?? error.message);
  }, [error]);

  return (
    <>
      <SiteHeader variant="light" />

      <main id="main">
        <section className="section page-head">
          <div className="container">
            <p className="label">Error</p>
            <div className="split split--wide" style={{gap: '32px 80px'}}>
              <h1 className="h-page">{c('errorTitle')}</h1>
              <p className="lead">{c('errorBody')}</p>
            </div>
            <div className="btn-row btn-top">
              <button className="btn btn--primary" type="button" onClick={reset}>
                {c('errorRetry')}
              </button>
              <Link className="btn btn--dark" href="/">
                {c('backHome')}
              </Link>
              <a className="btn btn--ghost" href={`tel:${site.phone.tel}`} style={{borderColor: 'var(--line)', color: 'var(--ink)'}}>
                {site.phone.display}
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter variant="simple" ns="contact" />
    </>
  );
}
