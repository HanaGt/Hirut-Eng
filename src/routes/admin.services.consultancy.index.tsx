import { Link, createFileRoute } from '@tanstack/react-router'
import { listConsultancyCards } from '../server/service.functions'

export const Route = createFileRoute('/admin/services/consultancy/')({
  loader: () => listConsultancyCards(),
  component: ConsultancyAdminPage,
})

function ConsultancyAdminPage() {
  const rows = Route.useLoaderData()
  return (
    <>
      <div className="admin-page-head">
        <h2 className="admin-h2" style={{ margin: 0 }}>
          Consultancy cards
        </h2>
        <Link className="btn btn-primary" to="/admin/services/consultancy/new">
          Add card
        </Link>
      </div>
      <p className="admin-lead">Cards under Professional & Consultancy Services.</p>
      {rows.length === 0 ? (
        <p className="admin-empty">No consultancy services yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Label</th>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.num || '—'}</td>
                  <td>
                    <Link to="/admin/services/consultancy/$id" params={{ id: row.id }}>
                      {row.title}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
