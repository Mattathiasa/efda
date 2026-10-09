import {Fragment} from 'react';
import {funders} from '@/content/funders';

/* Two copies of the list scrolling left in 40s; the second is aria-hidden so
   screen readers hear the names once. Stops under prefers-reduced-motion.
   Names and dots are direct children of .marquee__group so its flex gap
   applies to each. */
function Group({hidden}: {hidden?: boolean}) {
  return (
    <div className="marquee__group" lang="en" aria-hidden={hidden || undefined}>
      {funders.map((name) => (
        <Fragment key={name}>
          <span>{name}</span>
          <span className="marquee__dot" aria-hidden="true">
            ●
          </span>
        </Fragment>
      ))}
    </div>
  );
}

export function FunderMarquee({label}: {label: string}) {
  return (
    <section className="funders" aria-label={label}>
      <div className="container">
        <p className="label">{label}</p>
      </div>
      <div className="marquee">
        <Group />
        <Group hidden />
      </div>
    </section>
  );
}
