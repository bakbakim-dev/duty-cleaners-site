import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Every FAQ answer has to make sense quoted on its own.
 *
 * Each answer ships twice: in the accordion a visitor reads, and inside
 * FAQPage JSON-LD, where search engines and AI assistants lift one question
 * and its answer at a time and show them with nothing around them. An answer
 * that points at the rest of the page says nothing once it has been lifted.
 *
 * The eight-lens audit of September 2026 flagged six, and all six were still
 * in the build on 10 September:
 *
 *     /edmonton/deep-cleaning/   "The full table by home size is on this page."
 *     /calgary/deep-cleaning/    "The table above lists every home size."
 *     /pricing/                  "...optional and priced in the table above..."
 *     /services/                 "Every figure on this page is before tax..."
 *     /calgary/services/         "Add 5% GST to any figure on this page."
 *     /whats-included/           "The checklist on this page is what the
 *                                 guarantee is measured against."
 *
 * The first run of this guard found five more that the audit had not listed:
 * the contact form "on this page", a hiring window "quoted above", the cost
 * guide's recurring table "below", and two idioms, "go above and beyond" and
 * a price "step above an apartment". The idioms were reworded, not excused. A
 * plain word ban needs no judgement to apply, and an exception list is where
 * the next pointer would hide.
 *
 * The fix is always the same: repeat the figure from pricing.ts or policy.ts,
 * or name the table or list, instead of pointing at it.
 *
 * These run against dist/, the markup a crawler actually receives.
 */

const DIST = join(__dirname, "..", "..", "dist");

/** Only a reader who can see the rest of the page knows what these refer to. */
const POINTS_AT_THE_PAGE = /\b(?:above|below|this page)\b/i;

/** The pages the audit flagged, so a scan that stops reading them cannot pass. */
const AUDITED = [
  "/edmonton/deep-cleaning/",
  "/calgary/deep-cleaning/",
  "/pricing/",
  "/services/",
  "/calgary/services/",
  "/whats-included/",
];

type Node = Record<string, unknown>;
type Answer = { url: string; question: string; text: string };

const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : value == null ? [] : [value]);
const isNode = (value: unknown): value is Node => typeof value === "object" && value !== null;

/** Every FAQPage node in a parsed ld+json value, at any depth (@graph, arrays, nesting). */
function faqPages(value: unknown, out: Node[] = []): Node[] {
  if (Array.isArray(value)) {
    for (const item of value) faqPages(item, out);
  } else if (isNode(value)) {
    if (asArray(value["@type"]).includes("FAQPage")) out.push(value);
    for (const child of Object.values(value)) faqPages(child, out);
  }
  return out;
}

/** Every acceptedAnswer on every built page, with the page and question it belongs to. */
function builtAnswers(): { answers: Answer[]; unreadable: string[] } {
  const answers: Answer[] = [];
  const unreadable: string[] = [];
  if (!existsSync(DIST)) return { answers, unreadable };
  const walk = (dir: string, url: string) => {
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) {
        walk(path, `${url}${entry}/`);
        continue;
      }
      if (entry !== "index.html") continue;
      const html = readFileSync(path, "utf-8");
      for (const m of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
        let parsed: unknown;
        try {
          parsed = JSON.parse(m[1].trim());
        } catch {
          unreadable.push(url);
          continue;
        }
        for (const faq of faqPages(parsed)) {
          for (const question of asArray(faq.mainEntity).filter(isNode)) {
            for (const answer of asArray(question.acceptedAnswer).filter(isNode)) {
              answers.push({ url, question: String(question.name ?? ""), text: String(answer.text ?? "") });
            }
          }
        }
      }
    }
  };
  walk(DIST, "/");
  return { answers, unreadable };
}

describe("FAQ answers stand on their own", () => {
  const { answers, unreadable } = builtAnswers();

  it("reads the FAQPage answers on every page the audit flagged", () => {
    if (!existsSync(DIST)) return; // nothing to check before a prerender
    expect(unreadable, "ld+json blocks that do not parse, so their answers cannot be checked").toEqual([]);
    const pages = new Set(answers.map((a) => a.url));
    expect(pages.size, "pages carrying FAQPage answers; a scan that reads nothing passes everything").toBeGreaterThan(150);
    expect(AUDITED.filter((url) => !pages.has(url)), "audited pages whose FAQPage answers were not found").toEqual([]);
  });

  it("no FAQ answer points at the rest of its page", () => {
    const offenders = answers
      .filter((a) => POINTS_AT_THE_PAGE.test(a.text))
      .map((a) => {
        const at = a.text.search(POINTS_AT_THE_PAGE);
        return `${a.url} "${a.question}": …${a.text.slice(Math.max(0, at - 70), at + 50)}…`;
      });
    expect(
      offenders,
      `FAQ answers that point at the page instead of saying the thing:\n${offenders.join("\n")}\n` +
        `Search engines and AI assistants lift each answer out of the FAQPage markup on its own, ` +
        `where "above", "below" and "this page" refer to nothing. Repeat the figure from ` +
        `pricing.ts or policy.ts, or name the table or list, instead of pointing at it.`,
    ).toEqual([]);
  });
});
