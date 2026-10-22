import { h, nextTick, ref } from 'vue'
import { render, screen } from '@testing-library/vue'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'

const getElement = (container: ParentNode, selector: string): Element => {
  const element = container.querySelector(selector)

  expect(element).not.toBeNull()

  return element as Element
}

const getChildNode = (node: ChildNode | null): ChildNode => {
  expect(node).not.toBeNull()

  return node as ChildNode
}

describe('m3-vue/button', () => {
  test('width switches between content and compact geometry', async () => {
    const width = ref<'auto' | 'medium' | undefined>()
    const { container } = render({
      setup: () => () => h(M3Button, { width: width.value }, () => 'Action'),
    })
    const button = container.querySelector<HTMLButtonElement>('button')!

    expect(button.classList.contains('m3-button_fixed')).toBe(false)

    width.value = 'medium'
    await nextTick()
    expect(button.classList.contains('m3-button_fixed')).toBe(true)

    width.value = 'auto'
    await nextTick()
    expect(button.classList.contains('m3-button_fixed')).toBe(false)
  })

  test('fixed width uses compact geometry with the same button layers', () => {
    const { container } = render(M3Button, {
      props: { width: 'wide', appearance: 'standard' },
      slots: { default: () => h(M3Icon, { name: 'more_vert' }) },
    })
    const button = container.querySelector<HTMLButtonElement>('button')!
    expect(button.classList.contains('m3-button_fixed')).toBe(true)
    expect(button.classList.contains('m3-button_wide')).toBe(true)
    expect(button.classList.contains('m3-button_standard')).toBe(true)
    expect(button.querySelector('.m3-button__ripple')).toBeTruthy()
    expect(button.querySelector('.m3-button__state')).toBeTruthy()
    expect(button.querySelector('.m3-button__content')).toBeTruthy()
    expect(button.querySelector('.m3-icon_filled')).toBeTruthy()
  })

  test('exposes toggle state and filled icon while preserving the button layers', async () => {
    const appearance = ref<'tonal' | 'text'>('tonal')
    const { container } = render({
      setup: () => () => h(M3Button, { size: 'lg', rounding: 'square', appearance: appearance.value, toggleable: true, selected: true }, () => [
        h(M3Icon, { name: 'favorite' }), 'Favorite',
      ]),
    })
    const button = container.querySelector<HTMLButtonElement>('.m3-button')!
    expect(button.getAttribute('aria-pressed')).toBe('true')
    expect(button.classList.contains('m3-button_lg')).toBe(true)
    expect(button.classList.contains('m3-button_square')).toBe(true)
    expect(button.querySelector(':scope > .m3-button__state')).toBeTruthy()
    expect(button.querySelector(':scope > .m3-button__content')).toBeTruthy()
    expect(button.querySelector('.m3-icon')?.classList.contains('m3-icon_filled')).toBe(true)

    appearance.value = 'text'
    await nextTick()
    expect(button.hasAttribute('aria-pressed')).toBe(false)
  })

  test('text node is wrapped', () => {
    const { container } = render(M3Button, {
      slots: {
        default: 'Some text',
      },
    })

    const text = getElement(container, '.m3-button__text')

    expect(text.innerHTML).toEqual('Some text')
  })

  test('svg node is wrapped', () => {
    const { container } = render(M3Button, {
      slots: {
        default: () => h(M3Icon, { name: 'edit' }),
      },
    })

    const icon = getElement(container, '.m3-button__icon > .m3-icon')

    expect(icon.innerHTML).toEqual('edit')
  })
    
  test('icon and text node is wrapped', () => {
    const { container } = render(M3Button, {
      slots: {
        default: () => [
          h(M3Icon, { name: 'edit' }),
          'Some text',
        ],
      },
    })

    const icon = getElement(container, '.m3-button__icon > .m3-icon')

    expect(icon.innerHTML).toEqual('edit')

    const text = getElement(container, '.m3-button__text')

    expect(text.innerHTML.trim()).toEqual('Some text')
  })

  test.each([
    'b',
    'i',
    'span',
    'strong',
  ])('%s node is wrapped', (tag) => {
    const { container } = render(M3Button, {
      slots: {
        default: () => h(tag, 'Some text'),
      },
    })

    const text = getElement(container, `.m3-button__text ${tag}`)

    expect(text.innerHTML.trim()).toEqual('Some text')
  })

  test('dynamic text content is wrapped', async () => {
    const isIcon = ref(true)
    const { container } = render({
      setup: () => {
        return () => h(M3Button, {}, {
          default: () => isIcon.value
            ? h(M3Icon, { name: 'edit' })
            : 'Some text',
        })
      },
    })

    const icon = getElement(container, '.m3-button__icon > .m3-icon')

    expect(icon.innerHTML).toEqual('edit')

    isIcon.value = false

    await nextTick()

    const text = getElement(container, '.m3-button__text')

    expect(text.innerHTML).toEqual('Some text')
  })

  test('reactive changing content in slots', async () => {
    const iconExist = ref(true)
    const { container } = render({
      setup: () => {
        return () => h(M3Button, {}, {
          default: () => iconExist.value
            ? [ h(M3Icon, { name: 'edit' }), 'Some text' ]
            : 'Some text',
        })
      },
    })

    const contentBefore = getElement(container, '.m3-button__content')

    expect(contentBefore.childElementCount).toEqual(2)

    const icon = getElement(container, '.m3-icon')

    expect(icon.innerHTML).toEqual('edit')
    expect(getChildNode(contentBefore.lastChild).textContent).toEqual('Some text')

    iconExist.value = false

    await nextTick()

    const contentAfter = getElement(container, '.m3-button__content')

    expect(contentAfter.childElementCount).toEqual(1)
    expect(getChildNode(contentAfter.firstChild).textContent).toEqual('Some text')
  })

  test('button is link when passed prop href', () => {
    const href = '//some-site.com/'
    const { container } = render(M3Button, {
      props: { href },
    })

    const a = getElement(container, '.m3-button')

    expect(a.tagName).toBe('A')
    expect(a.getAttribute('href')).toBe(href)
  })
})

