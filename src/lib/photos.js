const large = import.meta.glob('../assets/photos/*.{jpeg,jpg,png,webp}', { eager: true, import: 'default' })
const thumbs = import.meta.glob('../assets/photos/thumbs/*.jpg', { eager: true, import: 'default' })

const baseName = (path) => path.split('/').pop().replace(/\.[^.]+$/, '')
const thumbByName = Object.fromEntries(Object.entries(thumbs).map(([path, url]) => [baseName(path), url]))

export const photos = Object.entries(large)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, src]) => {
    const id = baseName(path)
    return { id, src, thumb: thumbByName[id] ?? src }
  })
