import { Link, createFileRoute } from '@tanstack/react-router'
import { displayTagLabels } from '../data/products'
import { listAdminProducts } from '../server/product.functions'

export const Route = createFileRoute('/admin/products/')({
  loader: () => listAdminProducts(),
  component: ProductsAdminPage,
})

function ProductsAdminPage() {
  const rows = Route.useLoaderData()
  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>Products</h1>
        <Link className="btn btn-primary" to="/admin/products/new">
          Add category
        </Link>
      </div>
      <p className="admin-lead">
        These are the product category pages on the public site: names, catalog lists, photos, and quote CTAs.
      </p>
      {rows.length === 0 ? (
        <p className="admin-empty">No product categories yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Tags</th>
                <th>Photo</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.slug}>
                  <td>
                    <Link to="/admin/products/$slug" params={{ slug: row.slug }}>
                      {row.name}
                    </Link>
                  </td>
                  <td>{displayTagLabels(row.tags, row.featureOrica).join(' · ')}</td>
                  <td>{row.image ? 'Uploaded' : 'Stock image'}</td>
                  <td>
                    <span className={`admin-pill ${row.published ? 'admin-pill--replied' : 'admin-pill--archived'}`}>
                      {row.published ? 'Published' : 'Hidden'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
