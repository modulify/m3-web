import {
  createApp,
  h,
  nextTick,
  ref,
} from 'vue'

import { M3Switch } from '@/components/switch'

test('animates the switch handle surface when toggled', async () => {
  const checked = ref(false)
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const app = createApp({
    setup: () => () => h(M3Switch, {
      checked: checked.value,
      'onUpdate:checked': (value: boolean) => checked.value = value,
    }),
  })
  app.mount(mountPoint)

  try {
    const input = mountPoint.querySelector<HTMLInputElement>('[role="switch"]')!
    const checkmark = mountPoint.querySelector<HTMLElement>('.m3-switch__checkmark')!
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
    input.click()
    await nextTick()

    const scales: number[] = []
    for (let frame = 0; frame < 5; frame++) {
      await new Promise<void>(resolve => setTimeout(resolve, 30))
      scales.push(new DOMMatrix(getComputedStyle(checkmark, '::before').transform).a)
    }

    expect(scales.some(scale => scale > 1 && scale < 1.5)).toBe(true)
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('changes switch handle surface without scaling its icon', async () => {
  const checked = ref(false)
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)

  const app = createApp({
    setup: () => () => h(M3Switch, {
      checked: checked.value,
      'onUpdate:checked': (value: boolean) => checked.value = value,
    }, {
      default: () => h('span', { 'data-testid': 'switch-icon', style: 'display: block; width: 12px; height: 12px' }),
    }),
  })
  app.mount(mountPoint)

  try {
    const input = mountPoint.querySelector<HTMLInputElement>('[role="switch"]')!
    const icon = mountPoint.querySelector<HTMLElement>('[data-testid="switch-icon"]')!
    const checkmark = icon.parentElement as HTMLElement
    const iconWidth = icon.getBoundingClientRect().width
    const checkmarkWidth = checkmark.offsetWidth

    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
    input.click()
    await nextTick()

    expect(input.getAttribute('aria-checked')).toBe('true')
    expect(icon.getBoundingClientRect().width).toBe(iconWidth)
    expect(checkmark.offsetWidth).toBe(checkmarkWidth)

    await new Promise<void>(resolve => setTimeout(resolve, 650))

    expect(getComputedStyle(checkmark, '::before').transform).toBe('matrix(1.5, 0, 0, 1.5, 0, 0)')
    expect(icon.getBoundingClientRect().width).toBe(iconWidth)
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})
