import { Link, createFileRoute } from '@tanstack/react-router'
import { PillarForm } from '../components/PillarForm'

export const Route = createFileRoute('/admin/services/after-sales/new')({
  component: NewPillarPage,
})

function NewPillarPage() {
  return (
    <>
      <p className="admin-back">
        <Link to="/admin/services/after-sales">← After-sales pillars</Link>
      </p>
      <h2 className="admin-h2">New after-sales pillar</h2>
      <PillarForm />
    </>
  )
}
