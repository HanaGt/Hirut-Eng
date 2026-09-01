import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router'

import { Footer, Header } from '../components/Chrome'
import { BgVideoEffects, CycleRevealEffects, RevealEffects } from '../components/motion'
import { SITE_NAME } from '../data/site'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: SITE_NAME },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE_NAME },
      /* [PLACEHOLDER: og:image - final brand/social image pending media library] */
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/img/logo/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { rel: 'apple-touch-icon', href: '/img/logo/favicon-180.png', sizes: '180x180' },
      /* placeholder photography is served from Unsplash's CDN - drop this
         once the media library is self-hosted (see src/data/media.ts) */
      { rel: 'preconnect', href: 'https://images.unsplash.com', crossOrigin: 'anonymous' },
    ],
  }),
  shellComponent: RootDocument,
  component: RootLayout,
})

function RootLayout() {
  // Keyed remount of the route content drives the 240ms fade/slide
  // transition (CSS-only; never delays content or blocks navigation).
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" className="route-frame" key={pathname}>
        <Outlet />
      </main>
      <Footer />
      <RevealEffects />
      <CycleRevealEffects />
      <BgVideoEffects />
    </>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}

        <Scripts />
      </body>
    </html>
  )
}
