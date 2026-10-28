const large = import.meta.glob('../assets/photos/*.{jpeg,jpg,png,webp}', { eager: true, import: 'default' })
const thumbs = import.meta.glob('../assets/photos/thumbs/*.jpg', { eager: true, import: 'default' })

const baseName = (path) => path.split('/').pop().replace(/\.[^.]+$/, '')
// The word after the number in a file name ("02-friends") picks the album; anything that isn't a
// selfie or a friends photo is a moment worth remembering (work, graduation, a bootcamp...).
const ALBUMS = { self: 'Me', friends: 'Friends' }
const albumFor = (id) => ALBUMS[id.replace(/^\d+[-.]/, '')] ?? 'Moments'

export const albums = ['Me', 'Friends', 'Moments']

const thumbByName = Object.fromEntries(Object.entries(thumbs).map(([path, url]) => [baseName(path), url]))

export const photos = Object.entries(large)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, src]) => {
    const id = baseName(path)
    return { id, src, thumb: thumbByName[id] ?? src, album: albumFor(id) }
  })
