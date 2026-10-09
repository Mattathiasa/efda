import type {Metadata} from 'next';
import {useTranslations} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {SiteHeader} from '@/components/SiteHeader';
import {SiteFooter} from '@/components/SiteFooter';
import {DuotonePhoto} from '@/components/DuotonePhoto';
import {Grain} from '@/components/Grain';
import {HeadlineReveal, type HeroLine} from '@/components/HeadlineReveal';
import {RotatingBadge} from '@/components/RotatingBadge';
import {StatRow, type Stat} from '@/components/StatRow';
import {ProgramSwitcher} from '@/components/ProgramSwitcher';
import {CompareSlider} from '@/components/CompareSlider';
import {FunderMarquee} from '@/components/FunderMarquee';
import {ProjectIndexRow, type IndexRowCopy} from '@/components/ProjectIndexRow';
import {HeroWatermark, CtaWatermark} from '@/components/Watermarks';
import {ArrowRight} from '@/components/icons';
import {buildMetadata, OrganizationJsonLd} from '@/lib/seo';
import {site} from '@/content/site';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  return buildMetadata(locale, 'home', '/');
}

interface Vmg {
  label: string;
  num: string;
  text: string;
}
interface TimelineEntry {
  year: string;
  text: string;
}

export default function HomePage() {
  const t = useTranslations('home');
  const c = useTranslations('common');

  const heroLines = t.raw('heroLines') as HeroLine[];
  const stats = t.raw('stats') as Stat[];
  const vmg = t.raw('vmg') as Vmg[];
  const programCopy = t.raw('programs') as Parameters<
    typeof ProgramSwitcher
  >[0]['copy'];
  const timeline = t.raw('timeline') as TimelineEntry[];
  const rows = t.raw('projects') as IndexRowCopy[];

  return (
    <>
      <a className="skip-link" href="#main">
        {c('skip')}
      </a>
      <SiteHeader variant="dark" />

      <main id="main">
        {/* 2. Hero */}
        <section className="hero on-dark" aria-labelledby="hero-title">
          <Grain />
          <HeroWatermark />

          <div className="container hero__grid">
            <div>
              <p className="hero__eyebrow">
                <span>{t('eyebrowYear')}</span>
                <span className="sep" aria-hidden="true">
                  /
                </span>
                <span>{t('eyebrowRegions')}</span>
              </p>

              <HeadlineReveal lines={heroLines} id="hero-title" />

              <p className="hero__intro">{t('heroP')}</p>

              <div className="btn-row">
                <Link className="btn btn--primary" href="/projects">
                  <span>{t('btnProjects')}</span>
                  <ArrowRight />
                </Link>
                <a className="btn btn--ghost" href="#story">
                  {t('btnStory')}
                </a>
              </div>
            </div>

            <div className="hero__media">
              <figure>
                <DuotonePhoto
                  photo="girlsReading"
                  alt={t('heroAlt')}
                  arch="arch"
                  sizes="(max-width: 900px) 100vw, 540px"
                  priority
                />
                <figcaption className="caption hero__caption">
                  <span>{t('heroCaption')}</span>
                  <span>{t('heroCaptionPlace')}</span>
                </figcaption>
              </figure>
              <RotatingBadge text={t('badge')} />
            </div>
          </div>

          {/* 3. Impact row */}
          <div className="container hero__stats">
            <StatRow stats={stats} />
          </div>
        </section>

        {/* 4. What we stand for */}
        <section className="section" id="about" aria-labelledby="about-label">
          <div className="container">
            <div className="about-grid">
              <p className="label" id="about-label">
                {t('aboutLabel')}
              </p>
              <p className="statement">
                <span>{t('statementA')}</span>
                <em>{t('statementB')}</em>
                <span>{t('statementC')}</span>
              </p>
            </div>

            <div className="auto-grid vmg-cards">
              {vmg.map((item, i) => (
                <article className="vmg-card" key={i}>
                  <div className="vmg-card__head">
                    <h3 className="vmg-card__label">{item.label}</h3>
                    <span className="vmg-card__num">{item.num}</span>
                  </div>
                  <p className="vmg-card__text">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Programs */}
        <section
          className="section section--dark on-dark"
          id="programs"
          aria-labelledby="programs-title"
        >
          <div className="container">
            <div className="split">
              <div>
                <p className="label">{t('progLabel')}</p>
                <h2 className="h-section h-section--xl" id="programs-title">
                  <span>{t('progH2a')}</span>
                  <span>{t('progH2b')}</span>
                </h2>
              </div>
              <p className="lead">{t('progP')}</p>
            </div>

            <ProgramSwitcher copy={programCopy} />
          </div>
        </section>

        {/* 6. Our story */}
        <section className="section" id="story" aria-labelledby="story-title">
          <div className="container split split--center split--wide">
            <div>
              <p className="label">{t('storyLabel')}</p>
              <h2 className="h-section" id="story-title">
                {t('storyH2')}
              </h2>
              <p className="lead" style={{marginTop: 28, maxWidth: 520}}>
                {t('storyP')}
              </p>
              <ol className="timeline">
                {timeline.map((entry, i) => (
                  <li key={i}>
                    <strong>{entry.year}</strong>
                    <span>{entry.text}</span>
                  </li>
                ))}
              </ol>
            </div>

            <figure>
              <CompareSlider
                beforeAlt={t('beforeAlt')}
                afterAlt={t('afterAlt')}
                beforeTag={t('beforeTag')}
                afterTag={t('afterTag')}
                ariaLabel={t('compareAria')}
              />
              <figcaption className="caption">{t('compareCaption')}</figcaption>
            </figure>
          </div>
        </section>

        {/* 7. Where we work */}
        <section className="section section--dust" aria-labelledby="where-title">
          <div className="container">
            <div className="split">
              <div>
                <p className="label">{t('whereLabel')}</p>
                <h2 className="h-section" id="where-title">
                  <span>{t('whereH2a')}</span>
                  <span>{t('whereH2b')}</span>
                </h2>
              </div>
              <p className="lead">{t('whereP')}</p>
            </div>

            <div className="rows">
              {rows.map((row, i) => (
                <ProjectIndexRow row={row} key={i} />
              ))}
            </div>

            <div className="btn-top">
              <Link className="btn btn--dark" href="/projects">
                <span>{t('btnAllProjects')}</span>
                <ArrowRight />
              </Link>
            </div>
          </div>
        </section>

        {/* 8. Funders */}
        <FunderMarquee label={t('fundersLabel')} />

        {/* 9. Call to action */}
        <section className="section--cta">
          <div className="container">
            <div className="cta">
              <CtaWatermark />
              <h2>{t('ctaH2')}</h2>
              <div className="cta__body">
                <p>{t('ctaP')}</p>
                <div className="btn-row">
                  <Link className="btn btn--dark" href="/contact">
                    {c('ctaPartner')}
                  </Link>
                  <a className="btn btn--outline-light" href={`tel:${site.phone.tel}`}>
                    {site.phone.display}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter variant="full" ns="home" />
      <OrganizationJsonLd />
    </>
  );
}
