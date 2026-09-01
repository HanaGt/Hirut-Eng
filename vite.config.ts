import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tanstackStart({
      // NOTE: a 'target' option is not supported by @tanstack/react-start 1.168.
      // The build emits dist/client (static) + dist/server; point Vercel at
      // dist/client as the output directory. See the deploy note in README.
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