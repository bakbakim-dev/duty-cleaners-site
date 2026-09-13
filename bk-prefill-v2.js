(function () {
  'use strict';
  if (!/^\/booknow\/?$/.test(location.pathname) || window.__dcPrefillV2) return;
  window.__dcPrefillV2 = true;
  // Staging receiver. Change only after the same endpoint is live on the final domain.
  var ENDPOINT = 'https://mikaily131.sg-host.com/api/booking-handoff.php';
  var KEYS = ['f_name','l_name','email','phone','dc_entry','dc_clean','dc_park','dc_flex','dc_notes','dc_addr','dc_apt','dc_city','dc_prov','dc_zip'];
  var q = new URLSearchParams(location.search), fields = {}, states = {}, edited = {}, busy = false;
  var began = Date.now(), timer, banner, text, retry, lastMessage = '', applying = false;
  var duration = 20 * 60 * 1000, cacheKey = 'dc.encrypted-handoff.v2';
  var token = new URLSearchParams(location.hash.slice(1)).get('dc_handoff');
  KEYS.forEach(function (key) { if (q.has(key)) fields[key] = q.get(key); });
  if (!fields.dc_zip && q.has('zipcode')) fields.dc_zip = q.get('zipcode');
  // Store ciphertext only. Restore it on reload/back, never on a fresh visit.
  try {
    if (token) {
      sessionStorage.setItem(cacheKey, JSON.stringify({ token: token, path: location.pathname + location.search, expires: Date.now() + duration }));
      history.replaceState(history.state, '', location.pathname + location.search);
    } else {
      var navigation = performance.getEntriesByType('navigation')[0];
      var cached = JSON.parse(sessionStorage.getItem(cacheKey) || 'null');
      if (cached && cached.expires > Date.now() && cached.path === location.pathname + location.search && navigation && /^(reload|back_forward)$/.test(navigation.type)) token = cached.token;
      else sessionStorage.removeItem(cacheKey);
    }
  } catch (ignore) { /* Restricted storage: the encrypted fragment still works. */ }
  if (!token && !Object.keys(fields).length) return;
  function normal(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }
  function canonical(key, value) {
    if (key === 'phone') return String(value || '').replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
    if (key === 'dc_zip') return normal(value).replace(/\s/g, '').toUpperCase();
    return normal(value);
  }
  function visible(el) { return el && el.getClientRects().length && !el.disabled && !el.readOnly; }
  var selects = {
    dc_entry: { name: 'how_do_we_enter_the_home?', sig: /someone will be home/i, values: {
      home: /^someone will be home$/i, mailbox: /^key will be in the mailbox$/i,
      lockbox: /^other\b/i, code: /^access code\b/i, other: /^other\b/i } },
    dc_clean: { name: 'on_a_scale_of_1-5,_how_clean_is_your_house?', sig: /almost spotless/i, values: {
      '1': /^1\s*-\s*almost spotless$/i, '2': /^2\s*-\s*mostly clean$/i,
      '3': /^3\s*-\s*decently clean$/i, '4': /^4\s*-\s*needs attention$/i, '5': /^5\s*-\s*very dirty$/i } },
    dc_park: { name: 'where_do_we_park?', sig: /street parking/i, values: {
      street: /^street parking$/i, visitor: /^visitor parking\b/i, driveway: /^driveway$/i, paid: /^paid parking nearby\b/i } },
    dc_flex: { name: 'is_your_date/time_flexible?', sig: /not flexible at all/i, values: {
      both: /^yes\s*-\s*date\s*&\s*time is flexible\b/i, time: /^yes\s*-\s*only time is flexible\b/i,
      date: /^yes\s*-\s*only date is flexible\b/i, none: /^no\s*-\s*not flexible at all$/i } }
  };
  var placeholders = {
    f_name: /^ex:\s*james$/i, l_name: /^ex:\s*lee$/i, email: /^ex:\s*example@xyz\.com$/i,
    phone: /^phone no\.?$/i, dc_addr: /^type address$/i, dc_apt: /^#?\s*condo or apt number$/i,
    dc_city: /^city$/i, dc_prov: /^province$/i, dc_zip: /^postal code$/i
  };
  function control(key) {
    var list, spec = selects[key];
    if (spec) {
      list = Array.prototype.slice.call(document.querySelectorAll('select')).filter(visible);
      var exact = list.filter(function (el) { return el.name === spec.name; });
      if (exact.length === 1) return exact[0];
      list = list.filter(function (el) { return Array.prototype.some.call(el.options, function (o) { return spec.sig.test(normal(o.text)); }); });
    } else if (key === 'dc_notes') {
      list = Array.prototype.slice.call(document.querySelectorAll('textarea')).filter(visible).filter(function (el) {
        return /please write how we will get into your home/i.test(el.placeholder || '') || /special notes/i.test(el.getAttribute('aria-label') || '');
      });
    } else {
      list = Array.prototype.slice.call(document.querySelectorAll('input')).filter(visible).filter(function (el) { return placeholders[key] && placeholders[key].test(el.placeholder || ''); });
    }
    // An ambiguous match must never fill an unrelated address or contact field.
    return list.length === 1 ? list[0] : null;
  }
  function wanted(key, el) {
    if (!selects[key]) return fields[key];
    var pattern = selects[key].values[fields[key]];
    if (!pattern) return null;
    var options = Array.prototype.filter.call(el.options, function (o) { return pattern.test(normal(o.text)); });
    return options.length === 1 ? options[0].value : null;
  }
  function setValue(el, value) {
    var proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    var setter = Object.getOwnPropertyDescriptor(proto, 'value');
    if (setter && setter.set) setter.set.call(el, value); else el.value = value;
    applying = true;
    try {
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      el.dispatchEvent(new Event('blur', { bubbles: true }));
    } finally { applying = false; }
  }
  function ensureBanner() {
    if (banner || !document.body) return;
    banner = document.createElement('section'); banner.id = 'dc-prefill-status';
    banner.setAttribute('aria-label', 'Booking details transfer');
    banner.style.cssText = 'margin:16px auto;padding:16px;max-width:1100px;border:1px solid #b4c5d1;background:#f3f7fa;color:#142b3b;font:16px/1.5 sans-serif;';
    text = document.createElement('p'); text.setAttribute('role', 'status'); text.setAttribute('aria-live', 'polite');
    retry = document.createElement('button'); retry.type = 'button'; retry.textContent = 'Retry transferring missing details';
    retry.style.cssText = 'padding:12px;margin-top:8px;cursor:pointer;';
    retry.addEventListener('click', function () { began = Date.now(); if (token && !Object.keys(fields).length) redeem(); else { Object.keys(states).forEach(function (key) { states[key].attempts = 0; }); tick(); } });
    banner.appendChild(text); banner.appendChild(retry); document.body.insertBefore(banner, document.body.firstChild);
  }
  function show(message, status, allowRetry) {
    ensureBanner(); if (!banner) return;
    if (lastMessage !== message) { text.textContent = message; lastMessage = message; }
    banner.setAttribute('data-dc-prefill', status); retry.hidden = !allowRetry;
  }
  function cleanFields(input) {
    var out = {};
    KEYS.forEach(function (key) { if (typeof input[key] === 'string' && input[key].length <= (key === 'dc_notes' ? 500 : 120) && input[key].trim()) out[key] = input[key].trim(); });
    if (out.dc_entry === 'lockbox' && !/^Entry: Key in a lockbox\./.test(out.dc_notes || '')) {
      var note = ['Entry: Key in a lockbox.', out.dc_notes || ''].filter(Boolean).join('\n');
      if (note.length <= 500) out.dc_notes = note;
      else delete out.dc_entry;
    }
    return out;
  }
  function tick() {
    if (busy || !Object.keys(fields).length) return;
    var pending = [], review = [], verified = [];
    Object.keys(fields).forEach(function (key) {
      var state = states[key] || (states[key] = { attempts: 0, matches: 0 });
      try {
        var el = control(key);
        if (!el) { pending.push(key); state.matches = 0; return; }
        if (edited[key] || document.activeElement === el) { review.push(key); return; }
        var desired = wanted(key, el);
        if (desired === null) { pending.push(key); return; }
        if (canonical(key, el.value) === canonical(key, desired)) {
          state.matches += 1;
          if (state.matches >= 2) verified.push(key); else pending.push(key);
          return;
        }
        state.matches = 0;
        if (!state.attempts && normal(el.value)) { review.push(key); return; }
        if (state.attempts >= 3) { pending.push(key); return; }
        state.attempts += 1; setValue(el, desired); pending.push(key);
      } catch (ignore) { pending.push(key); }
    });
    if (!pending.length && !review.length) show('Your details are filled in below. Review them, choose an available time and add your card before confirming. No booking has been submitted.', 'filled', false);
    else if (review.length) show('We kept the details you entered or already had on this page. Please review them and complete any blank fields before confirming.', 'review', pending.length > 0);
    else if (Date.now() - began > 12000) show('Some details could not be transferred yet. You can retry or complete the blank fields below. Your booking has not been submitted.', 'partial', true);
    else show('Transferring your details to the booking form…', 'loading', false);
    if (banner) banner.setAttribute('data-dc-verified-fields', verified.join(','));
    if (Date.now() - began > duration) stop();
  }
  function stop() { clearInterval(timer); fields = {}; }
  document.addEventListener('input', rememberEdit, true);
  document.addEventListener('change', rememberEdit, true);
  function rememberEdit(event) {
    // Preserve browser autofill, accessibility tools and other integrations too.
    // Ignore only events dispatched by this receiver, not every synthetic event.
    if (applying) return;
    Object.keys(fields).forEach(function (key) { if (control(key) === event.target) edited[key] = true; });
  }
  async function redeem() {
    busy = true; show('Opening your encrypted booking details…', 'loading', false);
    var controller = new AbortController(), timeout = setTimeout(function () { controller.abort(); }, 6000);
    try {
      var response = await fetch(ENDPOINT, { method: 'POST', credentials: 'omit', cache: 'no-store', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'unseal', token: token }), signal: controller.signal });
      if (!response.ok) throw new Error('unavailable');
      var result = await response.json(); fields = cleanFields(result.fields || {});
      if (!Object.keys(fields).length) throw new Error('invalid');
    } catch (ignore) { fields = {}; show('Your secure transfer is unavailable or expired. Go back to your quote to retry, or enter your details below. No booking has been submitted.', 'unavailable', true); }
    finally { clearTimeout(timeout); busy = false; tick(); }
  }
  fields = cleanFields(fields);
  timer = setInterval(tick, 400);
  window.addEventListener('pagehide', stop);
  window.addEventListener('pageshow', function (event) {
    if (!event.persisted) return;
    began = Date.now();
    clearInterval(timer); timer = setInterval(tick, 400);
    if (token) redeem();
    // Legacy query values are intentionally not reapplied on history restore.
    // Native form values and customer edits remain as the browser restored them.
  });
  if (token) { fields = {}; redeem(); } else tick();
})();
