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
    type Hook<A extends unknown[], R> = { order: string; handler: (...a: A) => R };
    const plugin = compileHints() as unknown as {
      renderChunk: Hook<[string, { isEntry: boolean }], { code: string } | null>;
      generateBundle: Hook<[unknown, typeof bundle], void>;
    };
    expect(plugin.renderChunk.order, "the hint must be added after minification").toBe("post");
    expect(plugin.generateBundle.order, "the hint must end up above Vite's own preamble").toBe("post");

    // Before hashing: the entry gains the hint (so its file name changes), a route chunk does not.
    expect(plugin.renderChunk.handler("const a=1;", { isEntry: true })?.code, "entry at render").toBe(COMPILE_HINT + "const a=1;");
    expect(plugin.renderChunk.handler("const b=2;", { isEntry: false }), "route chunk at render").toBeNull();

    // After Vite's preamble lands on top, the hint moves back to the first line, once.
    bundle["index.js"].code = "const __vite__mapDeps=0;" + COMPILE_HINT + "const a=1;";
    plugin.generateBundle.handler({}, bundle);
    plugin.generateBundle.handler({}, bundle);
    expect(bundle["index.js"].code, "entry chunk").toBe(COMPILE_HINT + "const __vite__mapDeps=0;const a=1;");
    expect(bundle["route.js"].code, "route chunk").toBe("const b=2;");

    const shell = join(DIST, "index.html");
    if (!existsSync(shell)) return;
    const src = /<script type="module"[^>]*src="\/(assets\/index-[^"]+\.js)"/.exec(readFileSync(shell, "utf-8"))?.[1];
    expect(src, "dist/index.html names no entry script").toBeTruthy();
    expect(readFileSync(join(DIST, src!), "utf-8").startsWith(COMPILE_HINT), `${src} lost its first-line compile hint`).toBe(true);
  });
});
