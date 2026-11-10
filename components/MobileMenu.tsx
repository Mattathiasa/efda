'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject
} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {LanguageSwitcher} from './LanguageSwitcher';
import {ThemeToggle} from './ThemeToggle';
import {MenuIcon, CloseIcon} from './icons';
import type {NavItem} from './nav';

/* The panel sits as a sibling of .site-header__inner, exactly as the design
   does it - inside the header row it would be a flex item of .header-actions
   and squash the brand off the bar. But the button that opens it lives in
   that row, so open state, the panel and the button are split across three
   components and threaded through this context.

   Burger carries aria-expanded, focus moves into the panel on open, Escape
   closes and returns focus to the button. */
const MenuContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
} | null>(null);

function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('MobileMenu parts must be rendered inside MobileMenuProvider');
  return ctx;
}

export function MobileMenuProvider({children}: {children: ReactNode}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <MenuContext.Provider value={{open, setOpen, buttonRef}}>
      {children}
    </MenuContext.Provider>
  );
}

export function MobileMenuButton() {
  const t = useTranslations('common');
  const {open, setOpen, buttonRef} = useMenu();

  return (
    <button
      ref={buttonRef}
      type="button"
      className="burger"
      aria-expanded={open}
      aria-controls="mobile-menu"
      aria-label={t('menu')}
      onClick={() => setOpen(!open)}
    >
      {/* Both icons are rendered; .burger[aria-expanded] in styles.css
          decides which one shows, as in the design. */}
      <MenuIcon className="icon-open" />
      <CloseIcon className="icon-close" />
    </button>
  );
}

export function MobileMenuPanel({nav, current}: {nav: NavItem[]; current?: string}) {
  const t = useTranslations('common');
  const {open, setOpen, buttonRef} = useMenu();
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector('a')?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, setOpen, buttonRef]);

  return (
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
      <div className="mobile-menu__controls">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
      <Link className="btn btn--primary" href="/contact" onClick={() => setOpen(false)}>
        {t('ctaPartner')}
      </Link>
    </nav>
  );
}
