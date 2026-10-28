import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { setMobile } from '../test/matchMedia'
import { useIsMobile } from './useIsMobile'

describe('useIsMobile', () => {
  it('is false on desktop widths', () => {
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it('follows the viewport when it changes', () => {
    const { result } = renderHook(() => useIsMobile())
    act(() => setMobile(true))
    expect(result.current).toBe(true)
    act(() => setMobile(false))
    expect(result.current).toBe(false)
  })
})
