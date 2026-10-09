'use client';

import {useNavPending} from './NavProgress';

/* The hairline along the bottom edge of the header.

   Two jobs: reading progress while you scroll (driven by ScrollEffects via
   the --p custom property), and an indeterminate sweep while a navigation is
   still fetching. Decorative in both cases - aria-hidden, and never the only
   signal for anything. */
export function Progress() {
  const pending = useNavPending();

  return (
    <span
      className={`progress${pending ? ' is-navigating' : ''}`}
      aria-hidden="true"
    />
  );
}
