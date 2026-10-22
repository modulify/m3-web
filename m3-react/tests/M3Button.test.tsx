import type { ForwardRefRenderFunction } from 'react'

import { act } from '@testing-library/react'
import { createElement, createRef, forwardRef } from 'react'
import { render, screen } from '@testing-library/react'
import { useImperativeHandle, useState } from 'react'

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
  test('width switches between content and compact geometry', () => {
    const { container, rerender } = render(<M3Button>Action</M3Button>)
    const button = container.querySelector<HTMLButtonElement>('button')!

    expect(button.classList.contains('m3-button_fixed')).toBe(false)

    rerender(<M3Button width="medium">Action</M3Button>)
    expect(button.classList.contains('m3-button_fixed')).toBe(true)

    rerender(<M3Button width="auto">Action</M3Button>)
    expect(button.classList.contains('m3-button_fixed')).toBe(false)
  })

  test('fixed width uses compact geometry with the same button layers', () => {
    const { container } = render(<M3Button width="wide" appearance="standard" aria-label="More"><M3Icon name="more_vert" /></M3Button>)
    const button = container.querySelector<HTMLButtonElement>('button')!
    expect(button.classList.contains('m3-button_fixed')).toBe(true)
    expect(button.classList.contains('m3-button_wide')).toBe(true)
    expect(button.classList.contains('m3-button_standard')).toBe(true)
    expect(button.querySelector('.m3-button__ripple .m3-ripple')).toBeTruthy()
    expect(button.querySelector('.m3-button__state')).toBeTruthy()
    expect(button.querySelector('.m3-button__content')).toBeTruthy()
    expect(button.querySelector('.m3-icon_filled')).toBeTruthy()
  })

  test('exposes toggle state and filled icon while preserving the button layers', () => {
    const { container, rerender } = render(
      <M3Button size="lg" rounding="square" appearance="tonal" toggleable selected>
        <M3Icon name="favorite" /> Favorite
      </M3Button>
    )
    const button = container.querySelector<HTMLButtonElement>('.m3-button')!
    expect(button.getAttribute('aria-pressed')).toBe('true')
    expect(button.classList.contains('m3-button_lg')).toBe(true)
    expect(button.classList.contains('m3-button_square')).toBe(true)
    expect(button.querySelector(':scope > .m3-button__state')).toBeTruthy()
    expect(button.querySelector(':scope > .m3-button__content')).toBeTruthy()
    expect(button.querySelector('.m3-icon')?.classList.contains('m3-icon_filled')).toBe(true)

    rerender(<M3Button appearance="text" toggleable selected>Favorite</M3Button>)
    expect(button.hasAttribute('aria-pressed')).toBe(false)
  })

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
            ? [<M3Icon key="icon" name={'edit'} />, 'Some text' ]
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

describe('m3-react/button icon variant', () => {
  test('forwards custom classes to the button', () => {
    render(<M3Button className="custom-action" aria-label="More" width="medium"><M3Icon name="more_vert" /></M3Button>)

    expect(screen.getByRole('button', { name: 'More' }).classList.contains('custom-action')).toBe(true)
  })

  test('uses filled icon for a normal action and outlined icon for an unselected toggle', () => {
    const { container, rerender } = render(<M3Button size="xl" width="wide"><M3Icon name="favorite" /></M3Button>)
    const button = screen.getByRole('button')
    expect(button.classList.contains('m3-button_fixed')).toBe(true)
    expect(button.classList.contains('m3-button_filled')).toBe(true)
    expect(button.classList.contains('m3-button_xl')).toBe(true)
    expect(button.classList.contains('m3-button_wide')).toBe(true)
    expect(container.querySelector('.m3-icon')?.classList.contains('m3-icon_filled')).toBe(true)

    rerender(<M3Button width="medium" toggleable><M3Icon name="favorite" /></M3Button>)
    expect(button.getAttribute('aria-pressed')).toBe('false')
    expect(container.querySelector('.m3-icon')?.classList.contains('m3-icon_filled')).toBe(false)
  })

  test('updates icon appearance in selected toggleable mode', () => {
    const { container } = render(
      <M3Button toggleable={true} selected={true} width="medium">
        <M3Icon name="edit" />
      </M3Button>
    )

    const button = screen.getByRole('button')
    const icon = container.querySelector('.m3-icon')

    expect(button.classList.contains('m3-button_selected')).toBe(true)
    expect(icon?.classList.contains('m3-icon_filled')).toBe(true)
  })
})
