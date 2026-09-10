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
        // No manual chunks. Every named chunk this config ever had let Rollup
        // hoist a shared module into it and then add that chunk to the entry's
        // imports: react-dom rode in the Radix-Select chunk, react/jsx-runtime
        // in the carousel chunk, and a "leaflet" chunk was preloaded by all
        // 209 pages although only the map components import it. Rollup's
        // default splitting does the right thing here: a library lands in the
        // chunk of the route that imports it, and a library several routes
        // share gets a chunk of its own that only those routes import.
        manualChunks: undefined,
      },
    },
  },
}));
