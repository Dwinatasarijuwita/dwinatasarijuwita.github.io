const GRADIENTS = [
  ['#fb7185', '#e11d48'],
  ['#fbbf24', '#ea580c'],
  ['#34d399', '#0d9488'],
  ['#60a5fa', '#4f46e5'],
  ['#c084fc', '#9333ea'],
  ['#f472b6', '#db2777'],
]

export function songHref(song) {
  if (song.url) return song.url
  const query = encodeURIComponent(`${song.title} ${song.artist}`)
  return `https://open.spotify.com/search/${query}`
}

export function gradientFor(text) {
  let hash = 0
  for (const char of text) hash = (hash * 31 + char.codePointAt(0)) >>> 0
  const [from, to] = GRADIENTS[hash % GRADIENTS.length]
  return `linear-gradient(135deg, ${from}, ${to})`
}
