# dutycleaners.ca homepage JSON-LD — what was fixed, and what still needs you

Generated 2026-08-22 from the live page. Corrected block: `schema-corrected-block.json`.

The block is injected **sitewide** — the `knowsAbout` section is byte-identical
(sha1 `5787ffd9810d`) on `/`, `/services/` and `/pricing/`, and AuditSpur found it on
128 pages. So this is **one edit in one place**, not 128.

Platform is WordPress 7.1. The markup is not in any local source — I checked all three
theme zips and this folder — so it lives in the live install: a code-snippets plugin,
your SEO plugin's sitewide schema field, or the theme header. If searching the database
is faster, it is a ~23KB blob in `wp_options` or `wp_posts`.

---

## Applied — 55 mechanical fixes, nothing judgemental

| Fix | Count | Why |
|---|---|---|
| `"SameAs"` → `"sameAs"` | 4 | schema.org is case-sensitive. `SameAs` is not a property, so these were silently discarded — no error, no fallback, just absent everywhere they were read. |
| `"url"` → `"sameAs"` on `City` | 30 | `url` means "this entity's own website". These are Wikipedia and Google Maps references, and `sameAs` is the property that means "reference that identifies this entity". `url` is *valid*, so nothing flagged it — this one is semantics, not a typo. |
| Literal spaces encoded → `%20` | 18 | A space is not legal in a URL. Affected the multi-word places (`Saint Albert`, `Lac Ste. Anne County`, …) and two `google.com/search?q=` links. |
| `null` removed from a `sameAs` array | 1 | `containsPlace[4]` carried a literal `null` where a URL should be. |
| `http://en.wikipedia.org` → `https://` | 4 | The page is HTTPS; these were the only plaintext references. |

**Verified, not assumed.** I diffed the parsed structure before and after with the renamed
keys normalised, so the value changes were actually compared rather than hidden inside a
key rename. Exactly 21 value differences remained and every one is in the table above.
The root `LocalBusiness.url` (`https://dutycleaners.ca/`) is untouched — it is correct,
and a blind `url` → `sameAs` sweep would have destroyed it.

Result: **67 entity links now readable that were previously discarded or malformed.**

---

## Applied — the deletions you approved

`containsPlace` went from **30 entries to 23**, all now distinct.

Grouped by **Wikipedia article**, not by name. That is an objective identity signal — the
same article is the same place — and it is precisely what `sameAs` encodes. Name matching
would have been a guess: `"City of Leduc"` and `"Leduc"` share no normalised form under
any rule worth trusting, and they were the same town.

| Deleted | Reason |
|---|---|
| `Edmonron` | The misspelt entry. It was the only one in the list with no Wikipedia reference, because the city does not exist — which is also why its second link was the `null`. |
| `Saint Albert`, `St Albert` | Same article as `St. Albert` |
| `sherwood Park` | Same article as `Sherwood Park` |
| `edmonton` | Same article as `Edmonton` |
| `City of Leduc`, `leduc` | Same article as `Leduc` |

The surviving name in each group is the one matching the Wikipedia article title, which is
the form the encyclopaedia and Google's entity graph use: **St. Albert**, **Sherwood
Park**, **Edmonton**, **Leduc**.

`Leduc County` and `Parkland County` were **kept** — they are genuinely distinct
municipalities from the towns inside them, with their own Wikipedia articles.

Deleting the lowercase duplicates resolved the casing problem as a side effect: no
remaining entry is miscased.

**Verified:** every surviving entry is byte-identical to its original, everything outside
`containsPlace` compares equal, the removed set matches the intended set exactly, and no
two remaining entries share a Wikipedia article.

---

## Final state

| | |
|---|---|
| Service areas | 23, all distinct |
| `sameAs` links | 54, all valid |
| Nulls / literal spaces / plaintext `http://` | 0 / 0 / 0 |
| Vocabulary problems | none |
| Root `LocalBusiness.url` | `https://dutycleaners.ca/` — untouched |

---

## After you deploy

```bash
python auditspur.py audit https://dutycleaners.ca --pages 200
```

`schema-vocabulary-typo` should go from 128 pages to zero. That is the verify half of the
loop — the fix is not done until a scan stops producing the finding.
