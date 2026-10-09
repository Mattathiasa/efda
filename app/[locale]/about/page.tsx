import type {Metadata} from 'next';
import {useTranslations} from 'next-intl';
import {SiteHeader} from '@/components/SiteHeader';
import {SiteFooter} from '@/components/SiteFooter';
import {DuotonePhoto} from '@/components/DuotonePhoto';
import {OrgChart} from '@/components/OrgChart';
import {PersonCard} from '@/components/PersonCard';
import {board} from '@/content/people';
import {offices} from '@/content/offices';
import {buildMetadata} from '@/lib/seo';

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
interface OfficeCopy {
  region: string;
  name: string;
  text: string;
  alt: string;
}

export default function AboutPage() {
  const t = useTranslations('about');
  const c = useTranslations('common');

  const facts = t.raw('facts') as Fact[];
  const paras = t.raw('whoParas') as Para[];
  const vmg = t.raw('vmg') as Vmg[];
  const roles = t.raw('roles') as string[];
  const officeCopy = t.raw('offices') as OfficeCopy[];

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

            <figure className="panorama">
              <DuotonePhoto
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
          <div className="container split split--top split--wide">
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
            <div className="phil-rows">
              {vmg.map((item, i) => (
                <div className="phil-row" key={i}>
                  <h3>{item.label}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Organization */}
        <section className="section" id="structure" style={{paddingBottom: 96}}>
          <div className="container">
            <div className="split split--wide">
              <div>
                <p className="label">{t('orgLabel')}</p>
                <h2 className="h-section">{t('orgH2')}</h2>
              </div>
              <p className="lead">{t('orgP')}</p>
            </div>
            <OrgChart label={t('orgH2')} />
          </div>
        </section>

        {/* 6. Leadership */}
        <section className="section" id="leadership" style={{paddingTop: 32}}>
          <div className="container">
            <div className="split split--wide">
              <div>
                <p className="label">{t('leadLabel')}</p>
                <h2 className="h-section">{t('leadH2')}</h2>
              </div>
              <p className="note">{t('portraitsNote')}</p>
            </div>

            <div className="auto-grid people">
              {board.map((person, i) => (
                <PersonCard key={person.name} person={person} role={roles[i]} />
              ))}
            </div>
          </div>
        </section>

        {/* 7. Our offices */}
        <section className="section section--dust">
          <div className="container">
            <p className="label">{t('officesLabel')}</p>
            <h2 className="h-section">{t('officesH2')}</h2>

            <div className="auto-grid offices">
              {offices.map((office, i) => (
                <article className="office" key={office.id}>
                  {office.photo ? (
                    <DuotonePhoto
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
                  <p className="office__region">{officeCopy[i].region}</p>
                  <h3>{officeCopy[i].name}</h3>
                  <p>{officeCopy[i].text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter variant="cta" ns="about" />
    </>
  );
}
