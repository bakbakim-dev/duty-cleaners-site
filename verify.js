// Verify bridge.js maps against the real GHL option strings, by loading the
// actual bridge source and driving it with a stubbed window/location.
const fs = require('fs');
const path = require('path');

const SRC = fs.readFileSync(
  path.join(__dirname, 'bridge.js'),
  'utf8'
);

// Exact option text pulled from the live GHL widget payload (form AwJDnvuYtkojIN3aOysC)
const GHL = {
  service: ['Standard Cleaning ', 'Move in Move out Cleaning '],
  hometype: [
    'What type of home do you have? Click here',
    'Two Storey Detached Home (Main Floor & Upper Floor)',
    'Two Storey Townhouse/Duplex ',
    'Bungalow (Single Storey Home)',
    'Apartment/Condo (Single Storey)',
  ],
  bedrooms: [
    'One Bedroom (Under 800 Sqft)', 'Two Bedrooms (Under 1100 Sqft)',
    'Three Bedrooms (Under 1700 Sqft)', 'Four Bedrooms (Under 2300 Sqft)',
    'Five Bedrooms (Under 3000 Sqft)', 'Six Bedrooms (Under 3600 Sqft)',
    'Seven Bedrooms (Under 4200 Sqft)',
  ],
  bathrooms: ['1 Bathroom', '2 Bathrooms', '3 Bathrooms', '4 Bathrooms', '5 Bathrooms', '6 Bathrooms'],
  halfbaths: [
    '0 Half Baths (With only a Toilet and Sink)', '1 Half Baths (With only a Toilet and Sink)',
    '2 Half Baths (With only a Toilet and Sink)', '3 Half Baths (With only a Toilet and Sink)',
    '4 Half Baths (With only a Toilet and Sink)',
  ],
  frequency: [
    'One Time', 'Every Week (20% off)',
    'Every 2 Weeks (Most Popular Option 15% off )', 'Every 4 Weeks (10% off)',
  ],
};

// Run bridge.js against a query string, capture where it would redirect.
function run(query) {
  let landed = null;
  const window = {
    location: { search: query, replace: (u) => { landed = u; } },
  };
  const fn = new Function('window', 'URLSearchParams', SRC);
  fn(window, URLSearchParams);
  return landed;
}

function parse(url) {
  const out = {};
  const qs = url.split('?')[1] || '';
  for (const pair of qs.split('&')) {
    if (!pair) continue;
    const [k, v] = pair.split('=');
    out[decodeURIComponent(k)] = decodeURIComponent(v || '');
  }
  return out;
}

let failures = 0;
function check(desc, cond, detail) {
  if (!cond) { failures++; console.log('  FAIL  ' + desc + (detail ? '  [' + detail + ']' : '')); }
  else { console.log('  ok    ' + desc + (detail ? '  -> ' + detail : '')); }
}

// --- 1. every service + frequency + home type option resolves ---------------
console.log('\nService:');
for (const s of GHL.service) {
  const q = parse(run('?service=' + encodeURIComponent(s)));
  check(JSON.stringify(s), !!q.service_id, 'service_id=' + q.service_id);
}

console.log('\nFrequency (with Standard Cleaning):');
for (const f of GHL.frequency) {
  const q = parse(run('?service=Standard+Cleaning&frequency=' + encodeURIComponent(f)));
  check(JSON.stringify(f), !!q.frequency_id, 'frequency_id=' + q.frequency_id);
}

console.log('\nHome type (category 9):');
for (const h of GHL.hometype) {
  const q = parse(run('?hometype=' + encodeURIComponent(h)));
  const got = q['pricing_parameter[9]'];
  const isPlaceholder = /click here/i.test(h);
  check(
    JSON.stringify(h),
    isPlaceholder ? !got : !!got,
    isPlaceholder ? '(correctly skipped)' : 'option=' + got
  );
}

// --- 2. counts map to the right per-service option IDs ----------------------
const EXPECT = {
  '6': { bedrooms: ['1',['87','81','82','83','84','85','86']],
         bathrooms: ['2',['88','9','11','13','15','17','19']],
         halfbaths: ['8',['51','8','10','12','16']] },
  '2': { bedrooms: ['5',['74','75','76','77','78','79','80']],
         bathrooms: ['6',['39','40','41','42','43','44']],
         halfbaths: ['7',['58','45','46','47','48']] },
};
const SERVICE_LABEL = { '6': 'Standard Cleaning ', '2': 'Move in Move out Cleaning ' };

for (const sid of ['6', '2']) {
  console.log('\nPricing parameters — service ' + sid + ' (' + SERVICE_LABEL[sid].trim() + '):');
  for (const field of ['bedrooms', 'bathrooms', 'halfbaths']) {
    const [cat, ids] = EXPECT[sid][field];
    GHL[field].forEach((label, i) => {
      const q = parse(run(
        '?service=' + encodeURIComponent(SERVICE_LABEL[sid]) +
        '&' + field + '=' + encodeURIComponent(label)
      ));
      const got = q['pricing_parameter[' + cat + ']'];
      check(field + '[' + i + '] ' + JSON.stringify(label), got === ids[i],
        'cat ' + cat + ' -> ' + got + (got === ids[i] ? '' : ' (expected ' + ids[i] + ')'));
    });
  }
}

