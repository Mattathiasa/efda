import {Photo} from '@/components/Photo';
import {areas} from '@/content/experience';

export interface AreaCopy {
  title: string;
  alt: string;
}

/* The eight areas of experience from EFDA's 2025 profile, each with the
   photograph the profile uses for it. A grid rather than a list because the
   photographs are the evidence - the titles alone say very little. */
export function ExperienceGrid({copy}: {copy: AreaCopy[]}) {
  return (
    <div className="auto-grid areas" style={{'--min': '240px'} as React.CSSProperties}>
      {areas.map((area, i) => (
        <figure className="area" key={area.id}>
          <Photo
            photo={area.photo}
            alt={copy[i].alt}
            arch="arch--card"
            sizes="(max-width: 720px) 50vw, 240px"
          />
          <figcaption>{copy[i].title}</figcaption>
        </figure>
      ))}
    </div>
  );
}
