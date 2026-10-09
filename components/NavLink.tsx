import type {ComponentProps, ReactNode} from 'react';
import {Link} from '@/i18n/navigation';
import {PendingSignal} from './NavProgress';

/* next-intl's Link with a pending reporter inside it, so the header bar can
   show that a tapped link is still fetching. Used for navigation links; plain
   Link is fine anywhere the pending state does not matter. */
export function NavLink({
  children,
  ...props
}: ComponentProps<typeof Link> & {children: ReactNode}) {
  return (
    <Link {...props}>
      {children}
      <PendingSignal />
    </Link>
  );
}
