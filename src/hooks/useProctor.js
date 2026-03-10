import { useState, useCallback, useRef, useEffect } from 'react'
import * as signalR from '@microsoft/signalr'
import useTabDetection from './useTabDetection'
import useFullscreen from './useFullscreen'
import useCameraProctor from './useCameraProctor'
import { proctorAPI } from '../services/api'

const DEDUCTIONS = {
  NO_FACE:         10,
  MULTIPLE_FACES:  20,
  LOOKING_AWAY:    5,
  TAB_SWITCH:      8,
  FULLSCREEN_EXIT: 8,
  COPY_PASTE:      5,
  RIGHT_CLICK:     2,
  CAMERA_DENIED:   15,
}

const COOLDOWNS = {
  NO_FACE:         5000,
  LOOKING_AWAY:    8000,
  TAB_SWITCH:      2000,
  FULLSCREEN_EXIT: 3000,
  MULTIPLE_FACES:  4000,
  COPY_PASTE:      1000,
  RIGHT_CLICK:     500,
}

export default function useProctor({ sessionId, videoRef, canvasRef, enabled }) {
  const [trustScore, setTrustScore] = useState(100)
  const [violations, setViolations] = useState([])
  const [lastAlert, setLastAlert]   = useState(null)

  const lastFiredRef    = useRef({})
  const connectionRef   = useRef(null)

  // ── SignalR connection ──────────────────────────────────
  useEffect(() => {
    if (!enabled || !sessionId) return

    const connection = new signalR.HubConnectionBuilder()
      .withUrl('/hubs/proctor', {
        accessTokenFactory: () =>
          localStorage.getItem('examguard_token') || '',
      })
      .withAutomaticReconnect()
      .build()

    connection.start()
      .then(() => {
        connection.invoke('JoinExamSession', String(sessionId))
      })
      .catch(err => console.warn('SignalR connection failed:', err))

    // If instructor terminates session — redirect student out
    connection.on('SessionTerminated', () => {
      window.location.href = '/dashboard'
    })

    connectionRef.current = connection

    return () => {
      connection.stop()
    }
  }, [enabled, sessionId])

  // ── Violation handler ───────────────────────────────────
  const handleViolation = useCallback(async (violation) => {
    const now      = Date.now()
    const lastTime = lastFiredRef.current[violation.type] || 0
    const cooldown = COOLDOWNS[violation.type] || 2000

    if (now - lastTime < cooldown) return

    lastFiredRef.current[violation.type] = now

    const deduction = DEDUCTIONS[violation.type] || 5

    setTrustScore(prev => Math.max(0, prev - deduction))
    setViolations(prev => [violation, ...prev].slice(0, 20))
    setLastAlert(violation)
    setTimeout(() => setLastAlert(null), 4000)

    if (sessionId) {
      try {
        await proctorAPI.logEvent({ sessionId, ...violation })
      } catch {
        
      }
    }
  }, [sessionId])

  // ── Copy / paste + right click detection ───────────────
  useEffect(() => {
    if (!enabled) return

    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) &&
          ['c', 'v', 'x'].includes(e.key.toLowerCase())) {
        e.preventDefault()
        handleViolation({
          type:      'COPY_PASTE',
          severity:  'LOW',
          message:   'Copy/paste attempt blocked',
          timestamp: new Date().toISOString(),
        })
      }
    }

    function handleRightClick(e) {
      e.preventDefault()
      handleViolation({
        type:      'RIGHT_CLICK',
        severity:  'LOW',
        message:   'Right-click attempt blocked',
        timestamp: new Date().toISOString(),
      })
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('contextmenu', handleRightClick)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('contextmenu', handleRightClick)
    }
  }, [enabled, handleViolation])

  // ── Tab detection ───────────────────────────────────────
  useTabDetection({ onViolation: handleViolation, enabled })

  // ── Fullscreen ──────────────────────────────────────────
  const { enterFullscreen } = useFullscreen({
    onViolation: handleViolation,
    enabled,
  })

  // ── Camera / face detection ─────────────────────────────
  useCameraProctor({
    videoRef,
    canvasRef,
    onViolation: handleViolation,
    enabled,
  })

  return {
    trustScore,
    violations,
    lastAlert,
    enterFullscreen,
  }
}