import { createHash } from "node:crypto";

export interface ContentRevision { hash: string; modified: string }
export type ContentRevisions = Record<string, ContentRevision>;

/** Dates describe revisions; changing the date itself must not create one. */
function withoutDates(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(withoutDates);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).filter(([key]) =>
      !["dateModified", "datePublished", "uploadDate"].includes(key)
    ).map(([key, child]) => [key, withoutDates(child)]));
  }
  return value;
}

export function contentFingerprint(html: string): string {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  if (!main) throw new Error("Missing prerendered main content");
  const text = main
    .replace(/<(script|style|svg)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<time\b[^>]*data-content-revision(?:="[^"]*")?[^>]*>[\s\S]*?<\/time>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ").trim();
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "";
  const descriptions = [...html.matchAll(/<meta\b[^>]*(?:name|property)="(?:description|og:description)"[^>]*content="([^"]*)"[^>]*>/gi)].map(m => m[1]);
  const links = [...main.matchAll(/<a\b[^>]*href="([^"]*)"/gi)].map(m => m[1]);
  const imageAlts = [...main.matchAll(/<img\b[^>]*alt="([^"]*)"/gi)].map(m => m[1]);
  const schema = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
    .map(m => withoutDates(JSON.parse(m[1])));
  return createHash("sha256").update(JSON.stringify({text, title, descriptions, links, imageAlts, schema})).digest("hex");
}

export function revisionFor(previous: ContentRevision | undefined, hash: string, approvedDate: string): ContentRevision {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(approvedDate) || new Date(`${approvedDate}T00:00:00Z`).toISOString().slice(0, 10) !== approvedDate) {
    throw new Error("An explicit valid YYYY-MM-DD revision date is required");
  }
  if (previous?.hash === hash) return previous;
  if (previous && approvedDate < previous.modified) throw new Error("Revision date cannot move backwards");
  return {hash, modified: approvedDate};
}
