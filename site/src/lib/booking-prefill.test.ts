import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
const source = readFileSync(new URL("../../../bk-prefill-v2.js", import.meta.url), "utf8");

// Small DOM fixture for the standalone merchant script. Live BK verification
// is separately required: these tests do not imitate Angular's internal model.
class Element {
  tagName: string; name = ""; placeholder = ""; value = ""; disabled = false; readOnly = false;
  options: { text: string; value: string }[] = []; style = {}; attrs: Record<string, string> = {};
  children: Element[] = []; events: string[] = []; hidden = false; textContent = ""; id = "";
  scrolls: { block?: string; behavior?: string }[] = [];
  className = ""; rect = { top: 0, bottom: 0, height: 0 };
  listeners: Record<string, (event: { type?: string; isTrusted?: boolean; target?: Element }) => void> = {};
  closest: (selector: string) => Element | null = () => null;
  contains(_other: Element) { return false; }
  constructor(tag = "input") { this.tagName = tag.toUpperCase(); }
  getClientRects() { return [1]; }
  getAttribute(key: string) { return this.attrs[key] ?? null; }
  setAttribute(key: string, value: string) { this.attrs[key] = value; }
  appendChild(el: Element) { this.children.push(el); }
  insertBefore(el: Element) { this.children.unshift(el); }
  addEventListener(name: string, listener: (event: { type?: string; isTrusted?: boolean; target?: Element }) => void) { this.listeners[name] = listener; }
  dispatchEvent(event: { type: string }) { this.events.push(event.type); }
  scrollIntoView(options: { block?: string; behavior?: string }) { this.scrolls.push(options); }
  getBoundingClientRect() { return this.rect; }
}
/** `viewport` switches on layout: window height, scrollTo and computed position. */
function fixture(fields: Record<string, string>, controls: Element[], options: { desktop?: boolean; viewport?: number } = {}) {
  let tick = () => {}; let now = 0;
  const listeners: Record<string, (event: { type?: string; isTrusted?: boolean; target?: Element }) => void> = {};
  const body = new Element("body");
  const document = {
    body, activeElement: null as Element | null,
    querySelectorAll: (selector: string) => controls.filter(el => selector.split(",").some(part => {
      const tag = part.trim();
      return tag.startsWith(".") ? el.className.split(" ").includes(tag.slice(1)) : el.tagName.toLowerCase() === tag;
    })),
    querySelector: () => null,
    getElementById: (id: string) => controls.find(el => el.id === id) ?? null,
    createElement: (tag: string) => new Element(tag),
    addEventListener: (name: string, callback: (event: { type?: string; isTrusted?: boolean; target?: Element }) => void) => { listeners[name] = callback; },
  };
  const scrolledTo: { top: number; behavior: string }[] = [];
  const window = {
    addEventListener() {},
    matchMedia: (query: string) => ({ matches: query.includes("min-width") ? !!options.desktop : false }),
    ...(options.viewport ? {
      innerHeight: options.viewport, pageYOffset: 0,
      scrollTo: (target: { top: number; behavior: string }) => { scrolledTo.push(target); },
      getComputedStyle: (el: Element) => ({ position: /tjs-/.test(el.className) ? "fixed" : "static" }),
    } : {}),
  };
  runInNewContext(source, {
    window, document, location: { pathname: "/booknow", search: "?" + new URLSearchParams(fields), hash: "" },
    URLSearchParams, performance: { getEntriesByType: () => [] },
    sessionStorage: { getItem: () => null, removeItem() {} },
    Date: { now: () => now }, setInterval: (callback: () => void) => { tick = callback; return 1; }, clearInterval() {},
    HTMLInputElement: Element, HTMLSelectElement: Element, HTMLTextAreaElement: Element,
    Event: class { type: string; constructor(type: string) { this.type = type; } },
  });
  return { body, document, listeners, tick: (ms = 400) => { now += ms; tick(); }, controls, scrolledTo };
}
function input(placeholder: string, value = "") { const el = new Element(); el.placeholder = placeholder; el.value = value; return el; }
function select(name: string, labels: string[]) { const el = new Element("select"); el.name = name; el.options = ["", ...labels].map(text => ({ text, value: text })); return el; }

