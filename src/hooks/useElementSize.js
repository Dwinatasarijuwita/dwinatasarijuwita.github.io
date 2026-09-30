import { useEffect, useState } from 'react'

export function useElementSize(ref) {
  const [size, setSize] = useState(null)

  useEffect(() => {
    const element = ref.current
    const measure = () => setSize({ width: element.clientWidth, height: element.clientHeight })
    const frame = requestAnimationFrame(measure)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', measure)
    }
  }, [ref])

  return size
}
