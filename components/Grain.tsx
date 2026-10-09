'use client';

import {useId} from 'react';

/* The fractal-noise overlay on dark sections. The filter needs a document-
   unique id, so it is generated per instance rather than hard-coded as it was
   in the static design. */
export function Grain({className = 'hero__grain'}: {className?: string}) {
  const id = useId();
  return (
    <svg className={className} aria-hidden="true" focusable="false">
      <filter id={id}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves={3}
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  );
}
