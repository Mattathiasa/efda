import type {Metadata} from 'next';
import {useLocale, useTranslations} from 'next-intl';
import {SiteHeader} from '@/components/SiteHeader';
import {SiteFooter} from '@/components/SiteFooter';
import {DonorRoll} from '@/components/DonorRoll';
import {FundingHistory} from '@/components/FundingHistory';
import type {GrantCopy} from '@/components/FundingHistory';
import {NetworkList} from '@/components/NetworkList';
import type {NetworkCopy} from '@/components/NetworkList';
import {Photo} from '@/components/Photo';
import {Grain} from '@/components/Grain';
import {Link} from '@/i18n/navigation';
import {buildMetadata, BreadcrumbJsonLd} from '@/lib/seo';
import {getSiteConfig} from '@/lib/site-config';
import type {SiteConfig} from '@/lib/site-config-shared';

interface Testimonial {
  quote: string;
  who: string;
  role: string;
  when: string;
  note: string;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  return buildMetadata(locale, 'partners', '/partners');
}

export default async function PartnersPage() {
  const config = await getSiteConfig();
  return <PartnersPageContent config={config} />;
}

/* See app/[locale]/page.tsx for why this is a separate sync component. */
function PartnersPageContent({config}: {config: SiteConfig}) {
  const t = useTranslations('partners');
  const c = useTranslations('common');
  const locale = useLocale();
  const grantCopy = t.raw('funding') as GrantCopy[];
  const networkCopy = t.raw('networks') as NetworkCopy[];
  const testimonials = t.raw('testimonials') as Testimonial[];

  return (
    <>
      <a className="skip-link" href="#main">
        {c('skip')}
      </a>
      <SiteHeader variant="light" current="navPartners" />

      <main id="main">
        <section className="page-head" style={{paddingBottom: 'var(--section-y)'}}>
          <div className="container">
            <p className="label">{t('pageLabel')}</p>
            <div className="split split--wide" style={{gap: '32px 80px'}}>
              <h1 className="h-page">
                <span style={{display: 'block'}}>{t('h1a')}</span>
                <span style={{display: 'block'}}>{t('h1b')}</span>
              </h1>
              <p className="lead">{t('intro')}</p>
            </div>
          </div>
        </section>

        {/* 2. The roster */}
        <section className="section section--dust" aria-labelledby="roster-title">
          <div className="container">
            <div className="split split--wide" data-reveal>
              <div>
                <p className="label">{t('rosterLabel')}</p>
                <h2 className="h-section" id="roster-title">
                  {t('rosterH2')}
                </h2>
              </div>
              <p className="lead">{t('rosterP')}</p>
            </div>
            <DonorRoll />
          </div>
        </section>

        {/* 3. The funding record */}
        <section className="section" aria-labelledby="fund-title">
          <div className="container">
            <div className="split split--wide" data-reveal>
              <div>
                <p className="label">{t('fundLabel')}</p>
                <h2 className="h-section" id="fund-title">
                  {t('fundH2')}
                </h2>
              </div>
              <p className="lead">{t('fundP')}</p>
            </div>
            <FundingHistory copy={grantCopy} />
          </div>
        </section>

        {/* 4. Networks and coalitions */}
        <section className="section section--dust" aria-labelledby="net-title">
          <div className="container">
            <div className="split split--wide" data-reveal>
              <div>
                <p className="label">{t('netLabel')}</p>
                <h2 className="h-section" id="net-title">
                  {t('netH2')}
                </h2>
              </div>
              <p className="lead">{t('netP')}</p>
            </div>
            <NetworkList copy={networkCopy} />
          </div>
        </section>

        {/* 5. The Roger Federer Foundation visit */}
        <section
          className="section section--dark on-dark"
          aria-labelledby="federer-title"
        >
          <Grain />
          <div className="container">
            <div className="split split--wide" data-reveal>
              <div>
                <p className="label">{t('federerLabel')}</p>
                <h2 className="h-section" id="federer-title">
                  {t('federerH2')}
                </h2>
              </div>
              <p className="lead">{t('federerP')}</p>
            </div>

            <div
              className="auto-grid"
              style={{marginTop: 64, '--gap': '32px'} as React.CSSProperties}
              data-reveal-group
            >
              <figure>
                <Photo
                  photo="federerWaterpoint"
                  alt={t('federerAlt1')}
                  arch="arch--card"
                  sizes="(max-width: 720px) 100vw, 50vw"
                />
                <figcaption className="caption">{t('federerCap1')}</figcaption>
              </figure>
              <figure>
                <Photo
                  photo="federerSchool"
                  alt={t('federerAlt2')}
                  arch="arch--card"
                  sizes="(max-width: 720px) 100vw, 50vw"
                />
                <figcaption className="caption">{t('federerCap2')}</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* 6. What partners say */}
        <section className="section section--dust" aria-labelledby="say-title">
          <div className="container">
            <div className="split split--wide" data-reveal>
              <div>
                <p className="label">{t('sayLabel')}</p>
                <h2 className="h-section" id="say-title">
                  {t('sayH2')}
                </h2>
              </div>
              <p className="lead">{t('sayP')}</p>
            </div>

            <div
              className="auto-grid"
              style={{marginTop: 56, '--min': '380px'} as React.CSSProperties}
              data-reveal-group
            >
              {testimonials.map((item, i) => (
                <figure className="testimonial" key={i}>
                  <blockquote>
                    <p>“{item.quote}”</p>
                  </blockquote>
                  <figcaption>
                    <strong>{item.who}</strong>
                    <span>
                      {item.role} · {item.when}
                    </span>
                    <span className="testimonial__note">{item.note}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* 7. How we work with partners */}
        <section className="section" aria-labelledby="how-title">
          <div className="container about-grid" data-reveal>
            <p className="label">{t('quoteLabel')}</p>
            <p className="statement" id="how-title">
              {t('quoteA')} <em>{t('quoteB')}</em>
              {t('quoteC')}
            </p>
            <div />
            <div className="prose">
              <p>{t('quoteP')}</p>
              <p>
                <Link className="btn btn--ghost" href="/about#structure">
                  {t('btnAbout')}
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>

      <BreadcrumbJsonLd locale={locale} page="partners" label={c('navPartners')} />
      <SiteFooter
        variant="cta"
        ns="partners"
        phone={config.phone}
        email={config.email}
      />
    </>
  );
}
