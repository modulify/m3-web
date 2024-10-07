import {
  describe,
  expect,
  test,
} from 'vitest'
 
import { render } from '@testing-library/vue'

import {
  h,
  nextTick,
  ref,
} from 'vue'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'

describe('m3-vue/button', () => {
  test('text node is wrapped', () => {
    const { container } = render(M3Button, {
      slots: {
        default: 'Some text',
      },
    })

    const text = container.querySelector('.m3-button__text')

    expect(text).not.toBeNull()
    expect(text.innerHTML).toEqual('Some text')
  })

  test('svg node is wrapped', () => {
    const { container } = render(M3Button, {
      slots: {
        default: () => h(M3Icon, { name: 'edit' }),
      },
    })

    const icon = container.querySelector('.m3-button__icon > .m3-icon')

    expect(icon).not.toBeNull()
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

    const icon = container.querySelector('.m3-button__icon > .m3-icon')

    expect(icon).not.toBeNull()
    expect(icon.innerHTML).toEqual('edit')

    const text = container.querySelector('.m3-button__text')

    expect(text).not.toBeNull()
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

    const text = container.querySelector(`.m3-button__text ${tag}`)

    expect(text).not.toBeNull()
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

    const icon = container.querySelector('.m3-button__icon > .m3-icon')

    expect(icon).not.toBeNull()
    expect(icon.innerHTML).toEqual('edit')

    isIcon.value = false

    await nextTick()

    const text = container.querySelector('.m3-button__text')

    expect(text).not.toBeNull()
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

    const contentBefore = container.querySelector('.m3-button__content')

    expect(contentBefore.childElementCount).toEqual(2)

    const icon = container.querySelector('.m3-icon')

    expect(icon).not.toBeNull()
    expect(icon.innerHTML).toEqual('edit')
    expect(contentBefore.lastChild.textContent).toEqual('Some text')

    iconExist.value = false

    await nextTick()

    const contentAfter = container.querySelector('.m3-button__content')

    expect(contentAfter.childElementCount).toEqual(1)
    expect(contentAfter.firstChild.textContent).toEqual('Some text')
  })

  test('button is link when passed prop href', () => {
    const href = '//some-site.com/'
    const { container } = render(M3Button, {
      props: { href },
    })

    const a = container.querySelector('.m3-button')

    expect(a.tagName).toBe('A')
    expect(a.getAttribute('href')).toBe(href)
  })
})