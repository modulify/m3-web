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
})
