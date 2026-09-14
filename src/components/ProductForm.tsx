import { useNavigate, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import {
  PRODUCT_TAG_OPTIONS,
  SERVICE_HASH_OPTIONS,
  slugifyCategory,
  type ProductTag,
  type ServiceHash,
} from '../data/products'
import { deleteProduct, saveProduct, type AdminProduct } from '../server/product.functions'
import { ImageField, useImageUpload } from './ImageField'

type SpecDraft = { title: string; items: string }
type RelatedDraft = { label: string; hash: ServiceHash }

type FormState = {
  slug: string
  name: string
  footerLabel: string
  tags: ProductTag[]
  cardBlurb: string
  metaDescription: string
  ogDescription: string
  heroLead: string
  specGroups: SpecDraft[]
  specNote: string
  related: RelatedDraft[]
  ctaHeading: string
  ctaBody: string
  ctaLabel: string
  featureOrica: boolean
  published: boolean
}

const EMPTY: FormState = {
  slug: '',
  name: '',
  footerLabel: '',
  tags: [],
  cardBlurb: '',
  metaDescription: '',
  ogDescription: '',
  heroLead: '',
  specGroups: [{ title: '', items: '' }],
  specNote: '',
  related: [],
  ctaHeading: '',
  ctaBody: '',
  ctaLabel: '',
  featureOrica: false,
  published: true,
}

function fromProduct(product: AdminProduct): FormState {
  return {
    slug: product.slug,
    name: product.name,
    footerLabel: product.footerLabel,
    tags: product.tags,
    cardBlurb: product.cardBlurb,
    metaDescription: product.metaDescription,
    ogDescription: product.ogDescription,
    heroLead: product.heroLead,
    specGroups:
      product.specGroups.length > 0
        ? product.specGroups.map((group) => ({ title: group.title ?? '', items: group.items.join('\n') }))
        : [{ title: '', items: '' }],
    specNote: product.specNote,
    related: product.related,
    ctaHeading: product.cta.heading,
    ctaBody: product.cta.body,
    ctaLabel: product.cta.label,
    featureOrica: product.featureOrica,
    published: product.published,
  }
}

export function ProductForm({ product }: { product?: AdminProduct }) {
  const isNew = !product
  const navigate = useNavigate()
  const router = useRouter()
  const save = useServerFn(saveProduct)
  const remove = useServerFn(deleteProduct)
  const [form, setForm] = useState<FormState>(() => (product ? fromProduct(product) : EMPTY))
  const [slugTouched, setSlugTouched] = useState(!isNew)
  const image = useImageUpload(product?.image ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function setName(name: string) {
    setForm((prev) => ({
      ...prev,
      name,
      slug: slugTouched ? prev.slug : slugifyCategory(name),
    }))
  }

  function toggleTag(tag: ProductTag) {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((item) => item !== tag) : [...prev.tags, tag],
    }))
  }

  return (
    <form
      className="admin-form admin-form--wide"
      onSubmit={async (e) => {
        e.preventDefault()
        setBusy(true)
        setError('')
        try {
          const data = new FormData()
          data.append('isNew', isNew ? '1' : '0')
          data.append('slug', form.slug)
          data.append('name', form.name)
          data.append('footerLabel', form.footerLabel)
          form.tags.forEach((tag) => data.append('tags', tag))
          data.append('cardBlurb', form.cardBlurb)
          data.append('metaDescription', form.metaDescription)
          data.append('ogDescription', form.ogDescription)
          data.append('heroLead', form.heroLead)
          data.append(
            'specGroups',
            JSON.stringify(
              form.specGroups.map((group) => ({
                title: group.title,
                items: group.items.split('\n').map((item) => item.trim()).filter(Boolean),
              })),
            ),
          )
          data.append('specNote', form.specNote)
          data.append(
            'related',
            JSON.stringify(form.related.filter((row) => row.label.trim())),
          )
          data.append('ctaHeading', form.ctaHeading)
          data.append('ctaBody', form.ctaBody)
          data.append('ctaLabel', form.ctaLabel)
          data.append('featureOrica', form.featureOrica ? '1' : '0')
          data.append('published', form.published ? '1' : '0')
          image.appendTo(data)
          const result = await save({ data })
          await router.invalidate({ sync: true })
          await navigate({ to: '/admin/products/$slug', params: { slug: result.slug } })
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Could not save.')
        } finally {
          setBusy(false)
        }
      }}
    >
      <div className="field">
        <label htmlFor="p-name">Category name</label>
        <input id="p-name" value={form.name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="admin-form-grid">
        <div className="field">
          <label htmlFor="p-footer">Footer label</label>
          <input
            id="p-footer"
            value={form.footerLabel}
            onChange={(e) => set('footerLabel', e.target.value)}
            required
          />
          <p className="admin-help">Short name in the site footer.</p>
        </div>
        <div className="field">
          <label htmlFor="p-slug">URL slug</label>
          <input
            id="p-slug"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true)
              set('slug', e.target.value)
            }}
            required
            disabled={!isNew}
          />
          <p className="admin-help">{isNew ? 'Becomes /products/this-slug.' : 'The public URL cannot be changed.'}</p>
        </div>
      </div>

      <fieldset className="admin-fieldset">
        <legend>Tags</legend>
        <div className="admin-check-row">
          {PRODUCT_TAG_OPTIONS.map((tag) => (
            <label className="admin-check" key={tag.value}>
              <input
                type="checkbox"
                checked={form.tags.includes(tag.value)}
                onChange={() => toggleTag(tag.value)}
              />
              {tag.label}
            </label>
          ))}
        </div>
        <p className="admin-help">Used by the Water / Ground / Power filters on the products hub.</p>
      </fieldset>

      <label className="admin-check">
        <input
          type="checkbox"
          checked={form.featureOrica}
          onChange={(e) => set('featureOrica', e.target.checked)}
        />
        Exclusive Orica Digital Solutions line (shows the Orica band and the extra card tag)
      </label>
      <label className="admin-check">
        <input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} />
        Published on the website
      </label>

      <div className="field">
        <label htmlFor="p-blurb">Card summary</label>
        <textarea
          id="p-blurb"
          value={form.cardBlurb}
          onChange={(e) => set('cardBlurb', e.target.value)}
          rows={3}
          required
        />
        <p className="admin-help">Homepage, products hub, and expertise cards.</p>
      </div>
      <div className="field">
        <label htmlFor="p-lead">Hero lead</label>
        <textarea
          id="p-lead"
          value={form.heroLead}
          onChange={(e) => set('heroLead', e.target.value)}
          rows={4}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="p-meta">Search description</label>
        <textarea
          id="p-meta"
          value={form.metaDescription}
          onChange={(e) => set('metaDescription', e.target.value)}
          rows={3}
        />
      </div>
      <div className="field">
        <label htmlFor="p-og">Social description</label>
        <textarea
          id="p-og"
          value={form.ogDescription}
          onChange={(e) => set('ogDescription', e.target.value)}
          rows={2}
        />
      </div>

      <fieldset className="admin-fieldset">
        <legend>What we supply</legend>
        <p className="admin-help">One item per line. Add a group title when the list splits (Pumps / Accessories).</p>
        {form.specGroups.map((group, i) => (
          <div className="admin-repeat" key={i}>
            <div className="field">
              <label htmlFor={`p-group-title-${i}`}>Group title (optional)</label>
              <input
                id={`p-group-title-${i}`}
                value={group.title}
                onChange={(e) => {
                  const specGroups = form.specGroups.slice()
                  specGroups[i] = { ...group, title: e.target.value }
                  set('specGroups', specGroups)
                }}
                placeholder="Pumps"
              />
            </div>
            <div className="field">
              <label htmlFor={`p-group-items-${i}`}>Items</label>
              <textarea
                id={`p-group-items-${i}`}
                value={group.items}
                onChange={(e) => {
                  const specGroups = form.specGroups.slice()
                  specGroups[i] = { ...group, items: e.target.value }
                  set('specGroups', specGroups)
                }}
                rows={6}
                required={i === 0}
              />
            </div>
            {form.specGroups.length > 1 ? (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => set('specGroups', form.specGroups.filter((_, index) => index !== i))}
              >
                Remove group
              </button>
            ) : null}
          </div>
        ))}
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => set('specGroups', [...form.specGroups, { title: '', items: '' }])}
        >
          Add spec group
        </button>
      </fieldset>

      <div className="field">
        <label htmlFor="p-note">Catalog note (optional)</label>
        <textarea id="p-note" value={form.specNote} onChange={(e) => set('specNote', e.target.value)} rows={2} />
      </div>

      <fieldset className="admin-fieldset">
        <legend>Related services</legend>
        {form.related.map((row, i) => (
          <div className="admin-form-grid" key={i}>
            <div className="field">
              <label htmlFor={`p-rel-label-${i}`}>Label</label>
              <input
                id={`p-rel-label-${i}`}
                value={row.label}
                onChange={(e) => {
                  const related = form.related.slice()
                  related[i] = { ...row, label: e.target.value }
                  set('related', related)
                }}
              />
            </div>
            <div className="field">
              <label htmlFor={`p-rel-hash-${i}`}>Service line</label>
              <select
                id={`p-rel-hash-${i}`}
                value={row.hash}
                onChange={(e) => {
                  const related = form.related.slice()
                  related[i] = { ...row, hash: e.target.value as ServiceHash }
                  set('related', related)
                }}
              >
                {SERVICE_HASH_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => set('related', form.related.filter((_, index) => index !== i))}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => set('related', [...form.related, { label: '', hash: 'construction' }])}
        >
          Add related service
        </button>
      </fieldset>

      <fieldset className="admin-fieldset">
        <legend>Quote call-to-action</legend>
        <div className="field">
          <label htmlFor="p-cta-h">Heading</label>
          <input id="p-cta-h" value={form.ctaHeading} onChange={(e) => set('ctaHeading', e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="p-cta-b">Body</label>
          <textarea id="p-cta-b" value={form.ctaBody} onChange={(e) => set('ctaBody', e.target.value)} rows={3} required />
        </div>
        <div className="field">
          <label htmlFor="p-cta-l">Button label</label>
          <input id="p-cta-l" value={form.ctaLabel} onChange={(e) => set('ctaLabel', e.target.value)} required />
        </div>
      </fieldset>

      <ImageField
        id="p-image"
        preview={image.preview}
        fileRef={image.fileRef}
        onFile={image.setFile}
        onRemove={() => image.clear()}
      />

      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="admin-actions">
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? 'Saving…' : isNew ? 'Create category' : 'Save changes'}
        </button>
        {product ? (
          <button
            className="btn btn-ghost"
            type="button"
            onClick={async () => {
              if (!window.confirm(`Delete ${product.name} from the site?`)) return
              await remove({ data: { slug: product.slug } })
              await navigate({ to: '/admin/products' })
            }}
          >
            Delete
          </button>
        ) : null}
      </div>
    </form>
  )
}
