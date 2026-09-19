/**
 * V8 explicit compile hint on the entry chunk (Chrome 136+, v8.dev/blog/explicit-compile-hints).
 *
 * `//# allFunctionsCalledOnLoad` as a file's first line tells V8 to compile every
 * function in it eagerly, on a background thread, instead of lazily on the main
 * thread the first time each one runs. The entry chunk is React DOM, the router,
 * the header and the footer: nearly all of it runs on every page load, which is
 * the case the hint is for. Other browsers ignore the comment.
 *
 * Measured 2026-09-18 (Lighthouse 4x CPU, HTTP/2, /locations/eastwood-edmonton/,
 * two rounds of four runs each way): the entry's main-thread time fell from
 * 185/181 ms to 125/131 ms; FCP, LCP and TBT (0) unchanged. On the homepage under
 * simulated throttling: 129/126 ms to 95/108 ms.
 *
 * It is added in generateBundle, after esbuild has minified the chunk, because the
 * minifier drops comments (evanw/esbuild#4247). Only the entry gets it: route chunks
 * load on demand and are only partly used, so compiling all of them eagerly would
 * cost time and memory for nothing. The chunk's file hash predates the comment; the
 * comment is constant, so the name still changes exactly when the code does.
 */
export const COMPILE_HINT = "//# allFunctionsCalledOnLoad\n";

export function compileHints() {
  return {
    name: "duty:compile-hints",
    apply: "build",
    // order "post": Vite's own generateBundle (vite:build-import-analysis) puts the
    // __vite__mapDeps preamble at the top of the entry, and it runs after any user
    // plugin, even an enforce: "post" one. The hint must land above that preamble.
    generateBundle: {
      order: "post",
      handler(_options, bundle) {
        for (const chunk of Object.values(bundle)) {
          if (chunk.type === "chunk" && chunk.isEntry && !chunk.code.startsWith(COMPILE_HINT)) {
            chunk.code = COMPILE_HINT + chunk.code;
          }
        }
      },
    },
  };
}
