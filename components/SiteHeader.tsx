import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {GlobeMark} from './GlobeMark';
import {Grain} from './Grain';
import {LanguageSwitcher} from './LanguageSwitcher';
import {MobileMenu} from './MobileMenu';
import {navItems, mobileNavItems} from './nav';

/* Dark on Home, light elsewhere. The nav underline grows from the left on
   hover and stays put for the current page. */
export function SiteHeader({
  variant = 'light',
  current
}: {
  variant?: 'dark' | 'light';
  current?: string;
}) {
  const t = useTranslations('common');
  const dark = variant === 'dark';

  return (
    <header className={`site-header site-header--${variant}${dark ? ' on-dark' : ''}`}>
      {dark ? <Grain /> : null}
      {/* Reading progress. Decorative - never the only signal for anything. */}
      <span className="progress" aria-hidden="true" />

      <div className="container site-header__inner">
        <Link className="brand" href="/" aria-label={t('homeAria')}>
          <GlobeMark className="brand__mark" variant={dark ? 'reversed' : 'forest'} />
          <span className="brand__text">
            <span className="brand__word">efda</span>
            {/* The Amharic name stays in every language. */}
            <span className="brand__am" lang="am">
              ትምህርት ለልማት ማህበር
            </span>
          </span>
        </Link>

        <nav className="nav" aria-label={t('navAria')}>
          {navItems.map((item) => (
            <Link
              key={item.key}
              className="navlink"
              href={item.href}
              aria-current={current === item.key ? 'page' : undefined}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <LanguageSwitcher className="hide-sm" />
          <Link className="btn btn--primary hide-sm" href="/contact">
            {t('ctaPartner')}
          </Link>
          <MobileMenu nav={mobileNavItems} current={current} />
        </div>
      </div>
    </header>
  );
}
