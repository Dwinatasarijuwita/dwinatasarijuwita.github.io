const dateFormat = new Intl.DateTimeFormat('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })
const timeFormat = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' })

export function formatTime(date) {
  return timeFormat.format(date)
}

export function formatClock(date) {
  const parts = Object.fromEntries(dateFormat.formatToParts(date).map((part) => [part.type, part.value]))
  return `${parts.weekday} ${parts.day} ${parts.month} ${formatTime(date)}`
}

export function msUntilNextMinute(date) {
  return 60_000 - (date.getSeconds() * 1000 + date.getMilliseconds())
}
