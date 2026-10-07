import { Calendar } from "lucide-react";
import { modifiedOr, publishedFor } from "@/data/post-published";

/** "2026-09-05" -> "September 5, 2026", without a timezone shifting the day. */
export const readableDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return months[m - 1] && d ? `${months[m - 1]} ${d}, ${y}` : iso;
};

/**
 * The visible dates on a blog post, read from the same sources as its Article
 * schema (post-published.ts for datePublished, post-dates.ts for dateModified).
 * The posts used to hand-type a date here, which disagreed with the schema on
 * every preserved WordPress post. The revision date sits in a
 * `data-content-revision` <time> so the content-dates hash ignores it.
 */
export function PostDateline({ path }: { path: string }) {
  const published = publishedFor(path);
  const modified = modifiedOr(path);
  const showUpdated = modified && modified !== published;
  return (
    <span className="flex flex-wrap items-center gap-x-1 gap-y-0.5">
      <Calendar className="h-4 w-4" aria-hidden="true" />
      {published && (
        <>Published <time dateTime={published}>{readableDate(published)}</time></>
      )}
      {published && showUpdated && <span aria-hidden="true">·</span>}
      {showUpdated && (
        <>{published ? "updated" : "Updated"} <time data-content-revision dateTime={modified}>{readableDate(modified)}</time></>
      )}
    </span>
  );
}
