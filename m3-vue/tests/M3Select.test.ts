import type { Component } from 'vue'

import { fireEvent } from '@testing-library/vue'
import { h, nextTick } from 'vue'
import { render, screen, waitFor } from '@testing-library/vue'

import { M3Select } from '@/components/select'

vi.mock('@modulify/m3-foundation/lib/popper/floating', () => ({
  computePosition: vi.fn(async () => ({ placement: 'bottom-start', side: 'bottom' })),
}))

describe('m3-vue/select', () => {
  afterEach(() => vi.unstubAllGlobals())

  test('puts the combobox contract on the focusable input', () => {
    const { container } = render(M3Select, {
      props: {
        label: 'Status',
      },
    })

    const combobox = screen.getByRole('combobox', { name: 'Status' })
    const root = container.querySelector('.m3-select')

    expect(combobox.tagName).toBe('INPUT')
    expect(combobox.getAttribute('aria-controls')).toMatch(/-menu$/)
    expect(combobox.getAttribute('aria-expanded')).toBe('false')
    expect(root?.getAttribute('role')).toBeNull()
  })

  test('keeps menu visibility and the selected value in sync', async () => {
    vi.stubGlobal('ResizeObserver', class {
      observe() {}
      disconnect() {}
    })

    const onUpdate = vi.fn()
    render({
      render: () => h(M3Select as Component, {
        label: 'Status',
        value: 'draft',
        options: [
          { value: 'draft', label: 'Draft' },
          { value: 'published', label: 'Published' },
        ],
        'onUpdate:value': onUpdate,
      }),
    })
    const input = screen.getByRole('combobox', { name: 'Status' }) as HTMLInputElement
    const menu = () => document.getElementById(input.getAttribute('aria-controls')!)

    expect(input.value).toBe('Draft')
    expect(input.getAttribute('aria-expanded')).toBe('false')

    await nextTick()
    await fireEvent.click(input)
    await waitFor(() => expect(input.getAttribute('aria-expanded')).toBe('true'))
    expect(menu()?.getAttribute('aria-hidden')).toBe('false')

    await fireEvent.click(screen.getByRole('option', { name: 'Published' }))
    expect(onUpdate).toHaveBeenLastCalledWith('published')
    await waitFor(() => expect(input.getAttribute('aria-expanded')).toBe('false'))
    expect(menu()?.getAttribute('aria-hidden')).toBe('true')
  })
})
