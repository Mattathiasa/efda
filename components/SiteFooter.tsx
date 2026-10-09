import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {GlobeMark} from './GlobeMark';
import {site} from '@/content/site';

type Variant = 'full' | 'cta' | 'simple';

function Brand() {
  return (
    <div className="footer-brand">
      <GlobeMark variant="reversed" size={50} />
      <span>efda</span>
    </div>
  );
}

/* Three shapes, one per page family:
   full   - Home: brand, contact, field offices, explore links, legal line
   cta    - About and Projects: a call to action above a compact end row
   simple - Contact: brand, org name and the legal line only */
export function SiteFooter({
  variant,
  ns
}: {
  variant: Variant;
  /** Namespace holding this page's footer copy. */
  ns: 'home' | 'about' | 'projects' | 'contact';
}) {
  const t = useTranslations(ns);
  const c = useTranslations('common');

  if (variant === 'simple') {
    return (
      <footer className="site-footer on-dark">
        <div className="container">
          <div className="site-footer__grid site-footer__grid--simple">
            <Brand />
            <p
              className="footer-org"
              style={{fontSize: 15, lineHeight: 1.7, color: 'var(--mist)'}}
            >
              <span>{t('orgName')}</span>
              <br />
              <span className="ge" lang="am">
                ትምህርት ለልማት ማህበር
              </span>
            </p>
            <p className="footer-fine">
              <span>{t('rights')}</span>
              <br />
              <span>{t('reg')}</span>
            </p>
          </div>
        </div>
      </footer>
    );
  }

  if (variant === 'cta') {
    return (
      <footer className="site-footer on-dark">
        <div className="container">
          <div className="site-footer__cta">
            <h2>{t('footH2')}</h2>
            <div className="btn-row">
              <Link className="btn btn--primary" href="/contact">
                {c('ctaPartner')}
              </Link>
              <Link
                className="btn btn--ghost"
                href={ns === 'projects' ? '/about' : '/projects'}
              >
                {ns === 'projects' ? t('btnAbout') : t('btnProjects')}
              </Link>
            </div>
          </div>
          <div className="site-footer__grid site-footer__grid--end">
            <Brand />
            <div className="footer-col">
              <p>
                <span>{t('address1')}</span>
                <br />
                <span>{t('address2')}</span>
              </p>
            </div>
            <div className="footer-col">
              <p>
                <a href={`tel:${site.phone.tel}`}>{site.phone.display}</a>
                <br />
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </p>
            </div>
            <p className="footer-fine">
              <span>{t('rights')}</span>
              <br />
              <span>{t('reg')}</span>
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="site-footer on-dark">
      <div className="container">
        <div className="site-footer__grid site-footer__grid--top">
          <div className="footer-col footer-col--brand">
            <Brand />
            <p className="footer-org">
              <span>{t('orgName')}</span>
              <br />
              <span className="ge" lang="am">
                ትምህርት ለልማት ማህበር
              </span>
            </p>
          </div>

          <div className="footer-col">
            <h3>{t('footContact')}</h3>
            <p>
              <span>{t('address1')}</span>
              <br />
              <span>{t('address2')}</span>
              <br />
              <a href={`tel:${site.phone.tel}`}>{site.phone.display}</a>
              <br />
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          </div>

          <div className="footer-col">
            <h3>{t('footOffices')}</h3>
            <p>
              <span>{t('officeWoliso')}</span>
              <br />
              <span>{t('officeShambu')}</span>
              <br />
              <span>{t('officeAsosa')}</span>
            </p>
          </div>

          <div className="footer-col">
            <h3>{t('footExplore')}</h3>
            <nav aria-label={t('footExplore')}>
              <Link className="navlink" href="/about">
                {t('exploreAbout')}
              </Link>
              <Link className="navlink" href="/projects">
                {c('navProjects')}
              </Link>
              <Link className="navlink" href="/#programs">
                {c('navPrograms')}
              </Link>
              <Link className="navlink" href="/contact">
                {c('navContact')}
              </Link>
            </nav>
          </div>
        </div>

        <div className="footer-legal">
          <span>{t('rights')}</span>
          <span>{t('reg')}</span>
        </div>
      </div>
    </footer>
  );
}
