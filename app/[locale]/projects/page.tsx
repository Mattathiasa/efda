import type {Metadata} from 'next';
import {useTranslations} from 'next-intl';
import {SiteHeader} from '@/components/SiteHeader';
import {SiteFooter} from '@/components/SiteFooter';
import {ProjectFilters} from '@/components/ProjectFilters';
import {TrackTile, type TileCopy} from '@/components/TrackTile';
import type {ProjectCopy} from '@/components/ProjectCard';
import {tiles} from '@/content/tiles';
import {buildMetadata} from '@/lib/seo';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  return buildMetadata(locale, 'projects', '/projects');
}

export default function ProjectsPage() {
  const t = useTranslations('projects');
  const c = useTranslations('common');

  const projectCopy = t.raw('projects') as ProjectCopy[];
  const tileCopy = t.raw('tiles') as TileCopy[];

  return (
    <>
      <a className="skip-link" href="#main">
        {c('skip')}
      </a>
      <SiteHeader variant="light" current="navProjects" />

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

            <ProjectFilters
              copy={projectCopy}
              labels={{
                themes: t.raw('themes') as Record<string, string>,
                regions: t.raw('regions') as Record<string, string>,
                themeAria: t('themeAria'),
                regionAria: t('regionAria'),
                showing: t.raw('showing') as string,
                fundedBy: t('fundedBy'),
                empty: t('empty'),
                emptyHint: t('emptyHint')
              }}
            />
          </div>
        </section>

        {/* Track record */}
        <section className="section section--dark on-dark" aria-labelledby="track-title">
          <div className="container">
            <div className="split split--wide">
              <div>
                <p className="label">{t('trackLabel')}</p>
                <h2 className="h-section h-section--xl" id="track-title">
                  {t('trackH2')}
                </h2>
              </div>
              <p className="lead">{t('trackP')}</p>
            </div>

            <div className="bento">
              {tiles.map((tile, i) => (
                <TrackTile key={i} tile={tile} copy={tileCopy[i]} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter variant="cta" ns="projects" bordered />
    </>
  );
}
