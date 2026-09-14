import { Link, createFileRoute } from '@tanstack/react-router'
import { ProjectForm } from '../components/ProjectForm'

export const Route = createFileRoute('/admin/projects/new')({
  component: NewProjectPage,
})

function NewProjectPage() {
  return (
    <div className="admin-page">
      <p className="admin-back">
        <Link to="/admin/projects">← All projects</Link>
      </p>
      <h1>New project</h1>
      <ProjectForm />
    </div>
  )
}
