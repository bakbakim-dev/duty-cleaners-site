(function () {
  'use strict';
  // Travel fee by postal code (owner, 2026-09-22). BookingKoala's travel fee is
  // an extra the customer ticked by hand ("Outside Edmonton/Calgary ... Do not
  // select this if you live inside Edmonton/Calgary"), so nearby-town bookings
  // went through without it and Red Deer customers could tick it by mistake.
  // This keeps the box in step with the postal code the customer enters: ticked
  // outside Edmonton, Calgary and Red Deer city limits, unticked inside them,
  // with a note saying which and why. It acts once per postal code, so a
  // customer who changes the box afterwards keeps their choice; the office
  // confirms before the clean. Runs for every /booknow visit, funnel or not.
  if (!/^\/booknow\/?$/.test(location.pathname) || window.__dcTravelFee) return;
  window.__dcTravelFee = true;

  // rules: begin — must agree with postalCodeCityStatus in
  // site/src/lib/booking-redirect.ts (site/src/lib/bk-travel-fee.test.ts).
  var CITY_BY_PREFIX = { T5: 'Edmonton', T6: 'Edmonton', T2: 'Calgary', T3: 'Calgary' };
  var CITY_BY_FSA = { T1Y: 'Calgary', T3Z: null, T4N: 'Red Deer', T4P: 'Red Deer', T4R: 'Red Deer' };
  function travelFeeRule(value) {
    var code = String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!/^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]\d[ABCEGHJKLMNPRSTVWXYZ]\d$/.test(code)) return null;
    // Every Alberta code starts with T; anything else is not ours to price.
    if (code.charAt(0) !== 'T') return null;
    var fsa = code.slice(0, 3);
    var city = Object.prototype.hasOwnProperty.call(CITY_BY_FSA, fsa)
      ? CITY_BY_FSA[fsa]
      : (CITY_BY_PREFIX[code.slice(0, 2)] || null);
    return { fsa: fsa, city: city, outside: city === null };
  }
  // rules: end

  var lastCode = null, note = null;
  function normal(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }
  function postalInput() {
    return document.getElementById('postal_code') ||
      Array.prototype.slice.call(document.querySelectorAll('input')).filter(function (el) {
        return /^postal code$/i.test(normal(el.placeholder));
      })[0] || null;
  }
  function feeBox() {
    var tiles = Array.prototype.slice.call(document.querySelectorAll('.tjs-extra__list'));
    for (var i = 0; i < tiles.length; i++) {
      var label = tiles[i].querySelector('.bk-form-sub-label');
      if (label && /^outside edmonton/i.test(normal(label.textContent)) && /travel fee/i.test(label.textContent)) {
        return tiles[i].querySelector('input[type="checkbox"]');
      }
    }
    return null;
  }
  function say(input, message) {
    if (!message) { if (note && note.parentNode) note.parentNode.removeChild(note); return; }
    if (!note) {
      note = document.createElement('p');
      note.id = 'dc-travel-fee-note';
      note.setAttribute('role', 'status');
      note.style.cssText = 'margin:6px 0 0;font-size:14px;line-height:1.45;color:#142b3b;';
    }
    note.textContent = message;
    var anchor = input.parentElement || input;
    if (note.parentNode !== anchor.parentNode || note.previousSibling !== anchor) {
      anchor.parentNode.insertBefore(note, anchor.nextSibling);
    }
  }
  function check() {
    var input = postalInput();
    if (!input) return;
    var rule = travelFeeRule(input.value);
    var code = rule ? input.value.toUpperCase().replace(/[^A-Z0-9]/g, '') : null;
    if (!rule) { if (lastCode !== null) { lastCode = null; say(input, ''); } return; }
    if (code === lastCode) return;
    var box = feeBox();
    if (!box) return;
    lastCode = code;
    if (rule.outside !== box.checked) box.click();
    if (rule.outside) {
      say(input, 'Travel fee ' + (box.checked ? 'included' : 'not added') + ': ' + rule.fsa +
        ' is outside Edmonton, Calgary and Red Deer city limits. It shows in your booking summary.');
    } else {
      say(input, 'No travel fee: ' + rule.fsa + ' is inside ' + rule.city + ' city limits.');
    }
  }
  setInterval(check, 700);
})();
