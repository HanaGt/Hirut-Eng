import { useEffect, useId, useRef, useState } from 'react'
import { inquiryTypes } from '../data/site'

const OPTIONS = inquiryTypes.flatMap((g) => g.options.map((o) => ({ ...o, group: g.group })))

type Props = {
  id: string
  name: string
  value: string
  invalid?: boolean
  describedBy?: string
  onChange: (value: string) => void
}

export function InquiryTypeSelect({ id, name, value, invalid, describedBy, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const selected = OPTIONS.find((o) => o.value === value)
  const activeOption = OPTIONS[active]

  useEffect(() => {
    if (!open) return
    const i = OPTIONS.findIndex((o) => o.value === value)
    setActive(i >= 0 ? i : 0)
  }, [open, value])

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  useEffect(() => {
    if (!open || !activeOption) return
    document.getElementById(`${listId}-${activeOption.value}`)?.scrollIntoView({ block: 'nearest' })
  }, [active, open, activeOption, listId])

  function choose(next: string) {
    onChange(next)
    setOpen(false)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'Tab') {
      setOpen(false)
      return
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!open) setOpen(true)
      else setActive((i) => Math.min(i + 1, OPTIONS.length - 1))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) setOpen(true)
      else setActive((i) => Math.max(i - 1, 0))
      return
    }
    if (e.key === 'Home') {
      e.preventDefault()
      if (!open) setOpen(true)
      setActive(0)
      return
    }
    if (e.key === 'End') {
      e.preventDefault()
      if (!open) setOpen(true)
      setActive(OPTIONS.length - 1)
      return
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!open) setOpen(true)
      else if (activeOption) choose(activeOption.value)
      return
    }
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const q = e.key.toLowerCase()
      const from = open ? active + 1 : 0
      const i = OPTIONS.findIndex((o, idx) => idx >= from && o.label.toLowerCase().startsWith(q))
      const wrap = OPTIONS.findIndex((o) => o.label.toLowerCase().startsWith(q))
      const next = i >= 0 ? i : wrap
      if (next >= 0) {
        e.preventDefault()
        setOpen(true)
        setActive(next)
      }
    }
  }

  return (
    <div className="select" ref={rootRef}>
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        id={id}
        className={selected ? 'select-trigger' : 'select-trigger select-trigger--placeholder'}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && activeOption ? `${listId}-${activeOption.value}` : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        aria-required="true"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
      >
        <span className="select-value">{selected ? selected.label : 'Select an inquiry type…'}</span>
        <svg className="select-chevron" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M3.2 5.8 8 10.6l4.8-4.8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <div className="select-panel" id={listId} role="listbox" aria-labelledby={id} tabIndex={-1}>
          {inquiryTypes.map((group) => (
            <div className="select-group" role="group" aria-label={group.group} key={group.group}>
              <div className="select-group-label">{group.group}</div>
              {group.options.map((o) => {
                const i = OPTIONS.findIndex((x) => x.value === o.value)
                const isSelected = o.value === value
                const isActive = i === active
                return (
                  <div
                    role="option"
                    id={`${listId}-${o.value}`}
                    aria-selected={isSelected}
                    className={
                      'select-option' +
                      (isSelected ? ' is-selected' : '') +
                      (isActive ? ' is-active' : '')
                    }
                    key={o.value}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => choose(o.value)}
                  >
                    <span className="select-check" aria-hidden="true">
                      {isSelected ? (
                        <svg viewBox="0 0 16 16">
                          <path
                            d="M3.2 8.4 6.3 11.4 12.8 4.6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : null}
                    </span>
                    <span>{o.label}</span>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
