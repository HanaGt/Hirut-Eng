import { Link, createFileRoute } from '@tanstack/react-router'
import { ConsultancyForm } from '../components/ConsultancyForm'

export const Route = createFileRoute('/admin/services/consultancy/new')({
  component: NewConsultancyPage,
})

function NewConsultancyPage() {
  return (
    <>
      <p className="admin-back">
        <Link to="/admin/services/consultancy">← Consultancy cards</Link>
      </p>
      <h2 className="admin-h2">New consultancy card</h2>
      <ConsultancyForm />
    </>
  )
}
