import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router'

import { Footer, Header } from '../components/Chrome'
import { BgVideoEffects, CycleRevealEffects, RevealEffects } from '../components/motion'
import { PHONE_1, PHONE_2, SITE_NAME, SITE_NAME_SHORT, TAGLINE } from '../data/site'

import appCss from '../styles.css?url'

/* Organization data published as JSON-LD. Every field here is already
   stated on the site: the legal name (a sole proprietorship, not a private
   limited company),
   the short trading name, the two published phone numbers, and the 2016
   founding year. Address and social profiles stay out until supplied. */
const ORGANIZATION_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  alternateName: SITE_NAME_SHORT,
  description: TAGLINE,
  foundingDate: '2016',
  areaServed: 'Ethiopia and East Africa',
  telephone: [PHONE_1.display, PHONE_2.display],
  logo: '/img/logo/mark.webp',
}

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
        {/* Organization structured data: the legal name is a sole proprietorship,
            not a private limited company. Only facts already published on the
            site appear here. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_LD) }}
        />
      </head>
      <body>
        {children}

        <Scripts />
      </body>
    </html>
  )
}
