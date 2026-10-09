'use client';

import {useId} from 'react';
import {GlobeMark} from './GlobeMark';

/* Laterite disc with text on a circular path and the mark in the centre,
   turning once every 30s. Decorative, so aria-hidden; CSS hides it below
   900px and stops the spin under prefers-reduced-motion. */
export function RotatingBadge({text}: {text: string}) {
  const pathId = useId();

  return (
    <div className="badge hide-sm" aria-hidden="true">
      <svg className="badge__ring" viewBox="0 0 144 144">
        <defs>
          <path
            id={pathId}
            d="M72 72 m-54 0 a54 54 0 1 1 108 0 a54 54 0 1 1 -108 0"
          />
        </defs>
        <text>
          <textPath href={`#${pathId}`}>{text}</textPath>
        </text>
      </svg>
      <GlobeMark className="badge__mark" variant="badge" size={48} />
    </div>
  );
}
