import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {SiteHeader} from '@/components/SiteHeader';
import {SiteFooter} from '@/components/SiteFooter';
import {ArrowRight} from '@/components/icons';

export default function NotFound() {
  const c = useTranslations('common');

  return (
    <>
      <a className="skip-link" href="#main">
        {c('skip')}
      </a>
      <SiteHeader variant="light" />

      <main id="main">
        <section className="section page-head">
          <div className="container">
            <p className="label">404</p>
            <div className="split split--wide" style={{gap: '32px 80px'}}>
              <h1 className="h-page">{c('notFoundTitle')}</h1>
              <p className="lead">{c('notFoundBody')}</p>
            </div>
            <div className="btn-row btn-top">
              <Link className="btn btn--primary" href="/">
                <span>{c('backHome')}</span>
                <ArrowRight />
              </Link>
              <Link className="btn btn--dark" href="/contact">
                {c('navContact')}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter variant="simple" ns="contact" />
    </>
  );
}