describe('m3-vue/button icon variant', () => {
  test('forwards custom classes to the button', () => {
    render(M3Button, {
      props: { width: 'medium' },
      attrs: { class: 'custom-action', 'aria-label': 'More' },
      slots: { default: () => h(M3Icon, { name: 'more_vert' }) },
    })

    expect(screen.getByRole('button', { name: 'More' }).classList.contains('custom-action')).toBe(true)
  })

  test('uses filled icon for a normal action and outlined icon for an unselected toggle', async () => {
    const toggleable = ref(false)
    const { container } = render({
      setup: () => () => h(M3Button, { size: 'xl', width: 'wide', toggleable: toggleable.value }, () => h(M3Icon, { name: 'favorite' })),
    })
    const button = screen.getByRole('button')
    expect(button.classList.contains('m3-button_fixed')).toBe(true)
    expect(button.classList.contains('m3-button_filled')).toBe(true)
    expect(button.classList.contains('m3-button_xl')).toBe(true)
    expect(button.classList.contains('m3-button_wide')).toBe(true)
    expect(container.querySelector('.m3-icon')?.classList.contains('m3-icon_filled')).toBe(true)

    toggleable.value = true
    await nextTick()
    expect(button.getAttribute('aria-pressed')).toBe('false')
    expect(container.querySelector('.m3-icon')?.classList.contains('m3-icon_filled')).toBe(false)
  })

  test('updates icon appearance in selected toggleable mode', () => {
    const { container } = render(M3Button, {
      props: {
        width: 'medium',
        toggleable: true,
        selected: true,
      },
      slots: {
        default: () => h(M3Icon, { name: 'edit' }),
      },
    })

    const button = screen.getByRole('button')
    const icon = container.querySelector('.m3-icon')

    expect(button.classList.contains('m3-button_selected')).toBe(true)
    expect(icon?.classList.contains('m3-icon_filled')).toBe(true)
  })
})
