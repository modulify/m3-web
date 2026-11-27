import type { Component } from 'vue'

import { defineComponent } from 'vue'
import { fireEvent } from '@testing-library/vue'
import { h, nextTick, ref } from 'vue'
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

  test('renders scoped leading and option slots and exposes the root', async () => {
    vi.stubGlobal('ResizeObserver', class {
      observe() {}
      disconnect() {}
    })

    const select = ref<{ el: HTMLElement | null } | null>(null)
    render(defineComponent({
      render: () => h(M3Select as Component, {
        ref: select,
        label: 'Status',
        value: 'draft',
        options: [
          { value: 'draft', label: 'Draft' },
          { value: 'published', label: 'Published' },
        ],
      }, {
        leading: ({ active }: { active: boolean }) => h('span', { 'data-testid': 'leading' }, active ? 'Open' : 'Closed'),
        'option-leading': ({ option }: { option: { label: string } }) =>
          h('span', { 'data-testid': 'option-leading' }, option.label[0]),
        'option-content': ({ option }: { option: { label: string } }) => `${option.label} item`,
      }),
    }))

    const input = screen.getByRole('combobox', { name: 'Status' })
    expect(select.value?.el?.classList.contains('m3-select')).toBe(true)
    expect(screen.getByTestId('leading').textContent).toBe('Closed')

    await nextTick()
    await fireEvent.click(input)
    await waitFor(() => {
      expect(screen.getByTestId('leading').textContent).toBe('Open')
      expect(screen.getByText('Draft item')).toBeTruthy()
      expect(screen.getByText('Published item')).toBeTruthy()
      expect(screen.getAllByTestId('option-leading')).toHaveLength(2)
    })
  })
})
