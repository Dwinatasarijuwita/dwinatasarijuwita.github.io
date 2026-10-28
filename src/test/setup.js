import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { MotionGlobalConfig } from 'motion/react'
import { afterEach } from 'vitest'
import { installMatchMedia, resetMatchMedia } from './matchMedia'

installMatchMedia()
MotionGlobalConfig.skipAnimations = true

afterEach(() => {
  cleanup()
  resetMatchMedia()
})
