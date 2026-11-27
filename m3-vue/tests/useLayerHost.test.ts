import type { Ref } from 'vue'

import {
  defineComponent,
  h,
  nextTick,
  ref,
} from 'vue'
import { render } from '@testing-library/vue'

import { useLayerHost } from '@/composables/layers'

test('moves a layer host with its container and removes it while disabled', async () => {
  const destination = document.createElement('div')
  destination.id = 'layer-destination'
  document.body.append(destination)

  const modal = ref(false)
  const enabled = ref(true)
  const container = ref('#layer-destination')
  const state: { ready?: Ref<boolean> } = {}
  const Harness = defineComponent({
    setup () {
      const layer = useLayerHost(() => modal.value, () => container.value, () => enabled.value)
      state.ready = layer.ready
      return () => h('span', 'Content')
    },
  })

  const view = render(Harness)
  const host = destination.querySelector<HTMLElement>('.m3-layer')!
  expect(host.dataset.m3Layer).toBe('base')
  expect(state.ready?.value).toBe(true)

  modal.value = true
  await nextTick()
  expect(host.dataset.m3Layer).toBe('modal')

  enabled.value = false
  await nextTick()
  expect(host.isConnected).toBe(false)
  expect(state.ready?.value).toBe(false)

  container.value = '#missing-container'
  enabled.value = true
  await nextTick()
  expect(host.parentElement).toBe(document.body)
  expect(state.ready?.value).toBe(true)

  view.unmount()
  expect(host.isConnected).toBe(false)
  destination.remove()
})
