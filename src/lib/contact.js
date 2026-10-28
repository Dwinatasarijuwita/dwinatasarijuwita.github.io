function digitsOf(phone) {
  return phone.replace(/\D/g, '')
}

export function whatsappUrl(phone) {
  const digits = digitsOf(phone)
  const international = digits.startsWith('0') ? `62${digits.slice(1)}` : digits
  return `https://wa.me/${international}`
}

export function formatPhone(phone) {
  return digitsOf(phone).replace(/^(\d{4})(\d{4})(\d+)$/, '$1-$2-$3')
}
