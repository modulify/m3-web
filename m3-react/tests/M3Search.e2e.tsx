import { act, fireEvent } from '@testing-library/react'
import { page } from 'vitest/browser'
import { render, screen } from '@testing-library/react'
import { useState } from 'react'
import { waitFor } from '@testing-library/react'

import { M3Search } from '@/components/search'

const SearchHarness = () => {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  return <M3Search
    query={query}
    open={open}
    label="Search messages"
    status="Results"
    onQueryChange={setQuery}
    onOpenChange={setOpen}
  />
}

test('adapts an open search without losing the query or overflowing the viewport', async () => {
  await page.viewport(390, 760)
  const view = render(<SearchHarness />)

  try {
    fireEvent.click(screen.getByRole('button', { name: 'Search messages' }))
    const input = screen.getByRole('searchbox', { name: 'Search messages' }) as HTMLInputElement
    fireEvent.change(input, { target: { value: 'notes' } })

    const dialog = screen.getByRole('dialog', { name: 'Search messages' })
    expect(dialog.classList.contains('m3-search__view_full-screen')).toBe(true)
    expect(getComputedStyle(document.querySelector('.m3-search__bar')!).visibility).toBe('hidden')
    expect(dialog.offsetWidth).toBe(390)
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(390)

    await act(async () => { await page.viewport(900, 760) })
    await waitFor(() => expect(dialog.classList.contains('m3-search__view_docked')).toBe(true))
    const docked = dialog.getBoundingClientRect()
    expect(docked.width).toBeLessThanOrEqual(720)
    expect(docked.left).toBeGreaterThanOrEqual(12)
    expect(docked.right).toBeLessThanOrEqual(888)
    expect(input.value).toBe('notes')
    expect(document.activeElement).toBe(input)
  } finally {
    view.unmount()
  }
})
