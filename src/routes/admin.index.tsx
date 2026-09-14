import { Link, createFileRoute } from '@tanstack/react-router'
import { inquiryStats } from '../server/inquiry.functions'

export const Route = createFileRoute('/admin/')({
  loader: () => inquiryStats(),
  component: AdminHome,
})

function AdminHome() {
  const stats = Route.useLoaderData()
  return (
    <div className="admin-page">
      <h1>Overview</h1>
      <p className="admin-lead">Inquiries land here as well as in email. Product categories, services, and projects you publish here are what the public site shows.</p>
      <div className="admin-stats">
        <Link className="admin-stat" to="/admin/inquiries">
          <strong>{stats.unread}</strong>
          <span>New inquiries</span>
        </Link>
        <Link className="admin-stat" to="/admin/inquiries">
          <strong>{stats.inquiries}</strong>
          <span>All inquiries</span>
        </Link>
        <Link className="admin-stat" to="/admin/products">
          <strong>{stats.products}</strong>
          <span>Product categories</span>
        </Link>
        <Link className="admin-stat" to="/admin/services">
          <strong>{stats.services}</strong>
          <span>Service entries</span>
        </Link>
        <Link className="admin-stat" to="/admin/projects">
          <strong>{stats.projects}</strong>
          <span>Projects</span>
        </Link>
      </div>
    </div>
  )
}
