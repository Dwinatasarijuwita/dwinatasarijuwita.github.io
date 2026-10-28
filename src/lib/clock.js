const dateFormat = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
const timeFormat = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

function parts(format, date) {
  return Object.fromEntries(format.formatToParts(date).map((part) => [part.type, part.value]))
}

// iPhone status bar style: "2:05"
export function formatTime(date) {
  const { hour, minute } = parts(timeFormat, date)
  return `${hour}:${minute}`
}

// English macOS menu bar style: "Wed Sep 30 2:05 PM"
export function formatClock(date) {
  const { weekday, month, day } = parts(dateFormat, date)
  const { dayPeriod } = parts(timeFormat, date)
  return `${weekday} ${month} ${day} ${formatTime(date)} ${dayPeriod}`
}

export function msUntilNextMinute(date) {
  return 60_000 - (date.getSeconds() * 1000 + date.getMilliseconds())
}
