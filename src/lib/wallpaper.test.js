import { describe, expect, it } from 'vitest'
import { wallpaperStyle } from './wallpaper'

describe('wallpaperStyle', () => {
  it('uses the wallpaper image from src/assets', () => {
    expect(wallpaperStyle.backgroundImage).toMatch(/^url\(".*wallpaper.*"\)$/)
  })
})
