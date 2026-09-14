import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { useImageUpload } from '../components/ImageField'
import {
  addConstructionPhoto,
  deleteConstructionPhoto,
  listConstructionPhotos,
  listConstructionWorks,
  saveConstructionWorks,
} from '../server/service.functions'

export const Route = createFileRoute('/admin/services/')({
  loader: async () => ({
    works: await listConstructionWorks(),
    photos: await listConstructionPhotos(),
  }),
  component: ConstructionAdminPage,
})

function ConstructionAdminPage() {
  const { works, photos } = Route.useLoaderData()
  const router = useRouter()
  const saveWorks = useServerFn(saveConstructionWorks)
  const add = useServerFn(addConstructionPhoto)
  const remove = useServerFn(deleteConstructionPhoto)
  const image = useImageUpload()
  const [titles, setTitles] = useState(works.map((work) => work.title))
  const [alt, setAlt] = useState('')
  const [busy, setBusy] = useState(false)
  const [photoBusy, setPhotoBusy] = useState(false)
  const [error, setError] = useState('')
  const [photoError, setPhotoError] = useState('')

  function move(index: number, dir: -1 | 1) {
    const nextIndex = index + dir
    if (nextIndex < 0 || nextIndex >= titles.length) return
    const next = titles.slice()
    const current = next[index]
    next[index] = next[nextIndex]
    next[nextIndex] = current
    setTitles(next)
  }

  return (
    <div className="admin-split">
      <section className="admin-panel">
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setBusy(true)
            setError('')
            try {
              await saveWorks({ data: { titles } })
              await router.invalidate({ sync: true })
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Could not save.')
            } finally {
              setBusy(false)
            }
          }}
        >
          <div className="admin-panel-head">
            <div>
              <h2>Work names</h2>
              <p>Left-hand list on the Construction Works section.</p>
            </div>
            <button className="btn btn-primary btn-sm" type="submit" disabled={busy}>
              {busy ? 'Saving…' : 'Save list'}
            </button>
          </div>
          <ol className="admin-work-list">
            {titles.map((title, i) => (
              <li className="admin-work-row" key={i}>
                <span className="admin-work-num">{String(i + 1).padStart(2, '0')}</span>
                <input
                  value={title}
                  onChange={(e) => {
                    const next = titles.slice()
                    next[i] = e.target.value
                    setTitles(next)
                  }}
                  aria-label={`Construction work ${i + 1}`}
                  required
                />
                <div className="admin-work-tools">
                  <button
                    type="button"
                    className="btn-icon"
                    aria-label="Move up"
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="btn-icon"
                    aria-label="Move down"
                    disabled={i === titles.length - 1}
                    onClick={() => move(i, 1)}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="btn-icon"
                    aria-label="Remove work"
                    disabled={titles.length <= 1}
                    onClick={() => setTitles(titles.filter((_, index) => index !== i))}
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ol>
          <div className="admin-panel-foot">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setTitles([...titles, ''])}>
              Add work
            </button>
            {error ? (
              <p className="field-error" role="alert">
                {error}
              </p>
            ) : null}
          </div>
        </form>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <h2>Slideshow</h2>
            <p>Photographs on the right of Construction Works.</p>
          </div>
        </div>
        {photos.length === 0 ? (
          <p className="admin-empty">No photos yet.</p>
        ) : (
          <ul className="admin-photo-grid admin-photo-grid--compact">
            {photos.map((photo) => (
              <li key={photo.id}>
                <img src={photo.src} alt={photo.alt} />
                <p>{photo.alt || 'No description'}</p>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={async () => {
                    if (!window.confirm('Remove this photo from the services page?')) return
                    await remove({ data: { id: photo.id } })
                    await router.invalidate({ sync: true })
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <form
          className="admin-upload"
          onSubmit={async (e) => {
            e.preventDefault()
            setPhotoBusy(true)
            setPhotoError('')
            try {
              const data = new FormData()
              image.appendTo(data)
              data.append('alt', alt)
              await add({ data })
              image.clear()
              setAlt('')
              await router.invalidate({ sync: true })
            } catch (err) {
              setPhotoError(err instanceof Error ? err.message : 'Could not upload.')
            } finally {
              setPhotoBusy(false)
            }
          }}
        >
          <p className="admin-upload-label">Add a photo</p>
          {image.preview ? <img className="admin-image-preview admin-image-preview--sm" src={image.preview} alt="" /> : null}
          <input
            ref={image.fileRef}
            id="service-image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => image.setFile(e.target.files?.[0] ?? null)}
          />
          <div className="admin-upload-row">
            <input
              id="service-alt"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Short description"
              aria-label="Short description"
            />
            <button className="btn btn-primary btn-sm" type="submit" disabled={photoBusy}>
              {photoBusy ? 'Uploading…' : 'Add'}
            </button>
          </div>
          {image.preview ? (
            <button type="button" className="btn btn-ghost btn-sm" onClick={image.clear}>
              Clear selection
            </button>
          ) : (
            <p className="admin-help">JPG, PNG, WebP or GIF, up to 8 MB.</p>
          )}
          {photoError ? (
            <p className="field-error" role="alert">
              {photoError}
            </p>
          ) : null}
        </form>
      </section>
    </div>
  )
}
