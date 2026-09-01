/* ============================================================
   PLACEHOLDER MEDIA — stock photography, hotlinked from Unsplash's
   CDN so the preview build reads like a finished site.

   These are NOT photographs of Hirut Engineering's own work. Every
   slot that uses one is labelled on-page as a sample. Replace each
   `url` with a self-hosted image from the company media library when
   it is delivered, and this file is the only place to edit.

   `auto=format` lets the CDN negotiate WebP/AVIF per browser, and the
   width params drive the srcset below.
   ============================================================ */

const U = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`

export interface StockImage {
  id: string
  alt: string
}

/** Build the src/srcset pair for a stock image. */
export function stock(img: StockImage) {
  return {
    src: U(img.id, 1200),
    srcSet: `${U(img.id, 600)} 600w, ${U(img.id, 1200)} 1200w, ${U(img.id, 1800)} 1800w`,
    alt: img.alt,
  }
}

const S = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=52`

/**
 * Lighter variant for decorative photographs that sit behind a heavy
 * scrim with text over them — they are dimmed and blurred by the
 * overlay anyway, so quality and resolution can drop a long way before
 * anyone could tell, and these load during the initial viewport pass.
 */
export function stockSoft(img: StockImage) {
  return {
    src: S(img.id, 700),
    srcSet: `${S(img.id, 400)} 400w, ${S(img.id, 700)} 700w, ${S(img.id, 1100)} 1100w`,
    alt: img.alt,
  }
}

/** Product category imagery, keyed by category slug. */
export const categoryImages: Record<string, StockImage> = {
  'gabions-wire-products': {
    id: 'photo-1779632069298-4be3693f173c',
    alt: 'A gabion wall built from rock held in wire mesh baskets',
  },
  'geosynthetic-products': {
    id: 'photo-1685698408546-c1bf34cffb65',
    alt: 'A lined water storage basin cut into bare earth',
  },
  'geotechnical-equipment': {
    id: 'photo-1766830110938-0ea8a6d78ecb',
    alt: 'A surveyor taking readings with a total station in the field',
  },
  'irrigation-farm-equipment': {
    id: 'photo-1743742566156-f1745850281a',
    alt: 'Sprinklers irrigating a green field',
  },
  'power-supply-equipment': {
    id: 'photo-1523559094051-53bac879eb80',
    alt: 'A diesel generator set',
  },
  'pumps-accessories': {
    id: 'photo-1620203853151-496c7228306c',
    alt: 'Industrial pipework, valves and fittings',
  },
  'waterproofing-materials': {
    id: 'photo-1548346835-0345c02743f2',
    alt: 'Water sitting on a sealed roof surface',
  },
}

/** Sample project imagery, in the order the sample cards appear. */
export const projectImages: StockImage[] = [
  { id: 'photo-1638294834907-d11608bc11d2', alt: 'An elevated water storage tower serving a town' },
  { id: 'photo-1569918190173-6a5792908184', alt: 'Aerial view of a dam wall and its reservoir' },
  { id: 'photo-1748432171507-c1d62fe2e859', alt: 'Crops growing on a bed served by irrigation line' },
  { id: 'photo-1620203853151-496c7228306c', alt: 'Industrial pipework and valves on a water scheme' },
  { id: 'photo-1548346835-0345c02743f2', alt: 'A sealed, waterproofed roof surface' },
  { id: 'photo-1766830110938-0ea8a6d78ecb', alt: 'Survey instrument set up on site' },
]

/** The four commitments on the homepage, in card order. Portrait crops. */
export const legImages: StockImage[] = [
  {
    id: 'photo-1586528116022-aeda1613c63d',
    alt: 'Workers moving stock through a supply warehouse aisle',
  },
  {
    id: 'photo-1565364507085-325347bae748',
    alt: 'An excavator working alongside large-diameter pipes on a construction site',
  },
  {
    id: 'photo-1581094488379-6a10d04c0f04',
    alt: 'Two engineers studying a drawing spread out on a table',
  },
  {
    id: 'photo-1581092334651-ddf26d9a09d0',
    alt: 'A technician servicing equipment on site',
  },
]

export const teamImage: StockImage = {
  id: 'photo-1760963301666-582b92218a19',
  alt: 'Engineers in hard hats and high-visibility vests conferring on site',
}
