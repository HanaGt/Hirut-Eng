import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/services/after-sales')({
  component: () => <Outlet />,
})
