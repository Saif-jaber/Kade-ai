import { useState, useEffect, useRef, useCallback } from 'react'

export function useThinking(isActive) {
  const [elapsed, setElapsed] = useState(0)
  const startTimeRef = useRef(null)
  const rafRef = useRef(null)

  const tick = useCallback(() => {
    if (startTimeRef.current !== null) {
      setElapsed((Date.now() - startTimeRef.current) / 1000)
      rafRef.current = requestAnimationFrame(tick)
    }
  }, [])

  useEffect(() => {
    if (isActive && startTimeRef.current === null) {
      startTimeRef.current = Date.now()
      rafRef.current = requestAnimationFrame(tick)
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [isActive, tick])

  const freeze = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    freeze()
    startTimeRef.current = null
    setElapsed(0)
  }, [freeze])

  const formatted = elapsed < 10
    ? `${elapsed.toFixed(1)}s`
    : `${Math.round(elapsed)}s`

  return { elapsed, formatted, freeze, reset }
}
