export async function notifyWeb3Forms(payload: {
  name: string
  company: string
  phone: string
  email: string
  inquiryTypeLabel: string
  message: string
}) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY?.trim()
  if (!accessKey) {
    console.warn('[notify] WEB3FORMS_ACCESS_KEY is not set — inquiry saved without email.')
    return
  }
  const formData = new FormData()
  formData.append('access_key', accessKey)
  formData.append('subject', `Website inquiry: ${payload.inquiryTypeLabel}`)
  formData.append('from_name', payload.name)
  formData.append('name', payload.name)
  formData.append('company', payload.company)
  formData.append('phone', payload.phone)
  formData.append('email', payload.email)
  formData.append('inquiry_type', payload.inquiryTypeLabel)
  formData.append('message', payload.message)
  formData.append('botcheck', '')
  const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData })
  const body = (await response.json().catch(() => ({}))) as { success?: boolean }
  if (!response.ok || !body.success) throw new Error('Email relay failed')
}
