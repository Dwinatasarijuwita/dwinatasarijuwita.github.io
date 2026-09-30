export async function isPdfAvailable(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok && (response.headers.get('content-type') ?? '').includes('pdf')
  } catch {
    return false
  }
}
