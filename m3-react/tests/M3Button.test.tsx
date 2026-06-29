import { ForwardRefRenderFunction } from 'react'

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

const getElement = (container: HTMLElement, selector: string): Element => {
  const element = container.querySelector(selector)

  expect(element).not.toBeNull()

  return element as Element
}

const getChildNode = (node: ChildNode | null): ChildNode => {
  expect(node).not.toBeNull()

  return node as ChildNode
}

describe('m3-react/button', () => {
  test('text node is wrapped', () => {
    const { container } = render(<M3Button>Some text</M3Button>)

    const text = getElement(container, '.m3-button__text')

    expect(text.innerHTML).toEqual('Some text')
  })

  test('svg node is wrapped', () => {
    const { container } = render(
      <M3Button>
        <M3Icon name={'edit'} />
      </M3Button>
    )

    const icon = getElement(container, '.m3-button__icon > .m3-icon')

    expect(icon.innerHTML).toEqual('edit')
  })

  test('icon and text node is wrapped', () => {
    const { container } = render(
      <M3Button>
        <M3Icon name={'edit'} /> Some text
      </M3Button>
    )

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
    const { container } = render(
      <M3Button>
        {createElement(tag, null, 'Some text')}  
      </M3Button>
    )

    const text = getElement(container, `.m3-button__text ${tag}`)

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
 
    const icon = getElement(container, '.m3-button__icon > .m3-icon')

    expect(icon.innerHTML).toEqual('edit')

    expect(ref.current).not.toBeNull()
    act(() => ref.current!.setIconActive(false))

    const text = getElement(container, '.m3-button__text')

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

    const contentBefore = getElement(container, '.m3-button__content')

    expect(contentBefore.childElementCount).toEqual(2)

    const icon = getElement(container, '.m3-icon')

    expect(icon.innerHTML).toEqual('edit')

    expect(getChildNode(contentBefore.lastChild).textContent).toEqual('Some text')

    expect(ref.current).not.toBeNull()
    act(() => ref.current!.setIconActive(false))

    const contentAfter = getElement(container, '.m3-button__content')

    expect(contentAfter.childElementCount).toEqual(1)
    expect(getChildNode(contentAfter.firstChild).textContent).toEqual('Some text')
  })
})
