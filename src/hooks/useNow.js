import { useEffect, useState } from 'react'
import { msUntilNextMinute } from '../lib/clock'

export function useNow() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let timer
    const schedule = () => {
      timer = setTimeout(() => {
        setNow(new Date())
        schedule()
      }, msUntilNextMinute(new Date()))
    }
    schedule()
    return () => clearTimeout(timer)
  }, [])

  return now
}
