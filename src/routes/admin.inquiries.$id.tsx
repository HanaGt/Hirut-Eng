import { Link, createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { deleteInquiry, getInquiry, updateInquiry } from '../server/inquiry.functions'

export const Route = createFileRoute('/admin/inquiries/$id')({
  loader: ({ params }) => getInquiry({ data: { id: params.id } }),
  component: InquiryDetail,
})

function formatWhen(ms: number) {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(ms)
}

function InquiryDetail() {
  const row = Route.useLoaderData()
  const router = useRouter()
  const navigate = useNavigate()
  const save = useServerFn(updateInquiry)
  const remove = useServerFn(deleteInquiry)
  const [status, setStatus] = useState(row.status)
  const [notes, setNotes] = useState(row.notes)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  return (
    <div className="admin-page">
      <p className="admin-back">
        <Link to="/admin/inquiries">← All inquiries</Link>
      </p>
      <h1>{row.name}</h1>
      <p className="admin-lead">
        {row.inquiry_type} · {formatWhen(row.created_at)}
      </p>
      <dl className="admin-dl">
        <div>
          <dt>Company</dt>
          <dd>{row.company || '—'}</dd>
        </div>
        <div>
          <dt>Phone</dt>
          <dd>
            <a href={`tel:${row.phone}`}>{row.phone}</a>
          </dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${row.email}`}>{row.email}</a>
          </dd>
        </div>
      </dl>
      <h2 className="admin-h2">Message</h2>
      <p className="admin-message">{row.message}</p>
      <form
        className="admin-form"
        onSubmit={async (e) => {
          e.preventDefault()
          setBusy(true)
          setError('')
          try {
            await save({ data: { id: row.id, status, notes } })
            await router.invalidate({ sync: true })
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not save.')
          } finally {
            setBusy(false)
          }
        }}
      >
        <div className="field">
          <label htmlFor="inq-status">Status</label>
          <select id="inq-status" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="inq-notes">Internal notes</label>
          <textarea id="inq-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} />
        </div>
        {error ? (
          <p className="field-error" role="alert">
            {error}
          </p>
        ) : null}
        <div className="admin-actions">
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? 'Saving…' : 'Save'}
          </button>
          <button
            className="btn btn-ghost"
            type="button"
            onClick={async () => {
              if (!window.confirm('Delete this inquiry?')) return
              await remove({ data: { id: row.id } })
              await navigate({ to: '/admin/inquiries' })
            }}
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  )
}
