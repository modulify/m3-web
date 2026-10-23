import { act, render, screen } from '@testing-library/react'

import { M3Select } from '@/components/select'

test.each(['ltr', 'rtl'] as const)('aligns the exposed menu with a wide text field in %s', async (direction) => {
  const view = render(
    <div dir={direction} style={{ padding: '24px' }}>
      <M3Select
        label="Status"
        style={{ width: '360px' }}
        options={[{ value: 'draft', label: 'Draft' }]}
      />
    </div>
  )

  try {
    const field = screen.getByRole('combobox', { name: 'Status' })
    const fieldContainer = field.closest<HTMLElement>('.m3-select__field')!
    await act(async () => field.click())

    const menu = await vi.waitFor(() => {
      const element = document.querySelector<HTMLElement>('.m3-select__menu.m3-popper_shown')
      expect(element).not.toBeNull()
      return element!
    })
    const fieldRect = fieldContainer.getBoundingClientRect()
    const menuRect = menu.getBoundingClientRect()

    expect(menuRect.width).toBeCloseTo(fieldRect.width, 0)
    expect(menuRect.top).toBeGreaterThanOrEqual(fieldRect.bottom - 1)
    expect(direction === 'ltr' ? menuRect.left : menuRect.right)
      .toBeCloseTo(direction === 'ltr' ? fieldRect.left : fieldRect.right, 0)
  } finally {
    view.unmount()
  }
})

test('scrolls long menus without changing the first item shape', async () => {
  const options = Array.from({ length: 12 }, (_, index) => ({ value: index, label: `Option ${index + 1}` }))
  const view = render(<M3Select label="Choice" options={options} />)

  try {
    await act(async () => screen.getByRole('combobox', { name: 'Choice' }).click())
    const menu = await vi.waitFor(() => {
      const element = document.querySelector<HTMLElement>('.m3-select__menu.m3-popper_shown')
      expect(element).not.toBeNull()
      return element!
    })
    const first = menu.querySelector<HTMLElement>('.m3-menu-item')!

    expect(getComputedStyle(first).borderTopLeftRadius).toBe('12px')
    expect(getComputedStyle(menu).paddingInlineEnd).toBe('4px')
    expect(first.parentElement).toBe(menu)
    expect(menu.scrollHeight).toBeGreaterThan(menu.clientHeight)
    expect(menu.querySelector('.m3-scroll-rail')).toBeNull()
    menu.scrollTop = menu.scrollHeight
    expect(menu.scrollTop).toBeGreaterThan(0)
  } finally {
    view.unmount()
  }
})
