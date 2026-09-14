import { Link, createFileRoute } from '@tanstack/react-router'
import { ConsultancyForm } from '../components/ConsultancyForm'
import { getConsultancyCard } from '../server/service.functions'

export const Route = createFileRoute('/admin/services/consultancy/$id')({
  loader: ({ params }) => getConsultancyCard({ data: { id: params.id } }),
  component: EditConsultancyPage,
})

function EditConsultancyPage() {
  const card = Route.useLoaderData()
  return (
    <>
      <p className="admin-back">
        <Link to="/admin/services/consultancy">← Consultancy cards</Link>
      </p>
      <h2 className="admin-h2">{card.title}</h2>
      <ConsultancyForm card={card} />
    </>
  )
}
