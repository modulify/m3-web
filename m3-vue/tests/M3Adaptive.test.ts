import { defineComponent, h, nextTick } from 'vue'
import { render, screen } from '@testing-library/vue'

import { M3Adaptive } from '@/components/adaptive'
import { m3Adaptive } from '@/composables'

const resize = async (width: number) => {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width })
  window.dispatchEvent(new Event('resize'))
  await nextTick()
}

describe('m3-vue/adaptive', () => {
  const initialWidth = window.innerWidth

  afterEach(async () => resize(initialWidth))

  test('renders exact breakpoint slots and falls back to the default slot', async () => {
    await resize(700)

    const view = render(M3Adaptive, {
      props: { regular: 'Regular prop', medium: 'Medium prop' },
      slots: {
        default: 'Regular slot',
        medium: 'Medium slot',
        large: 'Large slot',
      },
    })

    expect(screen.getByText('Medium slot')).not.toBeNull()

    await resize(900)
    expect(screen.getByText('Regular slot')).not.toBeNull()

    await resize(1300)
    expect(screen.getByText('Large slot')).not.toBeNull()

    view.unmount()
  })

  test('renders function props and updates the direct selector during render', async () => {
    await resize(1700)
    const regular = vi.fn(() => ['Regular', h('br'), 'content'])
    const extraLarge = vi.fn(() => ['Extra', h('br'), 'large'])
    const Example = defineComponent({
      setup: () => () => h('div', [
        h(M3Adaptive, { regular, extraLarge }),
        h('span', m3Adaptive('Base', { 'extra-large': 'Wide' })),
      ]),
    })

    const view = render(Example)

    expect(screen.getByText('Wide')).not.toBeNull()
    expect(view.container.textContent).toContain('Extra')
    expect(view.container.querySelector('br')).not.toBeNull()
    expect(extraLarge).toHaveBeenCalledOnce()
    expect(regular).not.toHaveBeenCalled()

    await resize(900)
    expect(screen.getByText('Base')).not.toBeNull()
    expect(view.container.textContent).toContain('Regular')
  })

  test('supports direct template interpolation', async () => {
    await resize(700)

    const Example = defineComponent({
      setup: () => ({ m3Adaptive }),
      template: '<span>{{ m3Adaptive("Regular", { medium: "Medium" }) }}</span>',
    })

    render(Example)

    expect(screen.getByText('Medium')).not.toBeNull()

    await resize(900)
    expect(screen.getByText('Regular')).not.toBeNull()
  })
})
