/** Types for settle-embeds.mjs, which prerender.mjs runs under plain node. */
export interface SettledSnapshot {
  /** The snapshot with every marked embed in its loaded state. */
  html: string;
  /** Whether the rewrite changed anything. */
  settled: boolean;
  /** Whether an embed is still mid-load after the rewrite — a build failure. */
  frozen: boolean;
}

export function settleEmbeds(html: string): SettledSnapshot;
export function isEmbedFrozen(html: string): boolean;
