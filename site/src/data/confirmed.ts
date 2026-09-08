/**
 * A value the owner has actually confirmed, as a type the compiler enforces.
 *
 * policy.ts and proof.ts share one convention: `null` means "not confirmed;
 * render nothing". The other half of that convention — that a non-null value
 * HAS been confirmed — was only ever a comment. `Confirmed<T>` was declared as
 * a bare alias for `T`, so `cancellationFee: "$50"` and `cancellationFee:
 * confirmedByOwner("$50")` were the same thing to the type checker, and a
 * plausible figure typed in passing was indistinguishable from a settled one.
 *
 * Now `Confirmed<T>` is branded. The only way to produce one is `confirm()`,
 * which takes the value AND its provenance: who settled it and the date the
 * answer was recorded. A bare literal in a `Confirmed` slot no longer compiles,
 * so the question "where did this number come from?" is answered in the code
 * rather than in a comment that can be deleted without anything noticing.
 *
 * The brand is purely a type. `confirm()` returns the value unchanged, so a
 * `Confirmed<string>` still concatenates, a `Confirmed<number>` still adds, and
 * nothing rendered changes.
 */

declare const CONFIRMED: unique symbol;

/** A value with a recorded confirmation. Only `confirm()` produces one. */
export type Confirmed<T> = T & { readonly [CONFIRMED]: true };
/** A value nobody has settled yet. Renders as nothing. */
export type Unconfirmed = null;

/** ISO calendar date, e.g. "2026-09-07". */
export type IsoDate = `${number}-${number}-${number}`;

export interface Provenance {
  /** Who settled it. "owner" is the business owner; the others name a document. */
  by: "owner" | "google-listing" | "published-copy";
  /** The date the confirmation was recorded in this repository. */
  on: IsoDate;
  /** Optional: what was asked, or where to look. */
  note?: string;
}

/** Every confirmation made in this process, in declaration order. Read by tests. */
export const PROVENANCE: ReadonlyArray<Provenance & { value: unknown }> = [];

const ISO = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Mark a value as confirmed. The provenance is required, and the date must be
 * a real calendar date — a typo'd "2026-9-7" would otherwise read as a record
 * while matching nothing anyone can look up.
 */
export function confirm<T>(value: T, provenance: Provenance): Confirmed<T> {
  if (!ISO.test(provenance.on) || Number.isNaN(Date.parse(provenance.on))) {
    throw new Error(`confirm(): "${provenance.on}" is not an ISO date`);
  }
  (PROVENANCE as Array<Provenance & { value: unknown }>).push({ ...provenance, value });
  return value as Confirmed<T>;
}
