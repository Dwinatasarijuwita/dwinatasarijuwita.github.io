import { useRef, useState } from 'react'

// Hides a bar while `enabled`, revealing it when the cursor reaches a screen-edge zone
// or the bar receives keyboard focus, and hiding it again once the cursor leaves.
export function useEdgeReveal(enabled) {
  const [revealed, setRevealed] = useState(false)
  const barRef = useRef(null)

  return {
    hidden: enabled && !revealed,
    barRef,
    zoneProps: {
      onMouseEnter: () => setRevealed(true),
      onMouseLeave: (event) => {
        const next = event.relatedTarget
        if (!(next instanceof Node && barRef.current?.contains(next))) setRevealed(false)
      },
    },
    barProps: {
      onMouseLeave: () => setRevealed(false),
      onFocus: () => setRevealed(true),
      onBlur: () => setRevealed(false),
    },
  }
}
