/* ---------------------------------------------------------------------------
 * Duty Cleaners — GHL → BookingKoala prefill bridge
 *
 * Lives on https://dutycleaners.ca/quote-redirect/ (a blank page whose only job
 * is to run this script). The GHL form's On Submit → Redirect URL sends the
 * visitor here with their answers as *labels*; this script translates those
 * labels into BookingKoala's internal numeric IDs and forwards to the booking
 * form with everything preselected.
 *
 * DESIGN RULE: prefill must never break the funnel. Any label we can't match is
 * silently dropped (visitor fills that one field themselves), and any
 * unexpected error falls through to a bare BK booking URL.
 *
 * Verified 2026-08-07 against:
 *   BK    — Settings → Industries → Home Cleaning → Form 1
 *   GHL   — form AwJDnvuYtkojIN3aOysC, live widget payload
 * ------------------------------------------------------------------------- */

(function () {
  'use strict';

  var BK_BASE     = 'https://dutycleaners.bookingkoala.com/booknow';
  var INDUSTRY_ID = '1'; // Home Cleaning
  var FORM_ID     = '1'; // Form 1
  var LOCATION_ID = '';  // optional; leave '' to omit

  /* --- Services -----------------------------------------------------------
   * GHL offers exactly two, and both map cleanly. (Note the GHL option strings
   * carry a trailing space — normalize() strips it.)
   * BK's other services — Hourly (17), Re-Clean (4, 5) — are Admin-only and
   * must never be sent from the public form.
   */
  var SERVICE_IDS = {
    'standard cleaning': '6',
    'move in move out cleaning': '2'
  };

  /* --- Frequencies --------------------------------------------------------
   * GHL labels carry discount suffixes — "Every Week (20% off)" — which
   * normalize() strips along with the parentheses.
   * The BK (Hourly) frequencies 65/66/68 belong to the Admin-only Hourly
   * service and are deliberately unmapped.
   */
  var FREQUENCY_IDS = {
    'one time': '1',
    'one-time': '1',
    'every week': '3',
    'weekly': '3',
    'every 2 weeks': '4',
    'bi-weekly': '4',
    'every 4 weeks': '64',
    'monthly': '64'
  };

  // Move In/Move Out is One-Time only in BK; Standard takes all four.
  // GHL offers all four regardless of service, so this pair can arrive invalid.
  var VALID_FREQUENCIES = {
    '6': ['1', '3', '4', '64'],
    '2': ['1']
  };

  /* --- Home type (BK category 9, shared by both services) ------------------
   * GHL's first option is a "Click here" placeholder — deliberately unmapped so
   * it is never sent. GHL has no equivalent of BK's "Basement Suite Only" (56),
   * so that option is unreachable from this funnel.
   */
  var HOME_TYPE_CATEGORY = '9';
  var HOME_TYPE_IDS = {
    'two storey detached home': '90',       // BK: Two Storey House (Main + Upper Floor)
    'two storey townhouse/duplex': '89',    // BK: Two Story Townhouse (Duplex)
    'bungalow': '54',                       // BK: Bungalow (Single Story Home)
    'apartment/condo': '55'                 // BK: Apartment or Condo
  };

  /* --- Bedrooms / bathrooms / half baths ----------------------------------
   * BK keeps SEPARATE categories per service — different category IDs *and*
   * different option IDs. "Three Bedrooms" is 82 on a Standard clean and 76 on
   * a move-out. So the whole map is selected off service_id.
   *
   * Keyed by count; the count is parsed from the GHL label by normalize()
   * + toCount() below.
   */
  var BY_SERVICE = {
    // ---- Standard Cleaning (service_id 6) ----
    '6': {
      bedrooms:  { categoryId: '1', byCount: { 1:'87', 2:'81', 3:'82', 4:'83', 5:'84', 6:'85', 7:'86' } },
      bathrooms: { categoryId: '2', byCount: { 1:'88', 2:'9',  3:'11', 4:'13', 5:'15', 6:'17', 7:'19' } },
      halfbaths: { categoryId: '8', byCount: { 0:'51', 1:'8',  2:'10', 3:'12', 4:'16' } }
    },
    // ---- Move In / Move Out (service_id 2) ----
    '2': {
      bedrooms:  { categoryId: '5', byCount: { 1:'74', 2:'75', 3:'76', 4:'77', 5:'78', 6:'79', 7:'80' } },
      bathrooms: { categoryId: '6', byCount: { 1:'39', 2:'40', 3:'41', 4:'42', 5:'43', 6:'44' } },
      halfbaths: { categoryId: '7', byCount: { 0:'58', 1:'45', 2:'46', 3:'47', 4:'48' } }
    }
  };

  var WORD_NUMBERS = {
    zero: 0, one: 1, two: 2, three: 3, four: 4,
    five: 5, six: 6, seven: 7, eight: 8, nine: 9
  };

  // === END CONFIG ==========================================================

  var params = new URLSearchParams(window.location.search);

  /* Strip parenthetical content, collapse whitespace, lowercase.
   * This is what makes the maps above short and stable:
   *   "Every Week (20% off)"            → "every week"
   *   "Two Storey Townhouse/Duplex "    → "two storey townhouse/duplex"
   *   "One Bedroom (Under 800 Sqft)"    → "one bedroom"
   * That last one matters: the sqft hint lives inside the parens, so removing
   * it first stops the count parser from reading 800 as the bedroom count.
   *
   * The second replace handles a GHL quirk: merge tags are substituted into
   * the redirect URL RAW, so a label containing "&" — "Two Storey Detached
   * Home (Main Floor & Upper Floor)" — is split mid-value by the query-string
   * parser. What arrives is "...(main floor" with an unbalanced paren, which
   * the balanced-parens regex can't remove. Cutting from any stray "(" to the
   * end recovers the matchable prefix.
   */
  function normalize(label) {
    return (label || '')
      .replace(/\([^)]*\)/g, ' ')
      .replace(/\(.*$/, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  function read(key) {
    return normalize(params.get(key));
  }

  // "one bedroom" → 1, "3 bathrooms" → 3, "0 half baths" → 0
  function toCount(label) {
    if (!label) return null;
    var digits = /^\d+/.exec(label);
    if (digits) return parseInt(digits[0], 10);
    var word = /^[a-z]+/.exec(label);
    if (word && word[0] in WORD_NUMBERS) return WORD_NUMBERS[word[0]];
    return null;
  }

  function push(out, key, value) {
    if (value) out.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
  }

  function build() {
    var out = [];

    push(out, 'industry_id', INDUSTRY_ID);
    push(out, 'form_id', FORM_ID);
    push(out, 'location', LOCATION_ID);

    // --- contact -----------------------------------------------------------
    // Read name/email/phone raw — normalize() is for matching labels, not for
    // people's names.
    // GHL's URL sanitizer strips {{contact.full_name}} (invalid tag), so the
    // redirect sends fname/lname from the standard first_name/last_name tags.
    // A single `name` param is still honoured as a fallback.
    var fname = (params.get('fname') || '').trim();
    var lname = (params.get('lname') || '').trim();
    if (fname || lname) {
      push(out, 'f_name', fname);
      push(out, 'l_name', lname);
    } else {
      var name = (params.get('name') || '').trim();
      if (name) {
        var bits = name.split(/\s+/);
        push(out, 'f_name', bits.shift());
        if (bits.length) push(out, 'l_name', bits.join(' '));
      }
    }
    push(out, 'email', (params.get('email') || '').trim());
    push(out, 'phone', (params.get('phone') || '').replace(/\D/g, '')); // digits only
    push(out, 'zipcode', (params.get('zipcode') || '').trim());

    // --- service + frequency ----------------------------------------------
    var serviceId = SERVICE_IDS[read('service')] || '';
    var frequencyId = FREQUENCY_IDS[read('frequency')] || '';

    var allowed = serviceId ? VALID_FREQUENCIES[serviceId] : null;
    if (allowed) {
      // Drop a frequency the chosen service doesn't offer rather than sending a
      // pair BK can't honour (e.g. Move In/Move Out + Every Week).
      if (frequencyId && allowed.indexOf(frequencyId) === -1) frequencyId = '';
      // If the service offers exactly one frequency it isn't a real choice, so
      // fill it in — whether GHL asked the question or not. This is what lets
      // the frequency field be hidden entirely for Move In/Move Out.
      if (!frequencyId && allowed.length === 1) frequencyId = allowed[0];
    }

    push(out, 'service_id', serviceId);
    push(out, 'frequency_id', frequencyId);

    // --- home type (shared category, service-independent) -------------------
    var homeTypeId = HOME_TYPE_IDS[read('hometype')];
    if (homeTypeId) {
      push(out, 'pricing_parameter[' + HOME_TYPE_CATEGORY + ']', homeTypeId);
    }

    // --- bedrooms / bathrooms / half baths (service-dependent) --------------
    // Without a known service we can't tell which category set applies, and a
    // guess would send IDs belonging to the wrong category. Skip instead.
    var set = BY_SERVICE[serviceId];
    if (set) {
      ['bedrooms', 'bathrooms', 'halfbaths'].forEach(function (field) {
        var cfg = set[field];
        var n = toCount(read(field));
        if (n === null) return;
        var optionId = cfg.byCount[n];
        if (!optionId) return; // outside this service's range
        push(out, 'pricing_parameter[' + cfg.categoryId + ']', optionId);
      });
    }

    return BK_BASE + (out.length ? '?' + out.join('&') : '');
  }

  var target;
  try {
    target = build();
  } catch (e) {
    target = BK_BASE; // prefill failed — still get them to the booking form
  }
  window.location.replace(target);
})();
