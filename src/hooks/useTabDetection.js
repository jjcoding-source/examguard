import { useEffect, useRef } from 'react'

export default function useTabDetection({ onViolation, enabled = true }) {

  const countRef = useRef(0)

  useEffect(() => {
    if (!enabled) return

    function handleVisibilityChange() {
      if (document.hidden) {
        countRef.current += 1
        onViolation({
          type:      'TAB_SWITCH',
          severity:  countRef.current >= 3 ? 'HIGH' : 'MEDIUM',
          message:   `Tab switch detected (${countRef.current}x)`,
          timestamp: new Date().toISOString(),
        })
      }
    }

    function handleBlur() {
      countRef.current += 1
      onViolation({
        type:      'TAB_SWITCH',
        severity:  'MEDIUM',
        message:   'Window focus lost',
        timestamp: new Date().toISOString(),
      })
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
    }
  }, [enabled, onViolation])

  return { tabSwitchCount: countRef.current }
}