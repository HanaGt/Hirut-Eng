import { useNavigate, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { deleteAfterSalesPillar, saveAfterSalesPillar, type AfterSalesPillar } from '../server/service.functions'

type FormState = { title: string; blurb: string; items: string }

function fromPillar(pillar: AfterSalesPillar): FormState {
  return { title: pillar.title, blurb: pillar.blurb, items: pillar.items.join('\n') }
}

export function PillarForm({ pillar }: { pillar?: AfterSalesPillar }) {
  const isNew = !pillar
  const navigate = useNavigate()
  const router = useRouter()
  const save = useServerFn(saveAfterSalesPillar)
  const remove = useServerFn(deleteAfterSalesPillar)
  const [form, setForm] = useState<FormState>(() => (pillar ? fromPillar(pillar) : { title: '', blurb: '', items: '' }))
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
          if (pillar?.id) data.append('id', pillar.id)
          data.append('title', form.title)
          data.append('blurb', form.blurb)
          data.append('items', form.items)
          const result = await save({ data })
          await router.invalidate({ sync: true })
          await navigate({ to: '/admin/services/after-sales/$id', params: { id: result.id } })
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Could not save.')
        } finally {
          setBusy(false)
        }
      }}
    >
      <div className="field">
        <label htmlFor="a-title">Pillar title</label>
        <input
          id="a-title"
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="a-blurb">Short summary</label>
        <textarea
          id="a-blurb"
          value={form.blurb}
          onChange={(e) => setForm((prev) => ({ ...prev, blurb: e.target.value }))}
          rows={3}
        />
      </div>
      <div className="field">
        <label htmlFor="a-items">What it covers</label>
        <textarea
          id="a-items"
          value={form.items}
          onChange={(e) => setForm((prev) => ({ ...prev, items: e.target.value }))}
          rows={8}
          required
        />
        <p className="admin-help">One item per line. These appear when the pillar is expanded.</p>
      </div>
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="admin-actions">
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? 'Saving…' : isNew ? 'Add pillar' : 'Save changes'}
        </button>
        {pillar ? (
          <button
            className="btn btn-ghost"
            type="button"
            onClick={async () => {
              if (!window.confirm('Remove this after-sales pillar from the services page?')) return
              await remove({ data: { id: pillar.id } })
              await navigate({ to: '/admin/services/after-sales' })
            }}
          >
            Delete
          </button>
        ) : null}
      </div>
    </form>
  )
}
