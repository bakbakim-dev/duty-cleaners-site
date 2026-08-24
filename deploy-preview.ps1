# Deploy the Duty Cleaners staging preview to GitHub Pages.
#
#   pwsh -File deploy-preview.ps1
#
# Builds site/ with the Pages subpath, prerenders EVERY indexable route to static
# HTML, neutralises all indexing (this build must never compete with
# dutycleaners.ca in search), then commits and pushes site/dist to the
# dutycleaners-preview repo.
#
# Live at: https://bakbakim-dev.github.io/dutycleaners-preview/

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$site = Join-Path $root "site"
$dist = Join-Path $site "dist"
$base = "/dutycleaners-preview/"

# dist/ is its own git repo (the Pages remote), but it is also Vite's outDir and
# gets emptied on every build. Stash the repo metadata across the build rather
# than re-cloning it afterwards — losing it once already broke a publish.
$gitDir = Join-Path $dist ".git"
$gitStash = Join-Path $site ".dist-git-backup"
if (Test-Path $gitDir) {
  if (Test-Path $gitStash) { Remove-Item $gitStash -Recurse -Force }
  Move-Item $gitDir $gitStash
}

try {
  Write-Host "==> Building with base $base" -ForegroundColor Cyan
  Set-Location $site
  bun run build --base=$base
  if ($LASTEXITCODE -ne 0) { throw "build failed" }

  # prerender:all, not prerender. public/_redirects ends in a 404 fallback, so
  # every indexable route must exist on disk as a real file — and staging should
  # exercise exactly what production will serve, not a 54-route subset.
  Write-Host "==> Prerendering all routes (matches netlify.toml)" -ForegroundColor Cyan
  node scripts/prerender.mjs --all
  if ($LASTEXITCODE -ne 0) { Write-Warning "prerender reported failures — continuing with what succeeded" }
}
finally {
  if (Test-Path $gitStash) {
    if (Test-Path $gitDir) { Remove-Item $gitDir -Recurse -Force }
    Move-Item $gitStash $gitDir
  }
}

Write-Host "==> Applying preview safeguards" -ForegroundColor Cyan
Set-Location $dist

# 1. Replace (not duplicate) the robots meta in EVERY html file so nothing on the
#    staging host says "index, follow" — prerendered pages and 404.html included.
$noindex = '<meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />'
$htmlFiles = Get-ChildItem $dist -Recurse -Filter "*.html"
foreach ($f in $htmlFiles) {
  $html = Get-Content $f.FullName -Raw
  $html = [regex]::Replace($html, '<meta\s+name="robots"[^>]*>', $noindex)
  if ($html -notmatch 'name="robots"') { $html = $html -replace '<head>', "<head>`n    $noindex" }
  if ($html -match 'content="index') { throw "an index,follow robots tag survived in $($f.Name) — aborting" }
  Set-Content $f.FullName $html -NoNewline
}
Write-Host "    noindex applied to $($htmlFiles.Count) html files" -ForegroundColor DarkGray

# 2. prerender.mjs already wrote 404.html from the pristine shell, and step 1 just
#    noindexed it. The shell itself is a build intermediate and must not ship.
if (-not (Test-Path (Join-Path $dist "404.html"))) { throw "404.html missing — prerender did not complete" }
Remove-Item (Join-Path $dist "spa-shell.html") -Force -ErrorAction SilentlyContinue

# 3. Full crawler disallow + drop the sitemaps that point at real URLs.
@"
# STAGING PREVIEW — not the live site.
# Full disallow so this build can never compete with dutycleaners.ca in search.
User-agent: *
Disallow: /
"@ | Set-Content (Join-Path $dist "robots.txt")
Get-ChildItem $dist -Filter "sitemap*.xml" | Remove-Item -Force
if (-not (Test-Path (Join-Path $dist ".nojekyll"))) { New-Item -ItemType File (Join-Path $dist ".nojekyll") | Out-Null }

# 4. Sanity: the 404 fallback is only safe if the routes actually exist on disk.
#    Staging is on GitHub Pages, which ignores _redirects, but a low page count
#    here means the same build on Netlify would 404 real pages.
$pageCount = (Get-ChildItem $dist -Recurse -Filter "index.html").Count
Write-Host "    $pageCount prerendered pages on disk" -ForegroundColor DarkGray
if ($pageCount -lt 150) { throw "only $pageCount pages prerendered — expected ~207. Did prerender:all run?" }

Write-Host "==> Publishing" -ForegroundColor Cyan
if (-not (Test-Path (Join-Path $dist ".git"))) { throw "dist is not a git repo — run the initial deploy first" }
git add -A
$stamp = Get-Date -Format "yyyy-MM-dd HH:mm"
git commit -q -m "Preview build $stamp" 2>&1 | Out-Null
git push -q origin main
Write-Host "==> Live: https://bakbakim-dev.github.io/dutycleaners-preview/" -ForegroundColor Green
