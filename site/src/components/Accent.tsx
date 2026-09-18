import type { ReactNode } from "react";

/**
 * Italic accent-word treatment for headlines — the "copy voice" signature.
 * Usage: <h1>We do the cleaning. <Accent>You do the living.</Accent></h1>
 */
export function Accent({ children }: { children: ReactNode }) {
  return <em className="italic text-accent">{children}</em>;
}

/**
 * The accent on dark navy surfaces. It was gold until 2026-09-18; the colour lock
 * keeps one accent per page (burnt orange, and this lighter tint of it on navy),
 * so the name is historical.
 */
export function AccentGold({ children }: { children: ReactNode }) {
  return <em className="italic text-accent-on-dark">{children}</em>;
}
