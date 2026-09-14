import { Link, createFileRoute } from '@tanstack/react-router'
import { listAfterSalesPillars } from '../server/service.functions'

export const Route = createFileRoute('/admin/services/after-sales/')({
  loader: () => listAfterSalesPillars(),
  component: AfterSalesAdminPage,
})

function AfterSalesAdminPage() {
  const rows = Route.useLoaderData()
  return (
    <>
      <div className="admin-page-head">
        <h2 className="admin-h2" style={{ margin: 0 }}>
          After-sales pillars
        </h2>
        <Link className="btn btn-primary" to="/admin/services/after-sales/new">
          Add pillar
        </Link>
      </div>
      <p className="admin-lead">The expandable pillars on the After-Sales Services section.</p>
      {rows.length === 0 ? (
        <p className="admin-empty">No after-sales pillars yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pillar</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <Link to="/admin/services/after-sales/$id" params={{ id: row.id }}>
                      {row.title}
                    </Link>
                  </td>
                  <td>{row.items.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
