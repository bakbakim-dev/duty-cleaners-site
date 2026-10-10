import { describe, expect, it } from "vitest";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Menu items name their icon in data (`icon: "gift"`) and the class is built at
 * runtime, so the stylesheet must still carry a rule for every name: eight of
 * them were dropped by the CSS build and drew as solid squares (AuditSpur #823).
 */
const ROOT = join(__dirname, "..", "..");
const DIST = join(ROOT, "dist", "assets");
const nav = readFileSync(join(ROOT, "src/components/Navigation.tsx"), "utf8");

describe("menu icons", () => {
  it("the Tailwind build keeps every runtime-named icon rule", () => {
    const config = readFileSync(join(ROOT, "tailwind.config.ts"), "utf8");
    expect(config).toMatch(/safelist: \[\{ pattern: \/\^dc-icon-\/ \}\]/);
  });
  it("every icon a menu item names has a rule in the built stylesheet", () => {
    if (!existsSync(DIST)) return;
    const css = readdirSync(DIST)
      .filter((f) => f.endsWith(".css"))
      .map((f) => readFileSync(join(DIST, f), "utf8"))
      .join("\n");
    const names = [...new Set([...nav.matchAll(/icon: "([a-z-]+)"/g)].map((m) => m[1]))];
    expect(names.length).toBeGreaterThan(5);
    const missing = names.filter((name) => !css.includes(`.dc-icon-${name}{`) && !css.includes(`.dc-icon-${name} {`));
    expect(missing).toEqual([]);
  });
});
