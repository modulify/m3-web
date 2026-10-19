import {
  createLayerHost,
  mountLayerHost,
  setLayerModal,
} from '@modulify/m3-foundation/lib/layers'
import { useLayoutEffect, useMemo } from 'react'

export default function useLayerHost(modal: boolean, container: string = 'body', enabled = true): HTMLElement | null {
  const host = useMemo(() => enabled && typeof document !== 'undefined'
    ? createLayerHost(document)
    : null, [enabled])

  useLayoutEffect(() => {
    if (!host) return
    const target = document.querySelector<HTMLElement>(container) ?? document.body
    mountLayerHost(host, target)
    return () => host.remove()
  }, [host, container])

  useLayoutEffect(() => {
    if (host) setLayerModal(host, modal)
  }, [host, modal])

  return host
}
