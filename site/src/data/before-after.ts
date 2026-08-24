/**
 * REAL before/after pairs, owner-supplied only.
 *
 * Ships EMPTY on purpose — the gallery renders a designed placeholder state
 * rather than inventing pairs. Drop real photos into `src/assets/gallery/`,
 * import them here, and the section fills itself in.
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
