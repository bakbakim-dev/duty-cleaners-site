/**
 * REAL before/after pairs, owner-supplied only.
 *
 * Ships EMPTY on purpose. The gallery renders nothing at all (no section, no
 * placeholder line) until a city has approved pairs, rather than inventing
 * any. Drop real, homeowner-approved photos into `src/assets/gallery/`,
 * import them here, and the section appears.
 */
export interface BeforeAfterPair {
  /** Imported image module for the "before" frame. */
  before: string;
  /** Imported image module for the "after" frame. */
  after: string;
  /** Plain-language room/job label, e.g. "Oven — Terwillegar". */
  label: string;
  beforeAlt: string;
  afterAlt: string;
}

export const BEFORE_AFTER: Record<"Edmonton" | "Calgary", BeforeAfterPair[]> = {
  Edmonton: [],
  Calgary: [],
};
