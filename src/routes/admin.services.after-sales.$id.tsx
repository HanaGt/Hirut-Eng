import { Link, createFileRoute } from '@tanstack/react-router'
import { PillarForm } from '../components/PillarForm'
import { getAfterSalesPillar } from '../server/service.functions'

export const Route = createFileRoute('/admin/services/after-sales/$id')({
  loader: ({ params }) => getAfterSalesPillar({ data: { id: params.id } }),
  component: EditPillarPage,
})

function EditPillarPage() {
  const pillar = Route.useLoaderData()
  return (
    <>
      <p className="admin-back">
        <Link to="/admin/services/after-sales">← After-sales pillars</Link>
      </p>
      <h2 className="admin-h2">{pillar.title}</h2>
      <PillarForm pillar={pillar} />
    </>
  )
}
