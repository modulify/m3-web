import { render } from '@testing-library/vue'

import {
  h,
  nextTick,
  ref,
} from 'vue'

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
