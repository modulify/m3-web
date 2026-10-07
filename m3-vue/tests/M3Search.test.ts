import { defineComponent } from 'vue'
import { fireEvent } from '@testing-library/vue'
import { h, nextTick, ref } from 'vue'
import { render, screen } from '@testing-library/vue'

import { M3Search } from '@/components/search'

const mountSearch = (onSubmit = vi.fn()) => {
  const query = ref('')
  const open = ref(false)
  render(defineComponent({
    setup: () => () => h('div', [
      h('button', 'Outside'),
      h(M3Search, {
        query: query.value,
        open: open.value,
        label: 'Search messages',
        status: query.value ? '1 result' : '2 suggestions',
        'onUpdate:query': (value: string) => query.value = value,
        'onUpdate:open': (value: boolean) => open.value = value,
        onSubmit,
      }, {
        results: () => h('div', [h('button', 'First result'), h('button', 'Second result')]),
      }),
    ]),
  }))
  return { open, onSubmit }
}

describe('m3-vue/search', () => {
  test('opens, edits and submits without losing the query', async () => {
    const { onSubmit } = mountSearch()
    const trigger = screen.getByRole('button', { name: 'Search messages' })
    trigger.focus()
    await fireEvent.click(trigger)
    await nextTick()

    const dialog = screen.getByRole('dialog', { name: 'Search messages' })
    const input = screen.getByRole('searchbox', { name: 'Search messages' }) as HTMLInputElement
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(document.activeElement).toBe(input)
    expect(screen.getByRole('status').textContent).toBe('2 suggestions')

    await fireEvent.update(input, 'plan')
    expect(input.value).toBe('plan')
    expect(screen.getByRole('status').textContent).toBe('1 result')
    await fireEvent.submit(input.closest('form')!)
    expect(onSubmit).toHaveBeenCalledWith('plan')
    expect(input.value).toBe('plan')
    expect(document.activeElement).toBe(dialog.querySelector('.m3-search__results'))
  })

  test('navigates results, clears and closes with focus restoration', async () => {
    const { open } = mountSearch()
    const trigger = screen.getByRole('button', { name: 'Search messages' })
    trigger.focus()
    await fireEvent.click(trigger)
    await nextTick()
    const input = screen.getByRole('searchbox', { name: 'Search messages' }) as HTMLInputElement

    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'First result' }))
    await fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Second result' }))

    await fireEvent.update(input, 'draft')
    await fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(input.value).toBe('')
    expect(document.activeElement).toBe(input)

    await fireEvent.keyDown(document, { key: 'Escape' })
    await nextTick()
    await Promise.resolve()
    expect(open.value).toBe(false)
    expect(document.activeElement).toBe(trigger)
  })

  test('renders divided docked geometry when explicitly selected', async () => {
    render(M3Search, {
      props: {
        query: '', open: true, label: 'Search messages', status: '',
        appearance: 'divided', layout: 'docked',
      },
    })
    await nextTick()
    expect(document.querySelector('.m3-search__view_divided.m3-search__view_docked')).not.toBeNull()
  })
})
