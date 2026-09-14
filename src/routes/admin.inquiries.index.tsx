import { Link, createFileRoute } from '@tanstack/react-router'
import { listInquiries } from '../server/inquiry.functions'

export const Route = createFileRoute('/admin/inquiries/')({
  loader: () => listInquiries(),
  component: InquiriesPage,
})

function formatWhen(ms: number) {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(ms)
}

function InquiriesPage() {
  const rows = Route.useLoaderData()
  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>Inquiries</h1>
      </div>
      {rows.length === 0 ? (
        <p className="admin-empty">No inquiries yet. Submissions from the contact page will show up here.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Received</th>
                <th>Name</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <Link to="/admin/inquiries/$id" params={{ id: row.id }}>
                      {formatWhen(row.created_at)}
                    </Link>
                  </td>
                  <td>
                    <Link to="/admin/inquiries/$id" params={{ id: row.id }}>
                      {row.name}
                    </Link>
                  </td>
                  <td>{row.inquiry_type}</td>
                  <td>
                    <span className={`admin-pill admin-pill--${row.status}`}>{row.status}</span>
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
