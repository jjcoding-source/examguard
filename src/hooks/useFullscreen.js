import { useEffect, useCallback } from 'react'

export default function useFullscreen({ onViolation, enabled = true }) {

  const enterFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen()
    } catch {
      console.warn('Fullscreen request failed')
    }
  }, [])

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    function handleFullscreenChange() {
      if (!document.fullscreenElement) {
        onViolation({
          type:      'FULLSCREEN_EXIT',
          severity:  'MEDIUM',
          message:   'Exited fullscreen mode',
          timestamp: new Date().toISOString(),
        })

        setTimeout(() => {
          document.documentElement.requestFullscreen().catch(() => {})
        }, 1000)
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [enabled, onViolation])

  return { enterFullscreen, exitFullscreen }
}