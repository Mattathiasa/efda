import {Link} from '@/i18n/navigation';
import {ArrowRight} from './icons';
import type {Project} from '@/content/projects';

export interface ProjectCopy {
  zone: string;
  place: string;
  title: string;
  desc: string;
  funder: string;
}

/* Number, theme tag, region and zone, title, place, description, funder.
   Lifts 6px on hover. An <article> with an <h2>, as the design has it. */
export function ProjectCard({
  project,
  copy,
  index,
  regionLabel,
  themeLabel,
  fundedBy,
  caseStudyLabel,
  hidden
}: {
  project: Project;
  copy: ProjectCopy;
  index: number;
  regionLabel: string;
  themeLabel: string;
  fundedBy: string;
  caseStudyLabel: string;
  hidden?: boolean;
}) {
  return (
    <article
      className="pcard"
      data-theme={project.theme}
      data-region={project.region}
      hidden={hidden}
    >
      <div className="pcard__top">
        <span className="pcard__num">{String(index + 1).padStart(2, '0')}</span>
        <span className="pcard__tag">{themeLabel}</span>
      </div>
      <div>
        <p className="pcard__where">
          {regionLabel} · {copy.zone}
        </p>
        <h2>{copy.title}</h2>
        <p className="pcard__place">{copy.place}</p>
      </div>
      <p className="pcard__desc">{copy.desc}</p>
      <div className="pcard__funder">
        <span>{fundedBy}</span>
        <strong>{copy.funder}</strong>
      </div>
      {project.caseStudy ? (
        <Link className="pcard__case" href={project.caseStudy}>
          {caseStudyLabel}
          <ArrowRight />
        </Link>
      ) : null}
    </article>
  );
}
