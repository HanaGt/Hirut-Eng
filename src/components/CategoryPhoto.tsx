import { SampleImg } from './Placeholders'
import { categoryImages, stock } from '../data/media'

export function CategoryPhoto({
  slug,
  image,
  ratio = '16 / 9',
  sizes,
}: {
  slug: string
  image?: string
  ratio?: string
  sizes?: string
}) {
  const stockImg = categoryImages[slug]
  if (image) {
    return (
      <img
        className="sample-img"
        src={image}
        alt={stockImg?.alt ?? ''}
        width={1600}
        height={1000}
        loading="lazy"
        decoding="async"
        style={{ aspectRatio: ratio }}
      />
    )
  }
  if (!stockImg) return null
  return <SampleImg {...stock(stockImg)} ratio={ratio} sizes={sizes} />
}
