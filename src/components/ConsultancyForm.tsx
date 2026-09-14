import { useNavigate, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import {
  deleteConsultancyCard,
  saveConsultancyCard,
  type ConsultancyCard,
} from '../server/service.functions'

const EMPTY = { num: '', title: '', body: '' }

export function ConsultancyForm({ card }: { card?: ConsultancyCard }) {
  const isNew = !card
  const navigate = useNavigate()
  const router = useRouter()
  const save = useServerFn(saveConsultancyCard)
  const remove = useServerFn(deleteConsultancyCard)
  const [form, setForm] = useState(card ?? EMPTY)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  return (
    <form
      className="admin-form"
      onSubmit={async (e) => {
        e.preventDefault()
        setBusy(true)
        setError('')
        try {
          const data = new FormData()
          if (card?.id) data.append('id', card.id)
          data.append('num', form.num)
          data.append('title', form.title)
          data.append('body', form.body)
          const result = await save({ data })
          await router.invalidate({ sync: true })
          await navigate({ to: '/admin/services/consultancy/$id', params: { id: result.id } })
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Could not save.')
        } finally {
          setBusy(false)
        }
      }}
    >
      <div className="field">
        <label htmlFor="c-num">Short label</label>
        <input
          id="c-num"
          value={form.num}
          onChange={(e) => setForm((prev) => ({ ...prev, num: e.target.value }))}
          placeholder="Water"
        />
        <p className="admin-help">Small heading on the card, e.g. PM · M&E.</p>
      </div>
      <div className="field">
        <label htmlFor="c-title">Title</label>
        <input
          id="c-title"
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="c-body">Description</label>
        <textarea
          id="c-body"
          value={form.body}
          onChange={(e) => setForm((prev) => ({ ...prev, body: e.target.value }))}
          rows={4}
          required
        />
      </div>
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="admin-actions">
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? 'Saving…' : isNew ? 'Add consultancy service' : 'Save changes'}
        </button>
        {card ? (
          <button
            className="btn btn-ghost"
            type="button"
            onClick={async () => {
              if (!window.confirm('Remove this consultancy card from the services page?')) return
              await remove({ data: { id: card.id } })
              await navigate({ to: '/admin/services/consultancy' })
            }}
          >
            Delete
          </button>
        ) : null}
      </div>
    </form>
  )
}
