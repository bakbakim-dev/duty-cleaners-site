import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { COMPILE_HINT, compileHints } from "../../scripts/compile-hints.mjs";

/**
 * The entry chunk carries V8's `//# allFunctionsCalledOnLoad` hint as its first
 * line (scripts/compile-hints.mjs), which cut its main-thread time by about 30%
 * under 4x CPU throttling (measured 2026-09-18). The hint only works at the very
 * top of the file, and the minifier strips comments, so a plugin reordering or an
 * esbuild upgrade could drop it without any test noticing. Route chunks must not
 * carry it: they are only partly used, and eager compilation would waste work.
 */
const DIST = join(__dirname, "..", "..", "dist");

describe("the entry chunk is compiled eagerly", () => {
  it("the plugin prepends the hint to the entry chunk and to nothing else", () => {
    const bundle: Record<string, { type: string; isEntry?: boolean; code?: string }> = {
      "index.js": { type: "chunk", isEntry: true, code: "const a=1;" },
      "route.js": { type: "chunk", isEntry: false, code: "const b=2;" },
      "style.css": { type: "asset" },
    };
    const hook = (compileHints() as unknown as { generateBundle: { order: string; handler: (o: unknown, b: typeof bundle) => void } }).generateBundle;
    expect(hook.order, "the hint must be added after Vite's own preamble").toBe("post");
    hook.handler({}, bundle);
    hook.handler({}, bundle);
    expect(bundle["index.js"].code, "entry chunk").toBe(COMPILE_HINT + "const a=1;");
    expect(bundle["route.js"].code, "route chunk").toBe("const b=2;");

    const shell = join(DIST, "index.html");
    if (!existsSync(shell)) return;
    const src = /<script type="module"[^>]*src="\/(assets\/index-[^"]+\.js)"/.exec(readFileSync(shell, "utf-8"))?.[1];
    expect(src, "dist/index.html names no entry script").toBeTruthy();
    expect(readFileSync(join(DIST, src!), "utf-8").startsWith(COMPILE_HINT), `${src} lost its first-line compile hint`).toBe(true);
  });
});
