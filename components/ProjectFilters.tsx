'use client';

import {useState} from 'react';
import {projects, themeKeys, regionKeys, type Theme, type Region} from '@/content/projects';
import {ProjectCard, type ProjectCopy} from './ProjectCard';

type ThemeFilter = Theme | 'all';
type RegionFilter = Region | 'all';

interface Labels {
  themes: Record<string, string>;
  regions: Record<string, string>;
  themeAria: string;
  regionAria: string;
  showing: string;
  fundedBy: string;
  empty: string;
  emptyHint: string;
}

/* Theme chips with counts, region chips, a combined filter, a live count and
   an empty state. Chip counts follow the region filter, as in the design:
   picking Benishangul Gumuz re-counts every theme against that region.

   Cards stay in the DOM and are toggled with `hidden` rather than unmounted,
   which keeps the grid's auto-fit layout stable. */
export function ProjectFilters({copy, labels}: {copy: ProjectCopy[]; labels: Labels}) {
  const [theme, setTheme] = useState<ThemeFilter>('all');
  const [region, setRegion] = useState<RegionFilter>('all');

  const matches = (i: number, th: ThemeFilter, rg: RegionFilter) =>
    (th === 'all' || projects[i].theme === th) &&
    (rg === 'all' || projects[i].region === rg);

  const countFor = (th: ThemeFilter) =>
    projects.filter((_, i) => matches(i, th, region)).length;

  const visible = projects.filter((_, i) => matches(i, theme, region)).length;

  return (
    <>
      <div className="filter-bar">
        <div className="chips" role="group" aria-label={labels.themeAria}>
          {(['all', ...themeKeys] as ThemeFilter[]).map((key) => (
            <button
              key={key}
              type="button"
              className="chip"
              aria-pressed={theme === key}
              onClick={() => setTheme(key)}
            >
              <span>{labels.themes[key]}</span>
              <span className="chip__count">{countFor(key)}</span>
            </button>
          ))}
        </div>

        <div className="chips" role="group" aria-label={labels.regionAria}>
          {(['all', ...regionKeys] as RegionFilter[]).map((key) => (
            <button
              key={key}
              type="button"
              className="chip"
              aria-pressed={region === key}
              onClick={() => setRegion(key)}
            >
              <span>{labels.regions[key]}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="showing" aria-live="polite">
        {labels.showing.replace('{n}', String(visible))}
      </p>

      <div className="auto-grid cards" data-reveal-group>
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            copy={copy[i]}
            index={i}
            regionLabel={labels.regions[project.region]}
            themeLabel={labels.themes[project.theme]}
            fundedBy={labels.fundedBy}
            hidden={!matches(i, theme, region)}
          />
        ))}
      </div>

      <div className="empty" hidden={visible !== 0}>
        <p>{labels.empty}</p>
        <p>{labels.emptyHint}</p>
      </div>
    </>
  );
}
