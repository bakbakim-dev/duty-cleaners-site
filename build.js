// Inline bridge.js into template.html -> dist/quote-redirect/index.html
//
// One source of truth: bridge.js is what verify.js tests, and what ships.
// Upload dist/quote-redirect/ to the dutycleaners.ca web root so the page
// resolves at https://dutycleaners.ca/quote-redirect/
//
//   node build.js

const fs = require('fs');
const path = require('path');

const bridge = fs.readFileSync(path.join(__dirname, 'bridge.js'), 'utf8');
const template = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');

if (!template.includes('/*BRIDGE*/')) {
  console.error('template.html is missing the /*BRIDGE*/ placeholder.');
  process.exit(1);
}

// A literal "</script>" anywhere in the script body would close the tag early.
// Nothing in bridge.js contains one today; fail loudly if that ever changes.
if (/<\/script/i.test(bridge)) {
  console.error('bridge.js contains "</script>" — it cannot be inlined safely.');
  process.exit(1);
}

// Strip comments and indentation for the shipped copy. bridge.js stays the
// readable source of truth; dist/ is the artifact.
//
// Only *whole-line* comments are removed. Never strip `//` mid-line — the BK
// base URL contains "https://", and a naive comment regex would eat it.
function compact(src) {
  const out = [];
  let inBlock = false;
  for (const raw of src.split('\n')) {
    const line = raw.trim();
    if (inBlock) {
      if (line.includes('*/')) inBlock = false;
      continue;
    }
    if (line.startsWith('/*')) {
      if (!line.includes('*/')) inBlock = true;
      continue;
    }
    if (line.startsWith('//') || line === '') continue;
    // Trailing comments too — but never touch a line containing "://", which
    // is the one place a lone // is real code (the BK base URL).
    const stripped = line.includes('://') ? line : line.replace(/\s+\/\/.*$/, '');
    out.push(stripped);
  }
  return out.join('\n');
}

const outDir = path.join(__dirname, 'dist', 'quote-redirect');
fs.mkdirSync(outDir, { recursive: true });

const outFile = path.join(outDir, 'index.html');
fs.writeFileSync(outFile, template.replace('/*BRIDGE*/', compact(bridge)));

const kb = (fs.statSync(outFile).size / 1024).toFixed(1);
console.log('Wrote ' + path.relative(__dirname, outFile) + ' (' + kb + ' KB)');
console.log('Upload the dist/quote-redirect/ folder to the site root.');
