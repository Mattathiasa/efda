import Image from 'next/image';
import {photos, type PhotoKey} from '@/content/photos';

/* A graded colour photo in one of the design's arch crops.

   The grade, vignette and grain live in `.duo` in styles.css. The hover
   viewfinder frame is a real element rather than a pseudo-element, because
   ::before and ::after are both spoken for (grain and vignette).

   Source scans run 748-1586px wide, so the image is laid out with `fill`
   inside the aspect-ratio box the CSS defines and cropped with object-fit,
   never stretched past its intrinsic size. */
export function Photo({
  photo,
  alt,
  arch,
  sizes = '(max-width: 720px) 100vw, 50vw',
  priority = false,
  /** Shifts the crop window, e.g. to keep a blemish out of frame. */
  objectPosition,
  className
}: {
  photo: PhotoKey;
  alt: string;
  arch?: 'arch' | 'arch--wide' | 'arch--card' | 'arch--office';
  sizes?: string;
  priority?: boolean;
  objectPosition?: string;
  className?: string;
}) {
  return (
    <div className={['duo', arch, className].filter(Boolean).join(' ')}>
      <Image
        src={photos[photo]}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        quality={82}
        // Static imports carry a generated blurDataURL, so this is free. It
        // is the largest perceived-loading win available on a slow
        // connection: something of the photo is there immediately.
        placeholder="blur"
        style={objectPosition ? {objectPosition} : undefined}
      />
      <span className="duo__frame" aria-hidden="true" />
    </div>
  );
}
