import type { Ref } from 'vue'
import type { TabVariant } from '@modulify/m3-foundation/types/components/tabs'

import {
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
} from 'vue'

export const useTabGroupIndicator = (track: Ref<HTMLDivElement | null>, variant: () => TabVariant) => {
  const indicator = ref({ offset: 0, width: 0 })
  let observer: ResizeObserver | undefined
  let lastSelectedId: string | undefined

  const update = () => {
    const active = track.value?.querySelector<HTMLButtonElement>('[role="tab"][aria-selected="true"]')
    const label = variant() === 'primary' ? active?.querySelector<HTMLElement>('.m3-tab-group__label-row, .m3-tab-group__icon') : null
    const next = active
      ? label
        ? { offset: active.offsetLeft + label.offsetLeft + Math.min(2, (label.offsetWidth - 24) / 2), width: Math.max(24, label.offsetWidth - 4) }
        : { offset: active.offsetLeft, width: active.offsetWidth }
      : { offset: 0, width: 0 }
    if (indicator.value.offset !== next.offset || indicator.value.width !== next.width) indicator.value = next
    if (active?.id !== lastSelectedId) {
      lastSelectedId = active?.id
      active?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
    }
    track.value?.querySelectorAll('[role="tab"]').forEach(tab => observer?.observe(tab))
  }

  onMounted(() => {
    if (typeof ResizeObserver === 'undefined' || !track.value) return
    observer = new ResizeObserver(update)
    observer.observe(track.value)
    update()
  })
  onUpdated(update)
  onBeforeUnmount(() => observer?.disconnect())

  return indicator
}
