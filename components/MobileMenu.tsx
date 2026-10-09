'use client';

import {useEffect, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {LanguageSwitcher} from './LanguageSwitcher';
import {MenuIcon, CloseIcon} from './icons';
import type {NavItem} from './nav';

/* Full-screen panel under 900px. Burger carries aria-expanded, focus moves
   into the panel on open, Escape closes and returns focus to the button. */
export function MobileMenu({nav, current}: {nav: NavItem[]; current?: string}) {
  const t = useTranslations('common');
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector('a')?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        burgerRef.current?.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <>
      <button
        ref={burgerRef}
        type="button"
        className="burger"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={t('menu')}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <CloseIcon className="icon-close" /> : <MenuIcon className="icon-open" />}
      </button>

      <nav
        ref={menuRef}
        className="mobile-menu on-dark"
        id="mobile-menu"
        hidden={!open}
        aria-label={t('navAria')}
      >
        {nav.map((item) => (
          <Link
            key={item.key}
            className="mm-link"
            href={item.href}
            aria-current={current === item.key ? 'page' : undefined}
            onClick={() => setOpen(false)}
          >
            {t(item.key)}
          </Link>
        ))}
        <LanguageSwitcher />
        <Link className="btn btn--primary" href="/contact" onClick={() => setOpen(false)}>
          {t('ctaPartner')}
        </Link>
      </nav>
    </>
  );
}
