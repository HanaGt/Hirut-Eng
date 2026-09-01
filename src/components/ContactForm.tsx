import { useEffect, useRef, useState } from 'react'
import { PhChip } from './Placeholders'
import { PHONE_1, inquiryTypes } from '../data/site'

type Errors = Partial<Record<'name' | 'phone' | 'email' | 'type' | 'message', boolean>>

const ERROR_TEXT: Record<keyof Errors, string> = {
  name: 'Please enter your name.',
  phone: 'Please enter a valid phone number.',
  email: 'Please enter a valid email address.',
  type: 'Please choose an inquiry type.',
  message: 'Please tell us a little about your inquiry.',
}

export function ContactForm({ preselect }: { preselect?: string }) {
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)
  const [type, setType] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  const validValues = inquiryTypes.flatMap((g) => g.options.map((o) => o.value))

  // Category CTAs link here with ?type=…; applied after hydration so the
  // prerendered HTML (built without search params) matches on first paint.
  useEffect(() => {
    if (preselect && validValues.includes(preselect)) setType(preselect)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselect])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const val = (k: string) => String(data.get(k) ?? '').trim()

    const next: Errors = {}
    if (!val('name')) next.name = true
    if (!/^[+\d][\d\s\-()]{6,}$/.test(val('phone'))) next.phone = true
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val('email'))) next.email = true
    if (!val('inquiry-type')) next.type = true
    if (!val('message')) next.message = true
    setErrors(next)

    if (Object.keys(next).length > 0) {
      requestAnimationFrame(() => {
        form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      })
      return
    }

    /* [PLACEHOLDER: form submission endpoint / destination email]
       When the endpoint is confirmed, POST the FormData here before
       showing the success state. */
    setSent(true)
    requestAnimationFrame(() => successRef.current?.focus())
  }

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p className="field-error" id={`err-${k}`}>
        {ERROR_TEXT[k]}
      </p>
    ) : null

  if (sent) {
    return (
      <div className="form-success" role="status" tabIndex={-1} ref={successRef}>
        <div className="tick" aria-hidden="true">
          ✓
        </div>
        <h2 className="contact-h">Inquiry received</h2>
        <p>
          Thank you &mdash; we've got your message and an engineer will contact you shortly. For anything
          urgent, call <a href={`tel:${PHONE_1.tel}`}>{PHONE_1.display}</a>.
        </p>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">
            Full name <span className="req" aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            autoComplete="name"
            required
            aria-invalid={errors.name || undefined}
            aria-describedby={errors.name ? 'err-name' : undefined}
          />
          {err('name')}
        </div>
        <div className="field">
          <label htmlFor="company">Company / organization</label>
          <input type="text" id="company" name="company" autoComplete="organization" />
        </div>
        <div className="field">
          <label htmlFor="phone">
            Phone <span className="req" aria-hidden="true">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            autoComplete="tel"
            placeholder="+251 …"
            required
            aria-invalid={errors.phone || undefined}
            aria-describedby={errors.phone ? 'err-phone' : undefined}
          />
          {err('phone')}
        </div>
        <div className="field">
          <label htmlFor="email">
            Email <span className="req" aria-hidden="true">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            required
            aria-invalid={errors.email || undefined}
            aria-describedby={errors.email ? 'err-email' : undefined}
          />
          {err('email')}
        </div>
        <div className="field field--full">
          <label htmlFor="inquiry-type">
            Inquiry type <span className="req" aria-hidden="true">*</span>
          </label>
          <select
            id="inquiry-type"
            name="inquiry-type"
            required
            value={type}
            onChange={(e) => setType(e.target.value)}
            aria-invalid={errors.type || undefined}
            aria-describedby={errors.type ? 'err-type' : undefined}
          >
            <option value="">Select an inquiry type…</option>
            {inquiryTypes.map((group) => (
              <optgroup label={group.group} key={group.group}>
                {group.options.map((o) => (
                  <option value={o.value} key={o.value}>
                    {o.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {err('type')}
        </div>
        <div className="field field--full">
          <label htmlFor="message">
            Message <span className="req" aria-hidden="true">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Describe the project, quantities, site location, or the problem you need solved…"
            required
            aria-invalid={errors.message || undefined}
            aria-describedby={errors.message ? 'err-message' : undefined}
          />
          {err('message')}
        </div>
      </div>
      <p style={{ marginTop: '1.4rem' }}>
        <button type="submit" className="btn btn-primary">
          Send inquiry <span className="arrow" aria-hidden="true">→</span>
        </button>
      </p>
      <PhChip>
        form submission endpoint / destination email pending &mdash; the form currently validates and
        shows its success state without sending; wire the endpoint in ContactForm.tsx where marked
      </PhChip>
    </form>
  )
}
