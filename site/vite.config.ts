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
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Keep heavy libraries out of the entry chunk so the first paint of the
        // homepage ships less JavaScript. Routes that need them pull their own.
        manualChunks(id: string) {
          if (!id.includes("node_modules")) return;
          if (id.includes("recharts") || id.includes("d3-")) return "charts";
          if (id.includes("embla-carousel")) return "carousel";
          // Radix Select is the heaviest piece of the set — it drags in Portal,
          // FocusScope, DismissableLayer and the positioning engine — and only
          // /contact/ and /join-the-team/ use it. Lumped in with the rest it rode
          // along on all 209 pages, because accordion and slot put the shared
          // chunk in the entry graph. Split so the 207 pages that never render a
          // select stop paying for one.
          if (id.includes("@radix-ui/react-select")) return "radix-select";
          if (id.includes("@radix-ui")) return "radix";
          if (id.includes("react-hook-form") || id.includes("zod")) return "forms";
          if (id.includes("leaflet")) return "leaflet";
          // NOTE: react / react-dom / scheduler are deliberately NOT split into
          // their own chunk. Doing so broke every route at runtime (the vendor
          // chunk initialised before React was defined, so the app rendered a
          // blank page and prerendering failed on all 208 routes). The entry
          // chunk keeps them.
          if (id.includes("@tanstack")) return "query";
          if (id.includes("react-helmet")) return "helmet";
        },
      },
    },
  },
}));
