import { ForwardRefRenderFunction } from 'react'

import {
  describe,
  expect,
  test,
} from 'vitest'

import { act, render } from '@testing-library/react'

import {
  createElement,
  createRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'

describe('m3-react/button', () => {
  test('text node is wrapped', () => {
    const { container } = render(<M3Button>Some text</M3Button>)

    const text = container.querySelector('.m3-button__text')

    expect(text).not.toBeNull()
    expect(text.innerHTML).toEqual('Some text')
  })

  test('svg node is wrapped', () => {
    const { container } = render(
      <M3Button>
        <M3Icon name={'edit'} />
      </M3Button>
    )

    const icon = container.querySelector('.m3-button__icon > .m3-icon')

    expect(icon).not.toBeNull()
    expect(icon.innerHTML).toEqual('edit')
  })

  test('icon and text node is wrapped', () => {
    const { container } = render(
      <M3Button>
        <M3Icon name={'edit'} /> Some text
      </M3Button>
    )

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
    const { container } = render(
      <M3Button>
        {createElement(tag, null, 'Some text')}  
      </M3Button>
    )

    const text = container.querySelector(`.m3-button__text ${tag}`)

    expect(text).not.toBeNull()
    expect(text.innerHTML.trim()).toEqual('Some text')
  })

  test('dynamic text content is wrapped', () => {
    type WrapperMethods = {
        setIconActive (value: boolean): void
    }

    const Wrapper = forwardRef(((_, ref) => {
      const [iconActive, setIconActive] = useState(true)

      useImperativeHandle(ref, () => ({
        setIconActive: (value: boolean) => setIconActive(value),
      }))

      return (
        <M3Button>
          {iconActive
            ? <M3Icon name={'edit'} />
            : 'Some text'
          }
        </M3Button>
      )
    }) as ForwardRefRenderFunction<WrapperMethods>)

    const ref = createRef<WrapperMethods>()

    const { container } = render(<Wrapper ref={ref} />)
 
    const icon = container.querySelector('.m3-button__icon > .m3-icon')

    expect(icon).not.toBeNull()
    expect(icon.innerHTML).toEqual('edit')

    act(() => ref.current.setIconActive(false))

    const text = container.querySelector('.m3-button__text')

    expect(text).not.toBeNull()
    expect(text.innerHTML).toEqual('Some text')
  })

  test('reactive changing content in slots', async () => {
    type WrapperMethods = {
      setIconActive (value: boolean): void
    }

    const Wrapper = forwardRef(((_, ref) => {
      const [iconActive, setIconActive ] = useState(true)

      useImperativeHandle(ref, () => ({
        setIconActive: (value: boolean) => setIconActive(value),
      }))

      return (
        <M3Button>
          {iconActive
            ? [<M3Icon name={'edit'} key="icon" />, 'Some text' ]
            : 'Some text'
          }
        </M3Button>
      )
    }) as ForwardRefRenderFunction<WrapperMethods>)

    const ref = createRef<WrapperMethods>()

    const { container } = render(<Wrapper ref={ref} />)

    const contentBefore = container.querySelector('.m3-button__content')

    expect(contentBefore.childElementCount).toEqual(2)

    const icon = container.querySelector('.m3-icon')

    expect(icon).not.toBeNull()
    expect(icon.innerHTML).toEqual('edit')

    expect(contentBefore.lastChild.textContent).toEqual('Some text')

    act(() => ref.current.setIconActive(false))

    const contentAfter = container.querySelector('.m3-button__content')

    expect(contentAfter.childElementCount).toEqual(1)
    expect(contentAfter.firstChild.textContent).toEqual('Some text')
  })
})
