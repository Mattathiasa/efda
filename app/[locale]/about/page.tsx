import type {Metadata} from 'next';
import {useLocale, useTranslations} from 'next-intl';
import {SiteHeader} from '@/components/SiteHeader';
import {SiteFooter} from '@/components/SiteFooter';
import {Photo} from '@/components/Photo';
import {OrgChart} from '@/components/OrgChart';
import {ExperienceGrid} from '@/components/ExperienceGrid';
import type {AreaCopy} from '@/components/ExperienceGrid';
import {PersonCard} from '@/components/PersonCard';
import {board} from '@/content/people';
import {offices} from '@/content/offices';
import {policies} from '@/content/policies';
import {buildMetadata, BreadcrumbJsonLd} from '@/lib/seo';
import {getSiteConfig} from '@/lib/site-config';
import type {SiteConfig} from '@/lib/site-config-shared';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  return buildMetadata(locale, 'about', '/about');
}

interface Fact {
  k: string;
  v: string;
}
interface Para {
  text: string;
}
interface Vmg {
  label: string;
  text: string;
}
interface Value {
  label: string;
  text: string;
}
interface OfficeCopy {
  region: string;
  name: string;
  text: string;
  alt: string;
}

export default async function AboutPage() {
  const config = await getSiteConfig();
  return <AboutPageContent config={config} />;
}

/* See app/[locale]/page.tsx for why this is a separate sync component. */
function AboutPageContent({config}: {config: SiteConfig}) {
  const t = useTranslations('about');
  const c = useTranslations('common');
  const locale = useLocale();

  const facts = t.raw('facts') as Fact[];
  const paras = t.raw('whoParas') as Para[];
  const vmg = t.raw('vmg') as Vmg[];
  const values = t.raw('values') as Value[];
  const areaCopy = t.raw('areas') as AreaCopy[];
  const roles = t.raw('roles') as string[];
  const officeCopy = t.raw('offices') as OfficeCopy[];
  const capacity = t.raw('capacity') as Fact[];
  const policyCopy = t.raw('policies') as string[];

  return (
    <>
      <a className="skip-link" href="#main">
        {c('skip')}
      </a>
      <SiteHeader variant="light" current="navAbout" />

      <main id="main">
        {/* 2. Headline, facts and the panorama */}
        <section className="page-head">
          <div className="container">
            <p className="label">{t('pageLabel')}</p>
            <div className="split split--wide" style={{gap: '48px 80px'}}>
              <h1 className="h-page">{t('h1')}</h1>
              <dl className="facts">
                {facts.map((fact, i) => (
                  <div key={i}>
                    <dt>{fact.k}</dt>
                    <dd>{fact.v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <figure className="panorama" data-reveal>
              <Photo
                photo="officeWoliso"
                alt={t('heroAlt')}
                arch="arch--wide"
                sizes="(max-width: 1320px) 100vw, 1320px"
                priority
              />
              <figcaption className="caption">{t('heroCaption')}</figcaption>
            </figure>
          </div>
        </section>

        {/* 3. Who we are */}
        <section className="section">
          <div className="container split split--top split--wide" data-reveal>
            <div>
              <p className="label">{t('whoLabel')}</p>
              <h2 className="h-section h-section--who">{t('whoH2')}</h2>
            </div>
            <div className="prose">
              {paras.map((para, i) => (
                <p key={i}>{para.text}</p>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Development philosophy */}
        <section className="section section--dark on-dark">
          <div className="container">
            <p className="label phil-label">{t('philLabel')}</p>
            <div className="phil-rows" data-reveal-group>
              {vmg.map((item, i) => (
                <div className="phil-row" key={i}>
                  <h3>{item.label}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>

            <p className="label" style={{marginTop: 72}}>
              {t('valuesLabel')}
            </p>
            <div className="auto-grid vmg-cards" data-reveal-group>
              {values.map((value, i) => (
                <div className="vmg-card" key={i}>
                  <div className="vmg-card__head">
                    <span className="vmg-card__label">{value.label}</span>
                    <span className="vmg-card__num">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="vmg-card__text">{value.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Areas of experience */}
        <section className="section section--dust">
          <div className="container">
            <div className="split split--wide" data-reveal>
              <div>
                <p className="label">{t('areasLabel')}</p>
                <h2 className="h-section">{t('areasH2')}</h2>
              </div>
              <p className="lead">{t('areasP')}</p>
            </div>
            <div data-reveal>
              <ExperienceGrid copy={areaCopy} />
            </div>
          </div>
        </section>

        {/* 6. Organization */}
        <section className="section" id="structure" style={{paddingBottom: 96}}>
          <div className="container">
            <div className="split split--wide">
              <div>
                <p className="label">{t('orgLabel')}</p>
                <h2 className="h-section">{t('orgH2')}</h2>
              </div>
              <p className="lead">{t('orgP')}</p>
            </div>
            <div data-reveal>
              <OrgChart label={t('orgH2')} />
            </div>
          </div>
        </section>

        {/* 7. Leadership */}
        <section className="section" id="leadership" style={{paddingTop: 32}}>
          <div className="container">
            <div className="split split--wide">
              <div>
                <p className="label">{t('leadLabel')}</p>
                <h2 className="h-section">{t('leadH2')}</h2>
              </div>
              <p className="note">{t('portraitsNote')}</p>
            </div>

            <div className="auto-grid people" data-reveal-group>
              {board.map((person, i) => (
                <PersonCard key={person.name} person={person} role={roles[i]} />
              ))}
            </div>
          </div>
        </section>

        {/* 8. Our offices */}
        <section className="section section--dust">
          <div className="container">
            <p className="label">{t('officesLabel')}</p>
            <h2 className="h-section">{t('officesH2')}</h2>

            <div className="auto-grid offices" data-reveal-group>
              {offices.map((office, i) => (
                <article className="office" key={office.id}>
                  {office.photo ? (
                    <Photo
                      photo={office.photo}
                      alt={officeCopy[i].alt}
                      arch="arch--office"
                      sizes="(max-width: 720px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="office__placeholder arch--office">
                      <span>{t('asosaPhoto')}</span>
                    </div>
                  )}
                  <p className="office__region">
                    {officeCopy[i].region}
                    <span className="office__status">
                      {office.active ? t('officeActive') : t('officeDormant')}
                    </span>
                  </p>
                  <h3>{officeCopy[i].name}</h3>
                  <p>{officeCopy[i].text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Accountability */}
        <section className="section">
          <div className="container">
            <div className="split split--wide" data-reveal>
              <div>
                <p className="label">{t('accLabel')}</p>
                <h2 className="h-section">{t('accH2')}</h2>
              </div>
              <p className="lead">{t('accP')}</p>
            </div>

            <dl className="facts" style={{marginTop: 56}} data-reveal>
              {capacity.map((item, i) => (
                <div key={i}>
                  <dt>{item.k}</dt>
                  <dd>{item.v}</dd>
                </div>
              ))}
            </dl>

            <p className="label" style={{marginTop: 72}}>
              {t('policiesLabel')}
            </p>
            <ul className="policy-list" data-reveal-group>
              {policies.map((id, i) => (
                <li key={id}>{policyCopy[i]}</li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <BreadcrumbJsonLd locale={locale} page="about" label={c('navAbout')} />
      <SiteFooter variant="cta" ns="about" phone={config.phone} email={config.email} />
    </>
  );
}
