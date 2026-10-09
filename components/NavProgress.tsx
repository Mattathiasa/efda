'use client';

import {useEffect, useSyncExternalStore} from 'react';
import {useLinkStatus} from 'next/link';

/* A navigation pending indicator.

   useLinkStatus only reports from inside a <Link>, so a single bar in the
   header cannot read it directly. PendingSignal is rendered as a child of
   each navigation link and publishes to this module-level store; the header's
   existing .progress hairline subscribes.

   Worth having only because of who this site is for. Static routes are
   prefetched, so on a good connection the pending phase never happens and
   this never shows. On the unstable mobile connections the site is built for,
   prefetch often has not finished when the link is tapped - which is exactly
   the case Next's own docs point at this hook for. */

let pending = 0;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => pending > 0;
// Never pending during SSR: there is no navigation in flight on the server.
const getServerSnapshot = () => false;

export function useNavPending() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/* Rendered inside a <Link>. Reports that link's pending state upward. */
export function PendingSignal() {
  const {pending: isPending} = useLinkStatus();

  useEffect(() => {
    if (!isPending) return;
    pending += 1;
    emit();
    return () => {
      pending -= 1;
      emit();
    };
  }, [isPending]);

  return null;
}
