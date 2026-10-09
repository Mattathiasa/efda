'use client';

import {useEffect} from 'react';

/* Scroll behaviour for the whole page, mounted once in the layout: reveal
   blocks as they come into view, condense the header once you leave the top,
   and drive the reading-progress hairline.

   The reveal is driven by the scroll handler rather than an
   IntersectionObserver, on purpose. An observer that never fires - an anchor
   jump that lands past the element, a restored scroll position, a browser
   that defers the callback - leaves content permanently invisible, which is
   the worst failure this effect could have. A position check on each scroll
   frame cannot get stuck: if a block is on screen, it is shown. There are
   fewer than ten of them per page, so the cost is nil.

   Three further guarantees:
   - the hiding CSS is scoped to html.js-motion, added only here, so with JS
     off nothing is hidden;
   - under prefers-reduced-motion the class is never added at all;
   - a timeout reveals everything regardless, so no bug in this file can cost
     anyone the content. */
export function ScrollEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    const all = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-group]')
    );
    const revealAll = () => all.forEach((el) => el.classList.add('is-in'));

    // Where scroll-driven animations exist, the reveal is handled entirely in
    // CSS and tied to scroll position, which cannot strand content hidden.
    // This path is only for browsers without them.
    const scrollDriven =
      typeof CSS !== 'undefined' &&
      CSS.supports &&
      CSS.supports('animation-timeline: view()');

    const useFallback = !scrollDriven && !reduced.matches && all.length > 0;
    if (useFallback) root.classList.add('js-motion');

    let pending = useFallback ? all.slice() : [];
    let ticking = false;

    const frame = () => {
      ticking = false;
      const y = window.scrollY;

      // Both of these are written to <html>, never to the header or the
      // progress span. Those are React-owned nodes, and a scroll frame can
      // land in the middle of a client-side navigation hydrating them - React
      // then finds an attribute it did not render and reports a hydration
      // mismatch, after which it stops patching that tree. <html> is rendered
      // once and never re-hydrated, so writing there cannot collide.
      root.classList.toggle('is-scrolled', y > 24);

      const max = root.scrollHeight - window.innerHeight;
      root.style.setProperty('--p', max > 0 ? String(Math.min(y / max, 1)) : '0');

      if (pending.length) {
        const limit = window.innerHeight * 0.92;
        const still: HTMLElement[] = [];
        for (const el of pending) {
          // Reveal once the top edge crosses the line, or if the element is
          // already straddling the viewport (tall sections, anchor jumps).
          const box = el.getBoundingClientRect();
          if (box.top < limit && box.bottom > 0) el.classList.add('is-in');
          else if (box.top < limit) el.classList.add('is-in');
          else still.push(el);
        }
        pending = still;
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(frame);
    };

    frame();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll, {passive: true});
    // An anchor in the URL is applied by the browser after hydration.
    window.addEventListener('hashchange', onScroll);

    // Last resort. Nothing here is worth a blank page.
    const safety = window.setTimeout(() => {
      revealAll();
      pending = [];
    }, 3000);

    const onPreferenceChange = () => {
      if (!reduced.matches) return;
      root.classList.remove('js-motion');
      revealAll();
      pending = [];
    };
    reduced.addEventListener('change', onPreferenceChange);

    return () => {
      window.clearTimeout(safety);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('hashchange', onScroll);
      reduced.removeEventListener('change', onPreferenceChange);
      root.classList.remove('js-motion');
      root.classList.remove('is-scrolled');
    };
  }, []);

  return null;
}
