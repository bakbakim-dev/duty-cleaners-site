import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
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
