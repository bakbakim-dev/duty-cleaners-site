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
