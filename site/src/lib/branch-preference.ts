/**
 * The office a visitor last looked at, remembered in the browser.
 *
 * WHY THIS EXISTS
 * The header and footer pick their office from the URL (city-from-path.ts).
 * That is right for every page that belongs to a branch, and it has nothing
 * to go on for the pages that belong to none — About, FAQs, Reviews, Contact,
 * the blog, the legal pages. Those used to fall back to Edmonton, so a visitor
 * who had just chosen Calgary saw the Edmonton phone the moment they opened
 * About. A static site can remember a choice; it just did not.
 *
 * WHAT IT TOUCHES, AND WHAT IT NEVER TOUCHES
 * Only the chrome: the phone in the header and footer, the quote button's
 * target, and the service links that have city twins. Body copy and JSON-LD
 * never follow it, and the preference is read only after mount — so the
 * prerender, and every crawler (which is stateless: no localStorage from one
 * page to the next), get the neutral chrome on neutral pages, every time.
 * Nothing indexed changes shape, and nothing is served differently to a
 * crawler than to a first-time visitor.
 *
 * The key is named in the privacy policy under "Cookies and Website Storage".
 */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import type { Branch } from "@/lib/city-from-path";

export const BRANCH_PREFERENCE_KEY = "duty-branch";

const BRANCHES: ReadonlySet<string> = new Set(["edmonton", "calgary", "reddeer"]);

/** The stored branch, or null when there is none or storage is unavailable. */
export function readBranchPreference(): Branch | null {
  try {
    const value = window.localStorage.getItem(BRANCH_PREFERENCE_KEY);
    return value !== null && BRANCHES.has(value) ? (value as Branch) : null;
  } catch {
    return null;
  }
}

/**
 * Which preference to keep once a visitor lands on a page that belongs to
 * `seen`. Calgary and Red Deer pages always win: a visitor reaches them only
 * on purpose. An Edmonton page never overwrites Red Deer, because Red Deer
 * has one page of its own and shares every Edmonton page — a Red Deer visitor
 * who opens the (Edmonton) price list must keep the Red Deer phone.
 */
export function nextBranchPreference(current: Branch | null, seen: Branch): Branch {
  if (seen === "edmonton" && current === "reddeer") return "reddeer";
  return seen;
}

export function rememberBranch(seen: Branch): void {
  try {
    window.localStorage.setItem(BRANCH_PREFERENCE_KEY, nextBranchPreference(readBranchPreference(), seen));
  } catch {
    // Private mode or blocked storage: the page works without a memory.
  }
}

/**
 * The remembered branch, re-read on every route change, or null until the
 * component has mounted. Null is what the prerender and every crawler see.
 */
export function useBranchPreference(): Branch | null {
  const { pathname } = useLocation();
  const [preference, setPreference] = useState<Branch | null>(null);
  useEffect(() => {
    setPreference(readBranchPreference());
  }, [pathname]);
  return preference;
}