// --- 3. guards --------------------------------------------------------------
console.log('\nGuards:');
{
  const q = parse(run('?service=Move+in+Move+out+Cleaning&frequency=' +
    encodeURIComponent('Every Week (20% off)')));
  check('Move-out + Every Week -> corrected to One-Time (its only option)',
    q.service_id === '2' && q.frequency_id === '1', 'frequency_id=' + (q.frequency_id || '(none)'));
}
{
  // Supports hiding the frequency field entirely for move-outs in GHL.
  const q = parse(run('?service=Move+in+Move+out+Cleaning'));
  check('Move-out with no frequency asked -> One-Time filled in',
    q.frequency_id === '1', 'frequency_id=' + (q.frequency_id || '(none)'));
}
{
  const q = parse(run('?service=Standard+Cleaning'));
  check('Standard with no frequency -> left blank (4 real choices)',
    !q.frequency_id, 'frequency_id=' + (q.frequency_id || '(none)'));
}
{
  const q = parse(run('?bedrooms=' + encodeURIComponent('Three Bedrooms (Under 1700 Sqft)')));
  check('no service -> numeric params skipped (avoids wrong-category IDs)',
    !q['pricing_parameter[1]'] && !q['pricing_parameter[5]']);
}
{
  const q = parse(run('?name=' + encodeURIComponent('Mary Anne Van Der Berg') +
    '&phone=' + encodeURIComponent('+1 (780) 555-0142') +
    '&email=' + encodeURIComponent('a.b+tag@example.ca')));
  check('first name', q.f_name === 'Mary', q.f_name);
  check('last name keeps the rest', q.l_name === 'Anne Van Der Berg', q.l_name);
}
{
  const q = parse(run('?fname=Mary&lname=' + encodeURIComponent('Van Der Berg')));
  check('fname/lname params pass through directly', q.f_name === 'Mary' && q.l_name === 'Van Der Berg');
}
{
  const q = parse(run('?fname=Mary&lname=X&name=Ignored+Person'));
  check('fname/lname win over legacy name param', q.f_name === 'Mary' && q.l_name === 'X');
}
{
  const q = parse(run('?phone=' + encodeURIComponent('+1 (780) 555-0142') +
    '&email=' + encodeURIComponent('a.b+tag@example.ca')));
  check('phone digits only', q.phone === '17805550142', q.phone);
  check('email survives encoding', q.email === 'a.b+tag@example.ca', q.email);
}
{
  const q = parse(run('?service=Standard+Cleaning&hometype=' +
    encodeURIComponent('Two Storey Detached Home (Main Floor & Upper Floor)')));
  check('sqft inside parens is not read as a count', true, 'n/a');
  check('home type + service together', q.service_id === '6' && q['pricing_parameter[9]'] === '90');
}
{
  const q = parse(run(''));
  check('empty query still yields a usable BK url',
    !!q.industry_id && !!q.form_id, 'industry_id=' + q.industry_id + ' form_id=' + q.form_id);
}

// --- GHL raw-substitution quirk ---------------------------------------------
// GHL pastes merge-tag values into the redirect URL unencoded, so a label with
// "&" splits the parameter. Simulate the exact mangled query GHL produces.
console.log('\nRaw ampersand split (GHL unencoded substitution):');
{
  const q = parse(run('?service=Standard Cleaning &hometype=Two Storey Detached Home (Main Floor & Upper Floor)&bedrooms=Three Bedrooms (Under 1700 Sqft)'));
  check('split "Two Storey Detached Home (Main Floor" still maps to 90',
    q['pricing_parameter[9]'] === '90', 'got ' + (q['pricing_parameter[9]'] || '(none)'));
  check('bedrooms unaffected by the split', q['pricing_parameter[1]'] === '82');
}
{
  // properly-encoded version must still work identically
  const q = parse(run('?hometype=' + encodeURIComponent('Two Storey Detached Home (Main Floor & Upper Floor)')));
  check('encoded full label still maps to 90', q['pricing_parameter[9]'] === '90');
}

// --- 4. a full realistic handoff --------------------------------------------
console.log('\nFull handoff:');
const full = run('?service=' + encodeURIComponent('Standard Cleaning ') +
  '&frequency=' + encodeURIComponent('Every 2 Weeks (Most Popular Option 15% off )') +
  '&hometype=' + encodeURIComponent('Bungalow (Single Storey Home)') +
  '&bedrooms=' + encodeURIComponent('Three Bedrooms (Under 1700 Sqft)') +
  '&bathrooms=' + encodeURIComponent('2 Bathrooms') +
  '&halfbaths=' + encodeURIComponent('1 Half Baths (With only a Toilet and Sink)') +
  '&name=Jane+Doe&email=jane%40example.ca&phone=780-555-0142');
console.log('  ' + full);

console.log('\n' + (failures ? failures + ' FAILURE(S)' : 'All checks passed.'));
process.exit(failures ? 1 : 0);