describe("BookingKoala companion receiver", () => {
  it.each([
    "7806915060", "780-691-5060", "780 691 5060", "(780) 691-5060",
    "+1 780-691-5060", "1 (780) 691 5060", "780.691.5060",
  ])("fills the ten-digit phone field from %s", (phone) => {
    const el = input("Phone No.");
    const state = fixture({ phone }, [el]);
    expect(el.value).toBe("7806915060");
    state.tick(); state.tick();
    expect(state.body.children[0].attrs["data-dc-prefill"]).toBe("filled");
  });
  it("does not put an invalid-length phone into BookingKoala's mask", () => {
    const el = input("Phone No.");
    fixture({ phone: "780-691-5060 ext 23" }, [el]);
    expect(el.value).toBe("");
  });
  it("fills text and native dropdowns and requires two stable readbacks", () => {
    const zip = input("Postal code");
    const entry = select("how_do_we_enter_the_home?", ["Someone will be home", "Other (tell us in the notes below)"]);
    const state = fixture({ dc_zip: "T5J 0N3", dc_entry: "home" }, [zip, entry]);
    expect(zip.value).toBe("T5J 0N3"); expect(entry.value).toBe("Someone will be home");
    expect(zip.events).toEqual(["input", "keyup", "change", "blur"]);
    expect(state.body.children[0].attrs["data-dc-prefill"]).toBe("loading");
    state.tick(); state.tick();
    expect(state.body.children[0].attrs["data-dc-prefill"]).toBe("filled");
  });
  it("preserves existing data and never overwrites a customer's later edit", () => {
    const city = input("City", "Customer city"), zip = input("Postal code");
    const state = fixture({ dc_city: "Edmonton", dc_zip: "T5J 0N3" }, [city, zip]);
    expect(city.value).toBe("Customer city");
    zip.value = "T4N 1S4";
    state.listeners.input({ isTrusted: true, target: zip }); state.tick();
    expect(zip.value).toBe("T4N 1S4");
    expect(state.body.children[0].attrs["data-dc-prefill"]).toBe("review");
    const address = input("Type Address");
    const autofill = fixture({ dc_addr: "Original" }, [address]);
    address.value = "Customer correction";
    autofill.listeners.input({ isTrusted: false, target: address });
    autofill.tick();
    expect(address.value).toBe("Customer correction");
  });
  it("fills late-mounted controls after 30 seconds and repairs a bounded rerender", () => {
    const controls: Element[] = []; const state = fixture({ dc_addr: "123 Test Street" }, controls);
    state.tick(31000); expect(state.body.children[0].attrs["data-dc-prefill"]).toBe("partial");
    const address = input("Type Address"); controls.push(address); state.tick();
    expect(address.value).toBe("123 Test Street");
    controls[0] = input("Type Address"); state.tick(); expect(controls[0].value).toBe("123 Test Street");
    // A plain address string is intentionally not treated as confirmed until
    // BookingKoala's own Google suggestion has been selected.
    state.tick(); state.tick(); expect(state.body.children[0].attrs["data-dc-prefill"]).toBe("address-confirmation");
  });
  it("maps lockbox to Other with explicit notes and supports every flexibility value", () => {
    for (const [value, label] of Object.entries({ both: "Yes - Date & Time is flexible (Specify flexibility in the comment section below)", time: "Yes - Only time is flexible    (Specify flexible times in the comment section below)", date: "Yes - Only date is flexible    (Specify flexible times in the comment section below)", none: "NO - Not Flexible At All" })) {
      const entry = select("how_do_we_enter_the_home?", ["Someone will be home", "Key will be in the mailbox", "Other (tell us in the notes below)"]);
      const flex = select("is_your_date/time_flexible?", [label]);
      const notes = new Element("textarea"); notes.placeholder = "Please write how we will get into your home";
      fixture({ dc_entry: "lockbox", dc_flex: value }, [entry, flex, notes]);
      expect(entry.value).toBe("Other (tell us in the notes below)");
      expect(notes.value).toBe("Entry: Key in a lockbox."); expect(flex.value).toBe(label);
    }
  });
  it("rejects ambiguous fields and leaves payment and submission untouched", () => {
    const a = input("City"), b = input("City"), card = input("Card number");
    const state = fixture({ dc_city: "Edmonton", card_number: "123" }, [a, b, card]);
    state.tick(13000);
    expect([a.value,b.value,card.value]).toEqual(["","",""]);
    expect(source).not.toMatch(/\.submit\(|requestSubmit|contentWindow|querySelectorAll\(['"]iframe/);
  });
  it("guides a fresh handoff to the date section once without stealing an active visit", () => {
    const zip = input("Postal code");
    const date = input("Select a date"); date.disabled = true;
    let dateOpens = 0;
    Object.assign(date, { parentElement: { click: () => { dateOpens += 1; } } });
    const state = fixture({ dc_zip: "T5J 0N3" }, [zip, date]);
    state.tick(800); expect(date.scrolls).toEqual([]);
    state.tick(400); expect(date.scrolls).toEqual([{ block: "center", behavior: "smooth" }]);
    expect(dateOpens).toBe(1);
    state.tick(1200); expect(date.scrolls).toEqual([
      { block: "center", behavior: "smooth" },
      { block: "center", behavior: "auto" },
    ]);
    state.tick(1600); expect(date.scrolls).toHaveLength(3);
    state.tick(4000); expect(date.scrolls).toHaveLength(3);
    expect(dateOpens).toBe(1);

    const secondDate = input("Select a date"); secondDate.disabled = true;
    const active = fixture({ dc_zip: "T5J 0N3" }, [input("Postal code"), secondDate]);
    active.listeners.pointerdown({}); active.tick(1600);
    expect(secondDate.scrolls).toEqual([]);
  });
  it("keeps BookingKoala's address confirmation visible before opening availability", () => {
    const address = input("Type Address");
    const date = input("Select a date"); date.disabled = true;
    let dateOpens = 0;
    Object.assign(date, { parentElement: { click: () => { dateOpens += 1; } } });
    const state = fixture({ dc_addr: "123 Test Street" }, [address, date]);
    state.tick(5000);
    expect(state.body.children[0].attrs["data-dc-prefill"]).toBe("address-confirmation");
    expect(date.scrolls).toEqual([]);
    expect(dateOpens).toBe(0);
  });
  it("guides live availability to Address Details, then a confirmed native address to payment", () => {
    const date = input("Select a date", "09/21/2026");
    const time = new Element("button"); time.id = "dropdownMenuButton"; time.textContent = "09:00 AM";
    const address = input("Type Address", "123 Test Street");
    const city = input("City", "Edmonton"), province = input("Province", "Alberta"), zip = input("Postal code", "T5J 0N3");
    const addressHeading = new Element("h3"); addressHeading.textContent = "Address Details";
    const paymentHeading = new Element("h3"); paymentHeading.textContent = "Payment Information";
    const state = fixture({ f_name: "Jamie" }, [date, time, address, city, province, zip, addressHeading, paymentHeading]);
    state.tick();
    expect(addressHeading.scrolls).toEqual([{ block: "start", behavior: "smooth" }]);
    const suggestion = new Element("li"); suggestion.textContent = "123 Test Street, Edmonton, Alberta, T5J 0N3";
    suggestion.closest = selector => selector === "ul.list-group li" ? suggestion : null;
    state.listeners.click({ target: suggestion }); state.tick(800);
    expect(paymentHeading.scrolls).toEqual([{ block: "start", behavior: "smooth" }]);
    state.tick(800);
    expect(paymentHeading.scrolls).toHaveLength(1);
  });
  it("keeps the desktop handoff slightly above the top so Address Details stays in view", () => {
    const date = input("Select a date", "09/21/2026");
    const time = new Element("button"); time.id = "dropdownMenuButton"; time.textContent = "09:00 AM";
    const addressHeading = new Element("h3"); addressHeading.textContent = "Address Details";
    const state = fixture({ f_name: "Jamie" }, [date, time, addressHeading], { desktop: true });
    state.tick();
    expect(addressHeading.style).toMatchObject({ scrollMarginTop: "120px" });
    expect(addressHeading.scrolls).toEqual([{ block: "start", behavior: "smooth" }]);
  });

  it("tells only a visitor whose details arrived that they carried over", () => {
    const hero = new Element("h1"); hero.textContent = "Book your clean";
    const sub = new Element("p"); sub.textContent = "Choose a live date and arrival time. Takes about a minute.";
    const state = fixture({ f_name: "Jamie" }, [hero, sub]);
    state.tick();
    expect(hero.textContent).toBe("Here’s your price — pick a date to lock it in");
    expect(sub.textContent).toBe("Your details carried over. Takes about a minute.");
    const directHero = new Element("h1"); directHero.textContent = "Book your clean";
    const direct = fixture({}, [directHero]);
    direct.tick();
    expect(directHero.textContent).toBe("Book your clean");
  });

  // Page positions measured on the live form, 2026-09-21 (desktop 1440 wide,
  // phone 375x812). The live Address Details heading carries its subtitle.
  function liveForm(layout: { address: number; payment: number; bookBottom: number; bar?: { top: number; className: string } }) {
    const date = input("Select a date", "09/21/2026");
    const time = new Element("button"); time.id = "dropdownMenuButton"; time.textContent = "09:00 AM";
    const address = input("Type Address", "123 Test Street");
    const city = input("City", "Edmonton"), province = input("Province", "Alberta"), zip = input("Postal code", "T5J 0N3");
    const addressHeading = new Element("h3"); addressHeading.textContent = "Address Details Where would you like us to clean?";
    addressHeading.rect = { top: layout.address, bottom: layout.address + 74, height: 74 };
    const paymentHeading = new Element("h3"); paymentHeading.textContent = "Payment Information";
    paymentHeading.rect = { top: layout.payment, bottom: layout.payment + 29, height: 29 };
    const book = new Element("button"); book.textContent = "Book My Clean →";
    book.rect = { top: layout.bookBottom - 62, bottom: layout.bookBottom, height: 62 };
    const controls = [date, time, address, city, province, zip, addressHeading, paymentHeading, book];
    if (layout.bar) {
      const bar = new Element("div"); bar.className = layout.bar.className;
      bar.rect = { top: layout.bar.top, bottom: layout.bar.top + 99, height: 99 };
      controls.push(bar);
    }
    const confirmAddress = (state: ReturnType<typeof fixture>) => {
      const suggestion = new Element("li"); suggestion.textContent = "123 Test Street, Edmonton, Alberta, T5J 0N3";
      suggestion.closest = selector => selector === "ul.list-group li" ? suggestion : null;
      state.listeners.click({ target: suggestion }); state.tick(800);
    };
    return { controls, addressHeading, paymentHeading, book, confirmAddress };
  }
  const desktopForm = { address: 3565, payment: 4182, bookBottom: 4705 };

  it("on desktop shows the whole Address Details heading after the arrival time, and Book My Clean too on a tall screen", () => {
    const form = liveForm(desktopForm);
    const state = fixture({ f_name: "Jamie" }, form.controls, { desktop: true, viewport: 900 });
    state.tick();
    expect(state.scrolledTo).toEqual([{ top: 3565 - 24, behavior: "smooth" }]);
    expect(form.addressHeading.scrolls).toEqual([]);
    const tall = liveForm(desktopForm);
    const tallState = fixture({ f_name: "Jamie" }, tall.controls, { desktop: true, viewport: 1300 });
    tallState.tick();
    expect(tallState.scrolledTo).toEqual([{ top: 3565 - 120, behavior: "smooth" }]);
  });

  it("on desktop keeps Book My Clean visible after the address and shows as much of Address Details as fits", () => {
    const form = liveForm(desktopForm);
    const state = fixture({ f_name: "Jamie" }, form.controls, { desktop: true, viewport: 900 });
    state.tick(); form.confirmAddress(state);
    // Old behaviour stopped at the heading-at-120px position (4062), hiding Address Details.
    expect(state.scrolledTo[1]).toEqual({ top: 4705 + 16 - 900, behavior: "smooth" });
    state.tick(800);
    expect(state.scrolledTo).toHaveLength(2);
    // Measured only: the booking button is never focused, clicked or submitted.
    expect(form.book.events).toEqual([]);
  });

  it("keeps the button above BookingKoala's cookie notice", () => {
    const form = liveForm({ ...desktopForm, bar: { top: 826, className: "tjs-cookie-fixed bg-white" } });
    const state = fixture({ f_name: "Jamie" }, form.controls, { desktop: true, viewport: 900 });
    state.tick(); form.confirmAddress(state);
    expect(state.scrolledTo[1].top).toBe(4705 + 16 + 74 - 900);
  });

  it("on a phone puts each heading near the top and lands Book My Clean above the summary bar", () => {
    const form = liveForm({ address: 5530, payment: 6574, bookBottom: 7242, bar: { top: 713, className: "summary-ele tjs-summary-mob" } });
    const state = fixture({ f_name: "Jamie" }, form.controls, { viewport: 812 });
    state.tick();
    expect(state.scrolledTo).toEqual([{ top: 5530 - 24, behavior: "smooth" }]);
    form.confirmAddress(state);
    const top = state.scrolledTo[1].top;
    expect(top).toBe(7242 + 16 + 99 - 812);
    expect(6574 - top).toBeGreaterThanOrEqual(24); // Payment Information still on screen
    expect(form.book.events).toEqual([]);
  });
});
