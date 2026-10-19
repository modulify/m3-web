import { createLayerHost, mountLayerHost } from '@modulify/m3-foundation/lib/layers'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { setLayerModal } from '@modulify/m3-foundation/lib/layers'
import { watch } from 'vue'

export function useLayerHost(modal: () => boolean, container: () => string = () => 'body', enabled: () => boolean = () => true) {
  const host = typeof document === 'undefined' ? null : createLayerHost(document)
  const ready = ref(Boolean(host) && enabled())

  watch(modal, value => {
    if (host) setLayerModal(host, value)
  }, { immediate: true })

  watch([container, enabled], ([value, active]) => {
    if (!host || !active) {
      host?.remove()
      ready.value = false
      return
    }
    mountLayerHost(host, document.querySelector<HTMLElement>(value) ?? document.body)
    ready.value = true
  }, { flush: 'post' })

  onMounted(() => {
    if (!host || !enabled()) return
    mountLayerHost(host, document.querySelector<HTMLElement>(container()) ?? document.body)
    ready.value = true
  })

  onBeforeUnmount(() => host?.remove())

  return { host, ready }
}
