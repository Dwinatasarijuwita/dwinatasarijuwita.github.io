const files = import.meta.glob('../assets/dwi-natasari-juwita.{jpeg,jpg,png,webp}', { eager: true, import: 'default' })

export const profilePhotoUrl = Object.values(files)[0] ?? null
