import { Outlet, createFileRoute } from '@tanstack/react-router'
import { AdminServiceNav } from '../components/AdminServiceNav'

export const Route = createFileRoute('/admin/services')({
  component: ServicesAdminLayout,
})

function ServicesAdminLayout() {
  return (
    <div className="admin-page admin-page--wide">
      <h1>Services</h1>
      <p className="admin-lead">
        Three different sections on the public services page. Edit each one as it actually appears: work names and
        photos, consultancy cards, and after-sales pillars.
      </p>
      <AdminServiceNav />
      <Outlet />
    </div>
  )
}
