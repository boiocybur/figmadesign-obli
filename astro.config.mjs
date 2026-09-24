// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  experimental: {
    rustCompiler: true,
    queuedRendering: {
      enabled: true,
    },
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
});
