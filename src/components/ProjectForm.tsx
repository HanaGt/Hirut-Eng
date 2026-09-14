import { useNavigate, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { ImageField, useImageUpload } from './ImageField'
import { PROJECT_REGIONS, PROJECT_SECTORS, PROJECT_YEARS } from '../data/project-meta'
import { deleteProject, saveProject, type AdminProject } from '../server/project.functions'

const EMPTY: Omit<AdminProject, 'id' | 'sortOrder' | 'sectorLabel' | 'regionLabel'> = {
  title: '',
  sector: 'water-supply',
  region: 'ethiopia',
  year: 'recent',
  desc: '',
  image: '',
  published: true,
  isSample: false,
}

export function ProjectForm({ project }: { project?: AdminProject }) {
  const isNew = !project
  const navigate = useNavigate()
  const router = useRouter()
  const save = useServerFn(saveProject)
  const remove = useServerFn(deleteProject)
  const [form, setForm] = useState(project ?? EMPTY)
  const image = useImageUpload(project?.image ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <form
      className="admin-form"
      onSubmit={async (e) => {
        e.preventDefault()
        setBusy(true)
        setError('')
        try {
          const data = new FormData()
          if (project?.id) data.append('id', project.id)
          data.append('title', form.title)
          data.append('sector', form.sector)
          data.append('region', form.region)
          data.append('year', form.year)
          data.append('desc', form.desc)
          data.append('published', form.published ? '1' : '0')
          data.append('isSample', form.isSample ? '1' : '0')
          image.appendTo(data)
          const result = await save({ data })
          await router.invalidate({ sync: true })
          await navigate({ to: '/admin/projects/$id', params: { id: result.id } })
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Could not save.')
        } finally {
          setBusy(false)
        }
      }}
    >
      <div className="field">
        <label htmlFor="p-title">Title</label>
        <input id="p-title" value={form.title} onChange={(e) => set('title', e.target.value)} required />
      </div>
      <div className="admin-form-grid">
        <div className="field">
          <label htmlFor="p-sector">Sector</label>
          <select id="p-sector" value={form.sector} onChange={(e) => set('sector', e.target.value)}>
            {PROJECT_SECTORS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="p-region">Region</label>
          <select id="p-region" value={form.region} onChange={(e) => set('region', e.target.value)}>
            {PROJECT_REGIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="p-year">Year</label>
          <select id="p-year" value={form.year} onChange={(e) => set('year', e.target.value)}>
            {PROJECT_YEARS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="p-desc">Description</label>
        <textarea id="p-desc" value={form.desc} onChange={(e) => set('desc', e.target.value)} rows={5} />
      </div>
      <ImageField
        id="p-image"
        preview={image.preview}
        fileRef={image.fileRef}
        onFile={image.setFile}
        onRemove={() => {
          image.clear()
          set('image', '')
        }}
      />
      <label className="admin-check">
        <input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} />
        Published on the website
      </label>
      <label className="admin-check">
        <input type="checkbox" checked={form.isSample} onChange={(e) => set('isSample', e.target.checked)} />
        Mark as sample (not a delivered Hirut job)
      </label>
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="admin-actions">
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? 'Saving…' : isNew ? 'Create project' : 'Save changes'}
        </button>
        {project ? (
          <button
            className="btn btn-ghost"
            type="button"
            onClick={async () => {
              if (!window.confirm('Delete this project from the site?')) return
              await remove({ data: { id: project.id } })
              await navigate({ to: '/admin/projects' })
            }}
          >
            Delete
          </button>
        ) : null}
      </div>
    </form>
  )
}
