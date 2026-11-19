import type {Metadata} from 'next';
import {useLocale, useTranslations} from 'next-intl';
import {SiteHeader} from '@/components/SiteHeader';
import {SiteFooter} from '@/components/SiteFooter';
import {StatRow, type Stat} from '@/components/StatRow';
import {Grain} from '@/components/Grain';
import {Link} from '@/i18n/navigation';
import {PLAN_FROM, PLAN_TO, shifts, components} from '@/content/strategy';
import {buildMetadata, BreadcrumbJsonLd} from '@/lib/seo';
import {getSiteConfig} from '@/lib/site-config';
import type {SiteConfig} from '@/lib/site-config-shared';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  return buildMetadata(locale, 'strategy', '/strategy');
}

interface Titled {
  title: string;
  text: string;
}
interface Fact {
  k: string;
  v: string;
}
interface Para {
  text: string;
}

export default async function StrategyPage() {
  const config = await getSiteConfig();
  return <StrategyPageContent config={config} />;
}

/* See app/[locale]/page.tsx for why this is a separate sync component. */
function StrategyPageContent({config}: {config: SiteConfig}) {
  const t = useTranslations('strategy');
  const c = useTranslations('common');
  const locale = useLocale();

  const baseline = t.raw('baseline') as Stat[];
  const componentCopy = t.raw('components') as Titled[];
  const shiftCopy = t.raw('shifts') as Titled[];
  const targets = t.raw('targets') as Fact[];
  const admissions = t.raw('admissions') as Para[];

  return (
    <>
      <a className="skip-link" href="#main">
        {c('skip')}
      </a>
      <SiteHeader variant="light" current="navStrategy" />

      <main id="main">
        {/* 2. Headline */}
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

        {/* 3. The starting point */}
        <section
          className="section section--dark on-dark"
          aria-labelledby="base-title"
        >
          <Grain />
          <div className="container">
            <div className="split split--wide" data-reveal>
              <div>
                <p className="label">{t('baseLabel')}</p>
                <h2 className="h-section" id="base-title">
                  {t('baseH2')}
                </h2>
              </div>
              <p className="lead">{t('baseP')}</p>
            </div>
            <div style={{marginTop: 56}} data-reveal>
              <StatRow stats={baseline} />
            </div>
          </div>
        </section>

        {/* 4. Programme components */}
        <section className="section" aria-labelledby="comp-title">
          <div className="container">
            <div className="split split--wide" data-reveal>
              <div>
                <p className="label">{t('compLabel')}</p>
                <h2 className="h-section" id="comp-title">
                  {t('compH2')}
                </h2>
              </div>
              <p className="lead">{t('compP')}</p>
            </div>
            <dl className="plan-list" data-reveal-group>
              {components.map((id, i) => (
                <div key={id}>
                  <dt>{componentCopy[i].title}</dt>
                  <dd>{componentCopy[i].text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 5. The five shifts */}
        <section className="section section--dust" aria-labelledby="shift-title">
          <div className="container">
            <div className="split split--wide" data-reveal>
              <div>
                <p className="label">{t('shiftLabel')}</p>
                <h2 className="h-section" id="shift-title">
                  {t('shiftH2')}
                </h2>
              </div>
              <p className="lead">{t('shiftP')}</p>
            </div>
            <ol className="plan-steps" data-reveal-group>
              {shifts.map((shift, i) => (
                <li key={shift.id}>
                  <span className="plan-steps__num">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3>{shiftCopy[i].title}</h3>
                    <p>{shiftCopy[i].text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 6. Targets */}
        <section className="section" aria-labelledby="target-title">
          <div className="container">
            <div className="split split--wide" data-reveal>
              <div>
                <p className="label">{t('targetLabel')}</p>
                <h2 className="h-section" id="target-title">
                  {t('targetH2')}
                </h2>
              </div>
              <p className="lead">{t('targetP')}</p>
            </div>
            <dl className="facts" style={{marginTop: 56}} data-reveal>
              {targets.map((target, i) => (
                <div key={i}>
                  <dt>{target.k}</dt>
                  <dd>{target.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 7. What the plan admits */}
        <section className="section section--dust" aria-labelledby="honest-title">
          <div className="container">
            <div className="split split--top split--wide" data-reveal>
              <div>
                <p className="label">{t('honestLabel')}</p>
                <h2 className="h-section" id="honest-title">
                  {t('honestH2')}
                </h2>
              </div>
              <div className="prose">
                <p>{t('honestP')}</p>
              </div>
            </div>
            <ul className="policy-list" data-reveal-group>
              {admissions.map((item, i) => (
                <li key={i}>{item.text}</li>
              ))}
            </ul>
            <p style={{marginTop: 40}}>
              <Link className="btn btn--ghost" href="/about#structure">
                {t('btnAbout')}
              </Link>
            </p>
          </div>
        </section>
      </main>

      <BreadcrumbJsonLd
        locale={locale}
        page="strategy"
        label={`${PLAN_FROM}–${PLAN_TO}`}
      />
      <SiteFooter
        variant="cta"
        ns="strategy"
        bordered
        phone={config.phone}
        email={config.email}
      />
    </>
  );
}
