import type { ReactNode } from "react";

/**
 * Italic accent-word treatment for headlines — the "copy voice" signature.
 * Usage: <h1>We do the cleaning. <Accent>You do the living.</Accent></h1>
 */
export function Accent({ children }: { children: ReactNode }) {
  return <em className="italic text-accent">{children}</em>;
}

/** Gold variant for dark navy hero surfaces. */
export function AccentGold({ children }: { children: ReactNode }) {
  return <em className="italic text-brand-gold">{children}</em>;
}
