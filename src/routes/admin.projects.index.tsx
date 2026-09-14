import { Link, createFileRoute } from '@tanstack/react-router'
import { listAdminProjects } from '../server/project.functions'

export const Route = createFileRoute('/admin/projects/')({
  loader: () => listAdminProjects(),
  component: ProjectsAdminPage,
})

function ProjectsAdminPage() {
  const rows = Route.useLoaderData()
  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>Projects</h1>
        <Link className="btn btn-primary" to="/admin/projects/new">
          Add project
        </Link>
      </div>
      {rows.length === 0 ? (
        <p className="admin-empty">No projects yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Sector</th>
                <th>Region</th>
                <th>Year</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <Link to="/admin/projects/$id" params={{ id: row.id }}>
                      {row.title}
                    </Link>
                  </td>
                  <td>{row.sectorLabel}</td>
                  <td>{row.regionLabel}</td>
                  <td>{row.year}</td>
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
