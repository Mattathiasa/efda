'use client';

import {useTranslations} from 'next-intl';
import {SunIcon, MoonIcon} from './icons';

/* Light/dark toggle. Deliberately has no React state of its own: which icon
   shows is decided entirely in CSS, from the `data-theme` attribute an
   inline script in the root layout sets on <html> before paint (see
   layout.tsx) and from `prefers-color-scheme` when no explicit choice has
   been made. Giving this component its own state to decide which icon to
   render would mean a server-rendered guess that the client then corrects -
   exactly the shape of hydration-mismatch bug this project already fixed
   once. Reading and writing the DOM only inside the click handler avoids
   that entirely. */
export function ThemeToggle({className = ''}: {className?: string}) {
  const t = useTranslations('common');

  function toggle() {
    const root = document.documentElement;
    const current = root.getAttribute('data-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const effective = current === 'light' || current === 'dark' ? current : systemPrefersDark ? 'dark' : 'light';
    const next = effective === 'dark' ? 'light' : 'dark';

    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Private browsing, or storage disabled - the toggle still works for
      // this page view, it just won't be remembered on the next one.
    }
  }

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`.trim()}
      aria-label={t('themeToggle')}
      onClick={toggle}
    >
      <SunIcon className="icon-sun" />
      <MoonIcon className="icon-moon" />
    </button>
  );
}
