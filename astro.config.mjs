// @ts-check
import { defineConfig, svgoOptimizer, fontProviders } from "astro/config";

// https://astro.build/config
export default defineConfig({
  redirects: {
    "/case-studies": "/case-studies/taxes-and-efficiency",
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  image: {
    domains: ["ftk-api.pages.dev"],
  },
  compressHTML: true,
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Cabin",
      cssVariable: "--font-cabin",
      weights: [500, 600, 700],
      styles: ["normal"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Lato",
      cssVariable: "--font-lato",
      weights: [400, 700],
      styles: ["normal"],
    },
  ],
});
