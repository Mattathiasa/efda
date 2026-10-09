import {DuotonePhoto} from './DuotonePhoto';
import type {Tile} from '@/content/tiles';

export interface TileCopy {
  big: string;
  text: string;
  alt: string;
}

/* Photo tile with a forest caption card that lifts 6px on hover. Two tiles are
   double width and one is also double height; below 720px the CSS drops the
   spans so everything becomes a single cell. */
export function TrackTile({tile, copy}: {tile: Tile; copy: TileCopy}) {
  return (
    <figure
      className={['tile', tile.wide ? 'tile--wide' : null, tile.tall ? 'tile--tall' : null]
        .filter(Boolean)
        .join(' ')}
    >
      <DuotonePhoto
        photo={tile.photo}
        alt={copy.alt}
        sizes="(max-width: 720px) 100vw, (max-width: 1320px) 50vw, 440px"
      />
      <figcaption>
        <span className={['tile__big', tile.word ? 'tile__big--word' : null].filter(Boolean).join(' ')}>
          {copy.big}
        </span>
        <span className="tile__sub">{copy.text}</span>
      </figcaption>
    </figure>
  );
}
