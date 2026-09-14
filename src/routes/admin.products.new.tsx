import { Link, createFileRoute } from '@tanstack/react-router'
import { ProductForm } from '../components/ProductForm'

export const Route = createFileRoute('/admin/products/new')({
  component: NewProductPage,
})

function NewProductPage() {
  return (
    <div className="admin-page">
      <p className="admin-back">
        <Link to="/admin/products">← All products</Link>
      </p>
      <h1>New product category</h1>
      <ProductForm />
    </div>
  )
}
