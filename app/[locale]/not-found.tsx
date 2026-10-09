import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {SiteHeader} from '@/components/SiteHeader';
import {SiteFooter} from '@/components/SiteFooter';

export default function NotFound() {
  const c = useTranslations('common');

  return (
    <>
      <SiteHeader variant="light" />
      <main id="main">
        <section className="section page-head">
          <div className="container">
            <p className="label">404</p>
            <h1 className="h-page">Page not found.</h1>
            <div className="btn-row btn-top">
              <Link className="btn btn--primary" href="/">
                {c('homeAria')}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter variant="simple" ns="contact" />
    </>
  );
}
