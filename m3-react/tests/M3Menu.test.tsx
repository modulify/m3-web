import type { KeyboardEventHandler } from 'react'
import type { M3MenuExposed } from '@/components/menu'
import type { ReactNode } from 'react'

import { createRef } from 'react'
import { fireEvent, render } from '@testing-library/react'

import { M3Menu } from '@/components/menu'

const hide = vi.hoisted(() => vi.fn())

vi.mock('@/components/popper', async () => {
  const { forwardRef, useImperativeHandle, useRef } = await import('react')

  interface Props {
    children?: ReactNode;
    className?: string;
    role?: string;
    onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
  }

  const M3Popper = forwardRef<{ el: HTMLDivElement | null; hide: () => void }, Props>(
    ({ children, className, role, onKeyDown }, ref) => {
      const root = useRef<HTMLDivElement>(null)

      useImperativeHandle(ref, () => ({
        get el () { return root.current },
        hide,
      }))

      return <div ref={root} className={className} role={role} onKeyDown={onKeyDown}>
        {children}
      </div>
    }
  )

  return { M3Popper }
})

describe('m3-react/menu keyboard handling', () => {
  beforeEach(() => hide.mockClear())

  test('handles an empty action list and exposes the mounted root', () => {
    const target = document.createElement('button')
    const ref = createRef<M3MenuExposed>()
    const view = render(<M3Menu ref={ref} target={target}>
      <span>No actions available</span>
    </M3Menu>)
    const menu = view.getByRole('menu')

    expect(ref.current?.el).toBe(menu)
    expect(fireEvent.keyDown(menu, { key: 'ArrowDown' })).toBe(false)
    expect(fireEvent.keyDown(menu, { key: 'ArrowUp' })).toBe(false)
    expect(fireEvent.keyDown(menu, { key: 'Escape' })).toBe(false)
    expect(hide).toHaveBeenCalledOnce()

    const exposed = ref.current!
    view.unmount()
    expect(exposed.el).toBeNull()
  })

  test('closes a submenu on the reverse arrow', () => {
    const target = document.createElement('button')
    target.setAttribute('aria-haspopup', 'menu')
    const view = render(<M3Menu target={target} placement="right-start">
      <span>Submenu</span>
    </M3Menu>)

    expect(fireEvent.keyDown(view.getByRole('menu'), { key: 'ArrowLeft' })).toBe(false)
    expect(hide).toHaveBeenCalledOnce()
  })

  test('accepts an omitted menu body', () => {
    const view = render(<M3Menu target={document.body} />)

    expect(view.getByRole('menu').textContent).toBe('')
  })
})
