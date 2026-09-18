import type { ImgHTMLAttributes } from "react";
import type { Picture } from "vite-imagetools";

/**
 * One <img> from a build-time Picture (an import ending in ?card, ?col or
 * ?hero — see IMAGE_PRESETS in vite.config.ts).
 *
 * AuditSpur scan 1131 (2026-09-17) listed 15 pages whose content images had
 * no responsive sources: a 1024-px file for a card that renders at 132 CSS px
 * on a phone. This emits the width-descriptor srcset the build generated, the
 * `sizes` the layout actually uses, and the intrinsic width and height so the
 * box is reserved before the bytes arrive (Lighthouse's unsized-images).
 *
 * `sizes` is the one thing the caller must get right: it is the rendered
 * width, not the source width. The presets below were measured on the built
 * pages at 375 and 1366 CSS px (2026-09-17); pass a custom string for any
 * layout they do not describe. Below-the-fold images default to lazy and
 * async; the LCP hero on a page should pass loading="eager" and
 * fetchPriority="high" instead, never lazy.
 */
export const SIZES = {
  /** A card in a 2- or 3-column grid: ~343 px on phones, 240–360 px on desktop. */
  card: "(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw",
  /** A single reading column: full width on phones, up to 896 px on desktop. */
  column: "(min-width: 1024px) 896px, 100vw",
  /** A two-up feature (image beside text): full width on phones, half on desktop. */
  half: "(min-width: 1024px) 560px, 100vw",
  /** Full-bleed hero or background. */
  full: "100vw",
} as const;

interface ResponsiveImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "width" | "height" | "sizes"> {
  picture: Picture;
  sizes: string;
  alt: string;
}

export default function ResponsiveImage({
  picture,
  sizes,
  alt,
  loading = "lazy",
  decoding = "async",
  ...rest
}: ResponsiveImageProps) {
  // A source narrower than every preset width (a 382-px detail shot) has no
  // candidates: it ships as itself, and a `sizes` without a srcset is noise.
  const srcSet = picture.sources.webp || undefined;
  return (
    <img
      src={picture.img.src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      width={picture.img.w}
      height={picture.img.h}
      alt={alt}
      loading={loading}
      decoding={decoding}
      {...rest}
    />
  );
}
