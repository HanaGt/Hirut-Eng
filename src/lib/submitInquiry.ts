export type InquiryPayload = {
  name: string
  company: string
  phone: string
  email: string
  inquiryTypeLabel: string
  message: string
  honeypot: string
}

const ACCESS_KEY = '608cead0-1bf0-4eb6-955a-a520896a21c9'

type RelayResponse = { success?: boolean; message?: string }

export async function submitInquiry(payload: InquiryPayload) {
  const formData = new FormData()
  formData.append('access_key', ACCESS_KEY)
  formData.append('subject', `Website inquiry: ${payload.inquiryTypeLabel}`)
  formData.append('from_name', payload.name)
  formData.append('name', payload.name)
  formData.append('company', payload.company)
  formData.append('phone', payload.phone)
  formData.append('email', payload.email)
  formData.append('inquiry_type', payload.inquiryTypeLabel)
  formData.append('message', payload.message)
  formData.append('botcheck', payload.honeypot)

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: formData,
  })

  let data: RelayResponse = {}
  try {
    data = (await response.json()) as RelayResponse
  } catch {
    data = {}
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Could not send your inquiry.')
  }
}
