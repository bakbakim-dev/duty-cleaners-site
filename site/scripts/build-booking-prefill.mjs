import { readFileSync, writeFileSync } from 'node:fs';
const source = new URL('../../bk-prefill-v2.js', import.meta.url);
const target = new URL('../../bk-header-fill.html', import.meta.url);
writeFileSync(target, '<!-- Duty Cleaners booking handoff v2: BEGIN -->\n<script>\n' + readFileSync(source, 'utf8') + '\n</script>\n<!-- Duty Cleaners booking handoff v2: END -->\n');
console.log('Generated BookingKoala header snippet.');
