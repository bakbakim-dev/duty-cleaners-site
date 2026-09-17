import type { CSSProperties } from "react";

/**
 * A row of rating stars as ONE element.
 *
 * Every five-star row used to be five inline lucide <svg>s: the homepage
 * carried 101 of them (about 64 KB of markup and ~200 DOM nodes) before a
 * single word of copy. The stars are now drawn by the stylesheet — a masked
 * pseudo-element repeating one star glyph, `.dc-stars` in index.css — so a
 * row costs one node and no bytes beyond its class.
 *
 * Two shapes, matching what the rows meant before:
 * - Decorative (no `label`): a span, aria-hidden, sitting next to text that
 *   already states the rating ("4.9 on Google").
 * - Informative (`label` given): a div with role="img" named with the rating,
 *   e.g. "4 out of 5 stars" — the review cards, where the stars ARE the data
 *   and a four-star review must be announced as four (area-template-0911).
 *
 * `rating` below five paints the remainder in the muted tone; `size` is the
 * star height in rem (the old h-3 / h-4 / h-5 / h-7 classes). Colour comes
 * from the text colour, so pass `text-brand-gold`, `text-yellow-400`, etc.
 */
interface StarsProps {
  rating?: number;
  /** Star height in rem. 0.75 = h-3, 0.875 = h-3.5, 1 = h-4, 1.25 = h-5, 1.5 = h-6, 1.75 = h-7. */
  size?: number;
  className?: string;
  /** Accessible name; when given the row is an image with this name, else it is decorative. */
  label?: string;
}

export default function Stars({ rating = 5, size = 0.75, className = "", label }: StarsProps) {
  const stars = Math.max(0, Math.min(5, Math.round(rating)));
  const style = { "--dc-star": `${size}rem`, "--dc-rating": stars } as CSSProperties;
  // Gold unless the caller names a text colour (the carousel's yellow, the
  // wall-washing pages' accent); two colour utilities would race in the cascade.
  const tone = /\btext-/.test(className) ? "" : "text-brand-gold";
  const cls = `dc-stars ${tone} ${className}`.replace(/\s+/g, " ").trim();
  return label ? (
    <div className={cls} style={style} role="img" aria-label={label} />
  ) : (
    <span className={cls} style={style} aria-hidden="true" />
  );
}
