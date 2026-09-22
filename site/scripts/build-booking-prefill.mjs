import { readFileSync, writeFileSync } from 'node:fs';
const source = new URL('../../bk-prefill-v2.js', import.meta.url);
const brand = new URL('../../bk-brand.css', import.meta.url);
const travelFee = new URL('../../bk-travel-fee.js', import.meta.url);
const target = new URL('../../bk-header-fill.html', import.meta.url);
// Three independent blocks, each with its own markers, so any one can be rolled
// back in Theme Builder without touching the others: the brand layer applies to
// every BookingKoala page; the handoff receiver and the travel-fee check (every
// /booknow visit, funnel or not) only to /booknow.
writeFileSync(
  target,
  '<!-- Duty Cleaners brand styles: BEGIN -->\n<style>\n' + readFileSync(brand, 'utf8') + '</style>\n<!-- Duty Cleaners brand styles: END -->\n' +
  '<!-- Duty Cleaners booking handoff v2: BEGIN -->\n<script>\n' + readFileSync(source, 'utf8') + '\n</script>\n<!-- Duty Cleaners booking handoff v2: END -->\n' +
  '<!-- Duty Cleaners travel fee by postal code: BEGIN -->\n<script>\n' + readFileSync(travelFee, 'utf8') + '\n</script>\n<!-- Duty Cleaners travel fee by postal code: END -->\n',
);
console.log('Generated BookingKoala header snippet.');
