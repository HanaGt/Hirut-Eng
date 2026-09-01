import { defineConfig } from 'vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tanstackStart({
      // Per-route code splitting is on by default (each route's component
      // ships in its own chunk — verified in dist/client/assets).
      // Every route is statically prerendered at build time (non-negotiable:
      // buyers arrive from search engines on slow mobile networks).
      prerender: {
        enabled: true,
        crawlLinks: true,
        autoStaticPathsDiscovery: true,
        failOnError: true,
      },
    }),
    viteReact(),
  ],
})

export default config
