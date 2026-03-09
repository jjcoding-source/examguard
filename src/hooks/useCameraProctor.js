import { useEffect, useRef, useCallback } from 'react'

export default function useCameraProctor({
  videoRef,       
  canvasRef,      
  onViolation,
  enabled = true,
}) {
  const intervalRef    = useRef(null)
  const isLoadedRef    = useRef(false)
  const streamRef      = useRef(null)

  const loadModels = useCallback(async () => {
    if (isLoadedRef.current) return

    const MODEL_URL = 'https://cdn.jsdelivr.net/npm/face-api.js/weights'

    try {
      
      await Promise.all([
        
        window.faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        
        window.faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      ])
      isLoadedRef.current = true
    } catch (err) {
      console.error('Failed to load face-api models:', err)
    }
  }, [])

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: 'user' },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch {
      console.error('Camera access denied')
      onViolation({
        type:      'CAMERA_DENIED',
        severity:  'HIGH',
        message:   'Webcam access was denied',
        timestamp: new Date().toISOString(),
      })
    }
  }, [videoRef, onViolation])


  function isLookingAway(detection) {
    const landmarks = detection.landmarks
    const nose      = landmarks.getNose()
    const box       = detection.detection.box

    const noseTip  = nose[3]
    const faceCenter = box.x + box.width / 2

    const offset = Math.abs(noseTip.x - faceCenter)
    return offset > box.width * 0.3
  }

  const detectFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return
    if (!isLoadedRef.current) return
    if (!window.faceapi) return

    try {
      const detections = await window.faceapi
        .detectAllFaces(
          videoRef.current,
          new window.faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 })
        )
        .withFaceLandmarks()

      const count = detections.length

      if (count === 0) {
        onViolation({
          type:      'NO_FACE',
          severity:  'HIGH',
          message:   'No face detected in frame',
          timestamp: new Date().toISOString(),
        })
        return
      }

      if (count > 1) {
        onViolation({
          type:      'MULTIPLE_FACES',
          severity:  'HIGH',
          message:   `${count} faces detected in frame`,
          timestamp: new Date().toISOString(),
        })
        return
      }

      if (isLookingAway(detections[0])) {
        onViolation({
          type:      'LOOKING_AWAY',
          severity:  'MEDIUM',
          message:   'Student appears to be looking away',
          timestamp: new Date().toISOString(),
        })
      }

    } catch (err) {
      console.warn('Detection error:', err)
    }
  }, [videoRef, canvasRef, onViolation])

  useEffect(() => {
    if (!enabled) return

    async function init() {
      await loadModels()
      await startCamera()
      
      intervalRef.current = setInterval(detectFrame, 1500)
    }

    init()

    return () => {
      clearInterval(intervalRef.current)
      
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [enabled, loadModels, startCamera, detectFrame])
}