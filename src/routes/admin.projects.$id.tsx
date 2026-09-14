import { Link, createFileRoute } from '@tanstack/react-router'
import { ProjectForm } from '../components/ProjectForm'
import { getAdminProject } from '../server/project.functions'

export const Route = createFileRoute('/admin/projects/$id')({
  loader: ({ params }) => getAdminProject({ data: { id: params.id } }),
  component: EditProjectPage,
})

function EditProjectPage() {
  const project = Route.useLoaderData()
  return (
    <div className="admin-page">
      <p className="admin-back">
        <Link to="/admin/projects">← All projects</Link>
      </p>
      <h1>Edit project</h1>
      <ProjectForm project={project} />
    </div>
  )
}
