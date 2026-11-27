import {
  createApp,
  defineComponent,
  h,
  nextTick,
  ref,
} from 'vue'
import { waitFor } from '@testing-library/vue'
import { withDirectives } from 'vue'

import { vM3PlaneTooltip } from '@/components/plane-tooltip'

describe('m3-vue/plane-tooltip', () => {
  test('adds, updates, and releases a tooltip bound to an element', async () => {
    const definition = ref({
      content: 'First hint',
      shown: true,
      disabled: false,
    })
    const mountPoint = document.createElement('div')
    document.body.append(mountPoint)

    const app = createApp(defineComponent({
      setup () {
        return () => withDirectives(
          h('button', { type: 'button' }, 'Target'),
          [[vM3PlaneTooltip, definition.value]]
        )
      },
    }))

    app.mount(mountPoint)

    try {
      const target = mountPoint.querySelector('button')!

      expect(target.classList.contains('m3-plane-tooltip-target')).toBe(true)
      expect(target.classList.contains('m3-plane-tooltip-target_active')).toBe(true)

      await waitFor(() => {
        expect(document.querySelector('.m3-plane-tooltip')?.textContent).toBe('First hint')
      })

      definition.value = {
        content: 'Updated hint',
        shown: true,
        disabled: false,
      }
      await nextTick()

      await waitFor(() => {
        expect(document.querySelector('.m3-plane-tooltip')?.textContent).toBe('Updated hint')
      })

      definition.value = {
        content: '',
        shown: true,
        disabled: true,
      }
      await nextTick()

      expect(target.classList.contains('m3-plane-tooltip-target')).toBe(false)
      expect(target.classList.contains('m3-plane-tooltip-target_active')).toBe(false)
    } finally {
      app.unmount()
      mountPoint.remove()
    }
  })
})
