'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {DuotonePhoto} from './DuotonePhoto';
import {ArrowRight} from './icons';
import {programs} from '@/content/programs';

interface ProgramCopy {
  title: string;
  short: string;
  region: string;
  text: string;
  statNum: string;
  statLabel: string;
  alt: string;
  quote: string;
}

/* List of five programs; the picked one shows its photo, region, text and
   stat. Program 5 has no photo yet, so it shows a pull quote instead. */
export function ProgramSwitcher({copy}: {copy: ProgramCopy[]}) {
  const t = useTranslations('home');
  const [active, setActive] = useState(0);
  const current = copy[active];
  const photo = programs[active]?.photo;

  return (
    <div className="programs">
      <div className="prog-list">
        {programs.map((program, i) => (
          <button
            key={program.id}
            type="button"
            className="prog"
            aria-pressed={i === active}
            onClick={() => setActive(i)}
          >
            <span className="prog__num">{String(i + 1).padStart(2, '0')}</span>
            <span>
              <span className="prog__title">{copy[i].title}</span>
              <span className="prog__short">{copy[i].short}</span>
            </span>
            <span className="prog__arrow">
              <ArrowRight />
            </span>
          </button>
        ))}
      </div>

      <div className="prog-detail" aria-live="polite">
        {photo ? (
          <DuotonePhoto
            photo={photo}
            alt={current.alt}
            arch="arch--card"
            sizes="(max-width: 900px) 100vw, 44vw"
          />
        ) : (
          <div className="prog-detail__quote arch--card">
            <p>“{current.quote}”</p>
            <span>{t('photoTbd')}</span>
          </div>
        )}

        <p className="prog-detail__region">{current.region}</p>
        <p className="prog-detail__text">{current.text}</p>
        <div className="prog-detail__stat">
          <strong>{current.statNum}</strong>
          <span>{current.statLabel}</span>
        </div>
      </div>
    </div>
  );
}
