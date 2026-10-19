import type { M3SearchExposed } from '@/components/search'

import { act } from '@testing-library/react'
import { createRef } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'

import { M3Search } from '@/components/search'

const SearchHarness = ({ onSubmit = () => {} }: { onSubmit?: (query: string) => void }) => {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button">Outside</button>
      <M3Search
        query={query}
        open={open}
        label="Search messages"
        status={query ? '1 result' : '2 suggestions'}
        onQueryChange={setQuery}
        onOpenChange={setOpen}
        onSubmit={onSubmit}
      >
        <M3Search.Results render={({ close }) => (
          <div>
            <button type="button" onClick={close}>First result</button>
            <button type="button">Second result</button>
          </div>
        )} />
      </M3Search>
    </>
  )
}

describe('m3-react/search', () => {
  test('opens from the bar, edits and submits while keeping the query visible', () => {
    const onSubmit = vi.fn()
    render(<SearchHarness onSubmit={onSubmit} />)
    const trigger = screen.getByRole('button', { name: 'Search messages' })
    trigger.focus()
    fireEvent.click(trigger)

    const dialog = screen.getByRole('dialog', { name: 'Search messages' })
    const input = screen.getByRole('searchbox', { name: 'Search messages' }) as HTMLInputElement
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(document.activeElement).toBe(input)
    expect(screen.getByRole('status').textContent).toBe('2 suggestions')

    fireEvent.change(input, { target: { value: 'plan' } })
    expect(input.value).toBe('plan')
    expect(screen.getByRole('status').textContent).toBe('1 result')
    fireEvent.submit(input.closest('form')!)
    expect(onSubmit).toHaveBeenCalledWith('plan')
    expect(input.value).toBe('plan')
    expect(document.activeElement).toBe(dialog.querySelector('.m3-search__results'))
  })

  test('navigates results, clears input and returns focus after Escape', async () => {
    render(<SearchHarness />)
    const trigger = screen.getByRole('button', { name: 'Search messages' })
    trigger.focus()
    fireEvent.click(trigger)
    const input = screen.getByRole('searchbox', { name: 'Search messages' })

    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'First result' }))
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Second result' }))

    fireEvent.change(input, { target: { value: 'draft' } })
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))
    expect((input as HTMLInputElement).value).toBe('')
    expect(document.activeElement).toBe(input)

    fireEvent.keyDown(input, { key: 'a' })
    expect(document.activeElement).toBe(input)

    fireEvent.keyDown(document, { key: 'Escape' })
    await act(async () => { await Promise.resolve() })
    expect(document.activeElement).toBe(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  test('selects a forced layout and exposes programmatic requests', () => {
    const ref = createRef<M3SearchExposed>()
    const onOpenChange = vi.fn()
    render(
      <M3Search
        ref={ref}
        query=""
        open={true}
        label="Search messages"
        status="No results"
        appearance="divided"
        layout="docked"
        onQueryChange={() => {}}
        onOpenChange={onOpenChange}
      />
    )

    expect(document.querySelector('.m3-search__view_divided.m3-search__view_docked')).not.toBeNull()
    act(() => ref.current?.close())
    act(() => ref.current?.open())
    expect(onOpenChange).toHaveBeenNthCalledWith(1, false)
    expect(onOpenChange).toHaveBeenNthCalledWith(2, true)
  })

  test('focuses the closed trigger and leaves empty results without keyboard focus', () => {
    const ref = createRef<M3SearchExposed>()
    const { rerender } = render(
      <M3Search ref={ref} query="" open={false} label="Search messages" status="No results" onQueryChange={() => {}} onOpenChange={() => {}} />
    )

    act(() => ref.current?.focus())
    const trigger = screen.getByRole('button', { name: 'Search messages' })
    expect(document.activeElement).toBe(trigger)

    rerender(<M3Search ref={ref} query="" label="Search messages" status="No results" open onQueryChange={() => {}} onOpenChange={() => {}} />)
    const input = screen.getByRole('searchbox', { name: 'Search messages' })
    const results = document.querySelector('.m3-search__results') as HTMLElement
    input.focus()
    fireEvent.keyDown(results, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(input)
  })

  test('renders custom controls and lets keyboard navigation move backward through results', () => {
    const ref = createRef<M3SearchExposed>()
    const onOpenChange = vi.fn()
    const onQueryChange = vi.fn()
    render(
      <M3Search
        ref={ref}
        query="plan"
        label="Search messages"
        hint="Find"
        status="2 results"
        layout="docked"
        open
        onQueryChange={onQueryChange}
        onOpenChange={onOpenChange}
      >
        <M3Search.Leading><span>Leading</span></M3Search.Leading>
        <M3Search.Trailing><span>Trailing</span></M3Search.Trailing>
        <M3Search.Actions><button type="button">Filter</button></M3Search.Actions>
        <M3Search.Results>
          <button type="button">First result</button>
          <button type="button">Last result</button>
        </M3Search.Results>
      </M3Search>
    )

    const trigger = screen.getByRole('button', { name: 'Find Search messages' })
    const input = screen.getByRole('searchbox', { name: 'Find Search messages' })
    expect(trigger.textContent).toContain('plan')
    expect(screen.getByText('Leading')).not.toBeNull()
    expect(screen.getByText('Trailing')).not.toBeNull()
    expect(screen.getByRole('button', { name: 'Filter' })).not.toBeNull()
    act(() => ref.current?.focus())
    expect(document.activeElement).toBe(input)

    fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Last result' }))
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'First result' }))
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Last result' }))
    fireEvent.keyDown(document.activeElement!, { key: 'Enter' })

    fireEvent.click(document.querySelector('.m3-search__scrim')!)
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(onQueryChange).not.toHaveBeenCalled()
  })
})
