# dutycleaners.ca — Legacy Site Mirror

A full local snapshot of the live WordPress site (dutycleaners.ca) being
replaced by the React rebuild in `../site`. Captured so the legacy content
can be referenced, diffed, or ported without repeatedly crawling the live
site.

## Structure

```
legacy-site-mirror/
  INDEX.md          — categorized list of every page, links to content.txt
  manifest.json      — machine-readable: url, title, http status, asset count
  pages/<path>/
    index.html        — raw HTML exactly as served
    content.txt        — stripped, deduped, greppable plain text
  assets/wp-content/... — every image referenced on a mirrored page,
                           saved at its original wp-content path
```

`pages/_home/` is the site root (`https://dutycleaners.ca/`).

## Coverage

135 of 148 discovered URLs mirrored successfully (source: the live
`sitemaps.xml` sitemap index, unioned with every legacy URL tracked in
`../URL-MIGRATION-MAP.csv`). The 13 failures are dead/renumbered URLs that
already 404 on the live site itself — not a mirror gap. See `manifest.json`
for the full pass/fail list.

181 unique images downloaded (every same-domain `wp-content` image
referenced by a mirrored page's `<img>`/`data-src`).

## Regenerating

The scripts that built this aren't checked in here (they were run from a
scratch directory). To refresh: re-pull the sitemap URLs from
`https://dutycleaners.ca/sitemaps.xml`, fetch each with a normal browser
User-Agent, save HTML verbatim, strip nav/header/footer/script/style tags
for `content.txt`, and download any `<img>`/`data-src` pointing at
`dutycleaners.ca/wp-content/`.

## Use this for

- Confirming exact wording/claims before reusing them anywhere on the new
  site (per this project's no-fabrication policy — see `src/data/proof.ts`).
- Finding content that exists on the legacy site but hasn't been ported yet.
- Recovering real photos for pages still using AI-generated placeholders.
