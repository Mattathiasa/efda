import {GlobeWatermark} from './GlobeMark';

/* Large outline-only globes sitting behind the hero, the call-to-action band
   and the contact form. Positioning and opacity come from styles.css. */

export function HeroWatermark() {
  return (
    <GlobeWatermark
      className="watermark hero__watermark"
      tile={{fill: '#F0B43C', opacity: 0.6}}
    />
  );
}

export function CtaWatermark() {
  return <GlobeWatermark className="watermark cta__watermark" tile={{fill: '#FFFFFF'}} />;
}

export function FormWatermark() {
  return (
    <GlobeWatermark className="watermark form-card__watermark" tile={{fill: '#F0B43C'}} />
  );
}
