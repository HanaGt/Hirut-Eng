import { Link, createFileRoute } from '@tanstack/react-router'
import { ProductForm } from '../components/ProductForm'
import { getAdminProduct } from '../server/product.functions'

export const Route = createFileRoute('/admin/products/$slug')({
  loader: ({ params }) => getAdminProduct({ data: { slug: params.slug } }),
  component: EditProductPage,
})

function EditProductPage() {
  const product = Route.useLoaderData()
  return (
    <div className="admin-page">
      <p className="admin-back">
        <Link to="/admin/products">← All products</Link>
      </p>
      <h1>{product.name}</h1>
      <p className="admin-lead">Edits here update the category page, hub cards, footer, and contact inquiry types.</p>
      <ProductForm product={product} />
    </div>
  )
}
