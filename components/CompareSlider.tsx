'use client';

import {useState} from 'react';
import Image from 'next/image';
import {photos} from '@/content/photos';
import {CompareIcon} from './icons';

/* The 2000 photo clipped over the classroom photo. The knob is decorative -
   the control underneath is a real <input type="range">, so it works by
   keyboard and reports a value to screen readers. */
export function CompareSlider({
  beforeAlt,
  afterAlt,
  beforeTag,
  afterTag,
  ariaLabel
}: {
  beforeAlt: string;
  afterAlt: string;
  beforeTag: string;
  afterTag: string;
  ariaLabel: string;
}) {
  const [pos, setPos] = useState(52);

  return (
    <div
      className="compare"
      style={
        {
          '--pos': `${pos}%`,
          '--clip': `${100 - pos}%`
        } as React.CSSProperties
      }
    >
      <Image
        src={photos.classroom}
        alt={afterAlt}
        fill
        sizes="(max-width: 900px) 100vw, 50vw"
        placeholder="blur"
      />
      <Image
        className="compare__before"
        src={photos.treeClass}
        alt={beforeAlt}
        fill
        sizes="(max-width: 900px) 100vw, 50vw"
        placeholder="blur"
      />
      <span className="compare__tag compare__tag--before">{beforeTag}</span>
      <span className="compare__tag compare__tag--after">{afterTag}</span>
      <div className="compare__line" aria-hidden="true" />
      <input
        className="compare__range"
        type="range"
        min={0}
        max={100}
        step={1}
        value={pos}
        aria-label={ariaLabel}
        onChange={(e) => setPos(Number(e.target.value))}
      />
      <div className="compare__knob" aria-hidden="true">
        <CompareIcon />
      </div>
    </div>
  );
}
