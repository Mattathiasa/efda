import type {Metadata} from 'next';
import {useLocale, useTranslations} from 'next-intl';
import {SiteHeader} from '@/components/SiteHeader';
import {SiteFooter} from '@/components/SiteFooter';
import {Photo} from '@/components/Photo';
import {Grain} from '@/components/Grain';
import {buildMetadata, BreadcrumbJsonLd} from '@/lib/seo';
import {getSiteConfig} from '@/lib/site-config';
import type {SiteConfig} from '@/lib/site-config-shared';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  return buildMetadata(locale, 'enset', '/projects/enset');
}

interface Fact {
  k: string;
  v: string;
}
interface Para {
  text: string;
}
interface Result {
  k: string;
  before: string;
  after: string;
}

export default async function EnsetPage() {
  const config = await getSiteConfig();
  return <EnsetPageContent config={config} />;
}

/* See app/[locale]/page.tsx for why this is a separate sync component. */
function EnsetPageContent({config}: {config: SiteConfig}) {
  const t = useTranslations('enset');
  const c = useTranslations('common');
  const locale = useLocale();

  const facts = t.raw('facts') as Fact[];
  const problem = t.raw('problemParas') as Para[];
  const work = t.raw('workParas') as Para[];
  const results = t.raw('results') as Result[];
  const honest = t.raw('honestParas') as Para[];
  const next = t.raw('nextParas') as Para[];

  return (
    <>
      <a className="skip-link" href="#main">
        {c('skip')}
      </a>
      <SiteHeader variant="light" current="navProjects" />

      <main id="main">
        {/* 2. Headline, facts and the opening photograph */}
        <section className="page-head">
          <div className="container">
            <p className="label">{t('pageLabel')}</p>
            <div className="split split--wide" style={{gap: '48px 80px'}}>
              <h1 className="h-page">
                <span style={{display: 'block'}}>{t('h1a')}</span>
                <span style={{display: 'block'}}>{t('h1b')}</span>
              </h1>
              <p className="lead">{t('intro')}</p>
            </div>

            <dl className="facts" style={{marginTop: 56}} data-reveal>
              {facts.map((fact, i) => (
                <div key={i}>
                  <dt>{fact.k}</dt>
                  <dd>{fact.v}</dd>
                </div>
              ))}
            </dl>

            <figure className="panorama" data-reveal>
              <Photo
                photo="kochoProcessing"
                alt={t('alt1')}
                arch="arch--wide"
                sizes="(max-width: 1320px) 100vw, 1320px"
                priority
              />
              <figcaption className="caption">{t('cap1')}</figcaption>
            </figure>
          </div>
        </section>

        {/* 3. The problem */}
        <section className="section" aria-labelledby="problem-title">
          <div className="container split split--top split--wide" data-reveal>
            <div>
              <p className="label">{t('problemLabel')}</p>
              <h2 className="h-section" id="problem-title">
                {t('problemH2')}
              </h2>
            </div>
            <div className="prose">
              {problem.map((para, i) => (
                <p key={i}>{para.text}</p>
              ))}
            </div>
          </div>
        </section>

        {/* 4. What EFDA did */}
        <section className="section section--dust" aria-labelledby="work-title">
          <div className="container split split--top split--wide" data-reveal>
            <div>
              <p className="label">{t('workLabel')}</p>
              <h2 className="h-section" id="work-title">
                {t('workH2')}
              </h2>
            </div>
            <div className="prose">
              {work.map((para, i) => (
                <p key={i}>{para.text}</p>
              ))}
            </div>
          </div>
        </section>

        {/* 5. What changed - the measured result */}
        <section
          className="section section--dark on-dark"
          aria-labelledby="result-title"
        >
          <Grain />
          <div className="container">
            <div className="split split--wide" data-reveal>
              <div>
                <p className="label">{t('resultLabel')}</p>
                <h2 className="h-section" id="result-title">
                  {t('resultH2')}
                </h2>
              </div>
            </div>

            <div className="ba-rows" data-reveal-group>
              <div className="ba-head" aria-hidden="true">
                <span />
                <span>{t('beforeTag')}</span>
                <span>{t('afterTag')}</span>
              </div>
              {results.map((row, i) => (
                <div className="ba-row" key={i}>
                  <span className="ba-row__k">{row.k}</span>
                  <span className="ba-row__before" data-label={t('beforeTag')}>
                    {row.before}
                  </span>
                  <span className="ba-row__after" data-label={t('afterTag')}>
                    {row.after}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. What did not work */}
        <section className="section" aria-labelledby="honest-title">
          <div className="container split split--top split--wide" data-reveal>
            <div>
              <p className="label">{t('honestLabel')}</p>
              <h2 className="h-section" id="honest-title">
                {t('honestH2')}
              </h2>
            </div>
            <div className="prose">
              {honest.map((para, i) => (
                <p key={i}>{para.text}</p>
              ))}
            </div>
          </div>
        </section>

        {/* 7. What comes next */}
        <section className="section section--dust" aria-labelledby="next-title">
          <div className="container">
            <div className="split split--top split--wide" data-reveal>
              <div>
                <p className="label">{t('nextLabel')}</p>
                <h2 className="h-section" id="next-title">
                  {t('nextH2')}
                </h2>
              </div>
              <div className="prose">
                {next.map((para, i) => (
                  <p key={i}>{para.text}</p>
                ))}
              </div>
            </div>

            <figure className="panorama" data-reveal>
              <Photo
                photo="ensetPlantation"
                alt={t('alt2')}
                arch="arch--wide"
                sizes="(max-width: 1320px) 100vw, 1320px"
              />
              <figcaption className="caption">{t('cap2')}</figcaption>
            </figure>
          </div>
        </section>
      </main>

      <BreadcrumbJsonLd
        locale={locale}
        page="enset"
        label={t('pageLabel')}
        parent={{page: 'projects', label: c('navProjects')}}
      />
      <SiteFooter
        variant="cta"
        ns="enset"
        bordered
        phone={config.phone}
        email={config.email}
      />
    </>
  );
}
