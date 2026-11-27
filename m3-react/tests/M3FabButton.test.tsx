import type { M3FabButtonExposed } from '@/components/fab-button'

import { act } from '@testing-library/react'
import { createRef } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { M3FabButton } from '@/components/fab-button'
import { M3Icon } from '@/components/icon'

describe('m3-react/fab-button', () => {
  test('classifies icon and text content', () => {
    const { container } = render(
      <M3FabButton>
        <M3Icon name="add" />
        Create
      </M3FabButton>
    )

    const button = screen.getByRole('button')
    const icon = container.querySelector('.m3-fab-button__icon .m3-icon')
    const text = container.querySelector('.m3-fab-button__text')

    expect(button.classList.contains('m3-fab-button_has-leading-icon')).toBe(true)
    expect(icon?.textContent).toBe('add')
    expect(text?.textContent?.trim()).toBe('Create')
  })

  test('uses a link when given a destination', () => {
    render(<M3FabButton href="/new">New task</M3FabButton>)

    expect(screen.getByRole('link', { name: 'New task' }).getAttribute('href')).toBe('/new')
  })

  test('supports the large secondary action with a trailing icon', () => {
    const onKeyUp = vi.fn()
    const { container } = render(
      <M3FabButton size="lg" variant="secondary" onKeyUp={onKeyUp}>
        Compose
        <M3Icon name="edit" />
      </M3FabButton>
    )
    const button = screen.getByRole('button')

    expect(button.classList.contains('m3-fab-button_lg')).toBe(true)
    expect(button.classList.contains('m3-fab-button_secondary')).toBe(true)
    expect(button.classList.contains('m3-fab-button_has-trailing-icon')).toBe(true)
    expect(container.querySelector('.m3-fab-button__icon .m3-icon')?.textContent).toBe('edit')

    fireEvent.keyUp(button, { code: 'Enter' })
    expect(onKeyUp).toHaveBeenCalledOnce()
  })

  test('keeps a disabled icon-only FAB non-interactive', () => {
    const action = createRef<M3FabButtonExposed>()
    const { container } = render(
      <M3FabButton ref={action} href="/new" aria-label="Add item" disabled>
        <M3Icon name="add" />
      </M3FabButton>
    )
    const button = screen.getByRole('button', { name: 'Add item' }) as HTMLButtonElement

    expect(button.disabled).toBe(true)
    expect(button.getAttribute('href')).toBeNull()
    expect(button.classList.contains('m3-fab-button_has-leading-icon')).toBe(false)
    expect(container.querySelector('.m3-fab-button__text')).toBeNull()
    expect(action.current?.el).toBe(button)
  })

  test('exposes button controls and switches the underlying element with a destination', () => {
    const action = createRef<M3FabButtonExposed>()
    const onClick = vi.fn()
    const view = render(<M3FabButton ref={action} onClick={onClick}>Create</M3FabButton>)
    const button = screen.getByRole('button', { name: 'Create' })

    expect(action.current?.el).toBe(button)
    action.current?.focus()
    expect(document.activeElement).toBe(button)
    action.current?.blur()
    expect(document.activeElement).not.toBe(button)
    act(() => action.current?.click())
    expect(onClick).toHaveBeenCalledOnce()

    view.rerender(<M3FabButton ref={action} href="/new">Create</M3FabButton>)
    expect(action.current?.el).toBe(screen.getByRole('link', { name: 'Create' }))
  })
})
