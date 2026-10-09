'use client';

import {useParams} from 'next/navigation';
import {useTransition} from 'react';
import {useTranslations} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';
import {locales, type Locale} from '@/i18n/routing';

/* Replaces the design's localStorage switcher. The locale now lives in the
   URL, so switching keeps the visitor on the same page: /en/projects becomes
   /om/projects. next-intl writes the NEXT_LOCALE cookie on navigation. */

const labels: Record<Locale, {short: string; full: string}> = {
  en: {short: 'EN', full: 'English'},
  am: {short: 'አማ', full: 'አማርኛ — Amharic'},
  om: {short: 'Oro', full: 'Afaan Oromoo'}
};

export function LanguageSwitcher({className = ''}: {className?: string}) {
  const t = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const current = useParams().locale as Locale;
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === current) return;
    // No dynamic segments beyond [locale], so the pathname carries over as-is.
    startTransition(() => {
      router.replace(pathname, {locale: next});
    });
  }

  return (
    <div className={`lang-switch ${className}`.trim()} role="group" aria-label={t('langLabel')}>
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          className="lang-btn"
          lang={code}
          aria-pressed={code === current}
          aria-label={labels[code].full}
          disabled={isPending}
          onClick={() => switchTo(code)}
        >
          {labels[code].short}
        </button>
      ))}
    </div>
  );
}
