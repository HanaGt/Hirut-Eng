import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'
import viteReact from '@vitejs/plugin-react'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  ssr: {
    external: ['node:sqlite'],
  },

  plugins: [
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
        autoStaticPathsDiscovery: true,
        failOnError: true,
        filter: (page) => {
          const path = String(page.path ?? '')
          return !path.startsWith('/admin') && !path.startsWith('/uploads')
        },
      },
    }),

    nitro(),

    viteReact(),
  ],
})