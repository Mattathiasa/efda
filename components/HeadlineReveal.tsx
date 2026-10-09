import type {ReactNode} from 'react';

/* Each line slides up from a mask, 0.1s apart. Pure CSS (.reveal-line in
   styles.css) - no JS, and it is switched off under prefers-reduced-motion. */
export function RevealLine({children}: {children: ReactNode}) {
  return (
    <span className="reveal-line">
      <span>{children}</span>
    </span>
  );
}

export interface HeroLine {
  a: string;
  b: string;
  c: string;
}

/* Hero headline: three lines, each split into plain / accented / plain runs so
   translations can put the honey-coloured word wherever their grammar needs. */
export function HeadlineReveal({lines, id}: {lines: HeroLine[]; id?: string}) {
  return (
    <h1 className="h-hero" id={id}>
      {lines.map((line, i) => (
        <RevealLine key={i}>
          <span>{line.a}</span>
          <span className="accent">{line.b}</span>
          <span>{line.c}</span>
        </RevealLine>
      ))}
    </h1>
  );
}
