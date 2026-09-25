import { onScopeDispose } from 'vue'

export function useAnimationFrame () {
  let frameId: number | null = null

  const cancel = () => {
    if (frameId === null) {
      return
    }

    cancelAnimationFrame(frameId)
    frameId = null
  }

  const request = (callback: FrameRequestCallback) => {
    cancel()

    let completed = false
    const nextFrameId = requestAnimationFrame((time) => {
      completed = true
      frameId = null
      callback(time)
    })

    if (!completed) {
      frameId = nextFrameId
    }
  }

  onScopeDispose(cancel)

  return { request, cancel }
}
