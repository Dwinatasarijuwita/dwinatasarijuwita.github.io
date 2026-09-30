import { describe, expect, it } from 'vitest'
import { clampPosition } from './windowBounds'

const area = { width: 800, height: 600 }

describe('clampPosition', () => {
  it('keeps a window that already fits where it is', () => {
    expect(clampPosition({ x: 40, y: 30 }, { width: 400, height: 300 }, area, 88)).toEqual({ x: 40, y: 30 })
  })

  it('pulls a window back when its right edge would leave the desktop', () => {
    expect(clampPosition({ x: 700, y: 30 }, { width: 400, height: 300 }, area, 88)).toEqual({ x: 400, y: 30 })
  })

  it('keeps the bottom edge above the Dock', () => {
    expect(clampPosition({ x: 0, y: 400 }, { width: 400, height: 300 }, area, 88)).toEqual({ x: 0, y: 212 })
  })

  it('pins windows larger than the desktop to the top-left corner', () => {
    expect(clampPosition({ x: 220, y: 32 }, { width: 900, height: 700 }, area, 88)).toEqual({ x: 0, y: 0 })
  })

  it('leaves the position alone before the desktop has been measured', () => {
    expect(clampPosition({ x: 220, y: 32 }, { width: 720, height: 560 }, null, 88)).toEqual({ x: 220, y: 32 })
    expect(clampPosition({ x: 220, y: 32 }, { width: 720, height: 560 }, { width: 0, height: 0 }, 88)).toEqual({ x: 220, y: 32 })
  })
})
