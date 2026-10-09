import Image from 'next/image';
import {photos, type PhotoKey} from '@/content/photos';

/* Greyscale photo multiplied onto paper with forest lighten-blended on top,
   plus the hover viewfinder frame. All of that lives in .duo in styles.css -
   this component only supplies the box and the image.

   The source scans are 748-1586px wide, so the image is laid out with `fill`
   inside the aspect-ratio box the CSS defines and cropped with object-fit,
   rather than being stretched to a declared size. */
export function DuotonePhoto({
  photo,
  alt,
  arch,
  sizes = '(max-width: 720px) 100vw, 50vw',
  priority = false,
  className
}: {
  photo: PhotoKey;
  alt: string;
  /** Arch crop preset from the design. */
  arch?: 'arch' | 'arch--wide' | 'arch--card' | 'arch--office';
  sizes?: string;
  priority?: boolean;
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
      />
    </div>
  );
}
