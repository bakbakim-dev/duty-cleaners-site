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
  listeners: Record<string, (event: { type?: string; isTrusted?: boolean; target?: Element }) => void> = {};
  constructor(tag = "input") { this.tagName = tag.toUpperCase(); }
  getClientRects() { return [1]; }
  getAttribute(key: string) { return this.attrs[key] ?? null; }
  setAttribute(key: string, value: string) { this.attrs[key] = value; }
  appendChild(el: Element) { this.children.push(el); }
  insertBefore(el: Element) { this.children.unshift(el); }
  addEventListener(name: string, listener: (event: { type?: string; isTrusted?: boolean; target?: Element }) => void) { this.listeners[name] = listener; }
  dispatchEvent(event: { type: string }) { this.events.push(event.type); }
}
function fixture(fields: Record<string, string>, controls: Element[]) {
  let tick = () => {}; let now = 0;
  const listeners: Record<string, (event: { type?: string; isTrusted?: boolean; target?: Element }) => void> = {};
  const body = new Element("body");
  const document = {
    body, activeElement: null as Element | null,
    querySelectorAll: (tag: string) => controls.filter(el => el.tagName.toLowerCase() === tag),
    createElement: (tag: string) => new Element(tag),
    addEventListener: (name: string, callback: (event: { type?: string; isTrusted?: boolean; target?: Element }) => void) => { listeners[name] = callback; },
  };
  const window = { addEventListener() {} };
  runInNewContext(source, {
    window, document, location: { pathname: "/booknow", search: "?" + new URLSearchParams(fields), hash: "" },
    URLSearchParams, performance: { getEntriesByType: () => [] },
    sessionStorage: { getItem: () => null, removeItem() {} },
    Date: { now: () => now }, setInterval: (callback: () => void) => { tick = callback; return 1; }, clearInterval() {},
    HTMLInputElement: Element, HTMLSelectElement: Element, HTMLTextAreaElement: Element,
    Event: class { type: string; constructor(type: string) { this.type = type; } },
  });
  return { body, document, listeners, tick: (ms = 400) => { now += ms; tick(); }, controls };
}
function input(placeholder: string, value = "") { const el = new Element(); el.placeholder = placeholder; el.value = value; return el; }
function select(name: string, labels: string[]) { const el = new Element("select"); el.name = name; el.options = ["", ...labels].map(text => ({ text, value: text })); return el; }

describe("BookingKoala companion receiver", () => {
  it("fills text and native dropdowns and requires two stable readbacks", () => {
    const zip = input("Postal code");
    const entry = select("how_do_we_enter_the_home?", ["Someone will be home", "Other (tell us in the notes below)"]);
    const state = fixture({ dc_zip: "T5J 0N3", dc_entry: "home" }, [zip, entry]);
    expect(zip.value).toBe("T5J 0N3"); expect(entry.value).toBe("Someone will be home");
    expect(zip.events).toEqual(["input", "change", "blur"]);
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
    state.tick(); state.tick(); expect(state.body.children[0].attrs["data-dc-prefill"]).toBe("filled");
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
    expect(source).not.toMatch(/\.submit\(|\.click\(|requestSubmit|contentWindow|querySelectorAll\(['"]iframe/);
  });
});
