import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'

export default () => {
  const frameRef = useRef<number | null>(null)

  const cancel = useCallback(() => {
    if (frameRef.current === null) {
      return
    }

    cancelAnimationFrame(frameRef.current)
    frameRef.current = null
  }, [])

  const request = useCallback((callback: FrameRequestCallback) => {
    cancel()

    let completed = false
    const frameId = requestAnimationFrame((time) => {
      completed = true
      frameRef.current = null
      callback(time)
    })

    if (!completed) {
      frameRef.current = frameId
    }
  }, [cancel])

  useEffect(() => cancel, [cancel])

  return useMemo(() => ({ request, cancel }), [request, cancel])
}
