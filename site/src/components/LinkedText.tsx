import { Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";

export interface TextLink {
  /** The exact phrase in the text that becomes the link (its first occurrence). */
  text: string;
  href: string;
}

const LINK_CLASS = "text-primary underline underline-offset-2";

/**
 * Plain text with some of its phrases linked, so copy kept as strings (FAQ
 * answers, blog cards) can still carry in-sentence links. A site path stays in
 * the same tab; an outside source opens in a new one. A phrase that is not in
 * the text is skipped, so the text is always shown in full.
 */
export default function LinkedText({ text, links = [] }: { text: string; links?: TextLink[] }) {
  const found = links
    .map((link) => ({ link, at: text.indexOf(link.text) }))
    .filter(({ at }) => at >= 0)
    .sort((a, b) => a.at - b.at);
  const parts: ReactNode[] = [];
  let cursor = 0;
  for (const { link, at } of found) {
    if (at < cursor) continue;
    parts.push(text.slice(cursor, at));
    parts.push(
      link.href.startsWith("/") ? (
        <Link key={at} to={link.href} className={LINK_CLASS}>{link.text}</Link>
      ) : (
        <a key={at} href={link.href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>{link.text}</a>
      ),
    );
    cursor = at + link.text.length;
  }
  parts.push(text.slice(cursor));
  return <>{parts.map((part, i) => <Fragment key={i}>{part}</Fragment>)}</>;
}
