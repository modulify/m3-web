import { fireEvent } from '@testing-library/vue'
import { h } from 'vue'
import { render, screen } from '@testing-library/vue'

import { M3FabButton } from '@/components/fab-button'
import { M3Icon } from '@/components/icon'

describe('m3-vue/fab-button', () => {
  test('classifies icon and text content', () => {
    const { container } = render(M3FabButton, {
      slots: {
        default: () => [
          h(M3Icon, { name: 'add' }),
          'Create',
        ],
      },
    })

    const button = screen.getByRole('button')
    const icon = container.querySelector('.m3-fab-button__icon .m3-icon')
    const text = container.querySelector('.m3-fab-button__text')

    expect(button.classList.contains('m3-fab-button_has-leading-icon')).toBe(true)
    expect(icon?.textContent).toBe('add')
    expect(text?.textContent?.trim()).toBe('Create')
  })

  test('supports trailing icon, alternate size and color, and keyboard activation', async () => {
    const view = render(M3FabButton, {
      props: { size: 'lg', variant: 'secondary' },
      slots: { default: () => ['Compose', h(M3Icon, { name: 'edit' })] },
    })
    const button = screen.getByRole('button')
    expect(button.classList.contains('m3-fab-button_lg')).toBe(true)
    expect(button.classList.contains('m3-fab-button_secondary')).toBe(true)
    expect(button.classList.contains('m3-fab-button_has-trailing-icon')).toBe(true)
    await fireEvent.keyUp(button, { code: 'Enter' })
    expect(view.container.querySelector('.m3-fab-button__icon .m3-icon')?.textContent).toBe('edit')
  })

  test('keeps a disabled icon-only FAB non-interactive', () => {
    const view = render(M3FabButton, {
      props: { disabled: true },
      slots: { default: () => h(M3Icon, { name: 'add' }) },
    })
    const button = screen.getByRole('button') as HTMLButtonElement
    expect(button.disabled).toBe(true)
    expect(button.classList.contains('m3-fab-button_has-leading-icon')).toBe(false)
    expect(view.container.querySelector('.m3-fab-button__text')).toBeNull()
  })

  test('uses link semantics for a FAB destination', () => {
    render(M3FabButton, {
      props: { href: '/new' },
      slots: { default: 'New task' },
    })

    expect(screen.getByRole('link', { name: 'New task' }).getAttribute('href')).toBe('/new')
  })
})
