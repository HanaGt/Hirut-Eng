import { useEffect, useRef, useState, type RefObject } from 'react'

export function useImageUpload(initial = '') {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState(initial)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  function clear() {
    setFile(null)
    setPreview('')
    if (fileRef.current) fileRef.current.value = ''
  }

  function appendTo(data: FormData) {
    if (file) data.append('image', file)
    if (!preview) data.append('removeImage', '1')
  }

  return { file, preview, fileRef, setFile, clear, appendTo }
}

export function ImageField({
  id,
  preview,
  fileRef,
  onFile,
  onRemove,
}: {
  id: string
  preview: string
  fileRef: RefObject<HTMLInputElement | null>
  onFile: (file: File | null) => void
  onRemove: () => void
}) {
  return (
    <div className="field">
      <label htmlFor={id}>Image</label>
      {preview ? (
        <img className="admin-image-preview" src={preview} alt="" />
      ) : (
        <div className="admin-image-empty">No image yet</div>
      )}
      <input
        ref={fileRef}
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
      <p className="admin-help">JPG, PNG, WebP or GIF, up to 8 MB.</p>
      {preview ? (
        <button type="button" className="btn btn-ghost" onClick={onRemove}>
          Remove image
        </button>
      ) : null}
    </div>
  )
}
