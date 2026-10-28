const files = import.meta.glob('../assets/wallpaper.{jpg,jpeg,png,webp}', { eager: true, import: 'default' })
const url = Object.values(files)[0]

export const wallpaperStyle = url
  ? { backgroundImage: `url("${url}")` }
  : { backgroundImage: 'linear-gradient(160deg, #1e3a8a 0%, #6d28d9 45%, #db2777 100%)' }
