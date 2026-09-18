import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { imagetools } from "vite-imagetools";

// Responsive image variants at build time (vite-imagetools 9.0.3, the last
// release without a Vite peer floor above 5). An import ending in ?card, ?col
// or ?hero yields a Picture ({ sources: { webp: "… 480w, … 768w" }, img:
// { src, w, h } }) that <ResponsiveImage> turns into srcset/sizes plus width
// and height. WebP only: the sources are already lossy WebP, Lighthouse 13
// scores bytes rather than formats, and a second format would multiply the
// encode time for a generational re-encode. Widths never exceed the source.
// Encodes are cached under node_modules/.cache/imagetools, keyed by source
// bytes and directives, so only new or changed images cost a rebuild.
const IMAGE_PRESETS: Record<string, string> = {
  // Card and gallery images: 132–350 CSS px on phones and in desktop grids,
  // so up to ~700 device px at 2x; 1024 is the source size of most of them.
  card: "w=480;768;1024&format=webp&quality=78&as=picture",
  // The 112-px process thumbnails on the city hubs: 224 at 2x, 336 at 3x.
  // PageSpeed (2026-09-18) flagged the 480 card candidate as 4x too large for them.
  thumb: "w=224;336;480&format=webp&quality=78&as=picture",
  // A single content column: 343 CSS px on phones, up to 896 on desktop.
  col: "w=640;960;1280&format=webp&quality=78&as=picture",
  // Full-bleed heroes and backgrounds. 1440 is for the 1366-px desktop
  // viewport (PageSpeed, 2026-09-18: 1335 CSS px at 1x picked the 1672 master).
  // quality 74, not 78: the re-encoded 1672-px Calgary master came out at 108 KB
  // against the 100 KB per-image budget in page-weight.test.ts.
  hero: "w=640;960;1280;1440;1920&format=webp&quality=74&as=picture",
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    imagetools({
      defaultDirectives: (url) => {
        const preset = [...url.searchParams.keys()].find((k) => k in IMAGE_PRESETS);
        return new URLSearchParams(preset ? IMAGE_PRESETS[preset] : "");
      },
      cache: { dir: "./node_modules/.cache/imagetools", retention: 60 * 60 * 24 * 90 },
    }),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Keep heavy libraries out of the entry chunk so the first paint of the
        // homepage ships less JavaScript. Routes that need them pull their own.
        // No manual chunks. Every named chunk this config ever had let Rollup
        // hoist a shared module into it and then add that chunk to the entry's
        // imports: react-dom rode in the Radix-Select chunk, react/jsx-runtime
        // in the carousel chunk, and a "leaflet" chunk was preloaded by all
        // 209 pages although only the map components import it. Rollup's
        // default splitting does the right thing here: a library lands in the
        // chunk of the route that imports it, and a library several routes
        // share gets a chunk of its own that only those routes import.
        manualChunks: undefined,
        // Rollup's default splitting is right about WHERE a module belongs and
        // wrong about how small a chunk is worth making: the build emitted 83
        // chunks under 1.5 KB — one per lucide icon and one per hashed image
        // URL — so a route paid a request each for a few hundred bytes.
        // Folding anything under 10 KB back into its importer took the build
        // from 315 chunks to 286 and cut a page's requests by a fifth (a town
        // page loads 21 chunks where it loaded 24). It is a request-count fix,
        // not a byte fix: merging can duplicate a module that had several
        // importers, and measured across four pages the transferred total
        // moved between -0.8 and +2.0 KB gzipped.
        experimentalMinChunkSize: 10000,
      },
    },
  },
}));
