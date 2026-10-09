import {Link} from '@/i18n/navigation';

export interface IndexRowCopy {
  region: string;
  zone: string;
  place: string;
  rowTitle: string;
  funder: string;
}

/* Region, title and funder. The whole row is one link; it slides 16px and
   tints on hover. */
export function ProjectIndexRow({row}: {row: IndexRowCopy}) {
  return (
    <Link className="row" href="/projects">
      <span className="row__where">
        {row.region} · {row.zone} · {row.place}
      </span>
      <span className="row__title">{row.rowTitle}</span>
      <span className="row__funder">{row.funder}</span>
    </Link>
  );
}
