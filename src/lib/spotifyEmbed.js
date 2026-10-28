// Loads Spotify's iFrame API once. It resolves to null where the script can't load (offline, tests),
// so callers can fall back to a plain embed.
let apiPromise

export function loadSpotifyApi() {
  if (apiPromise) return apiPromise
  apiPromise = new Promise((resolve) => {
    if (typeof document === 'undefined' || navigator.userAgent.includes('jsdom')) return resolve(null)
    window.onSpotifyIframeApiReady = (api) => resolve(api)
    const script = document.createElement('script')
    script.src = 'https://open.spotify.com/embed/iframe-api/v1'
    script.async = true
    script.onerror = () => resolve(null)
    document.body.append(script)
  })
  return apiPromise
}
