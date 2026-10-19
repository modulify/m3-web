import { fireEvent, render, screen } from '@testing-library/react'

import { M3Select } from '@/components/select'

describe('m3-react/select', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  test('puts the combobox contract on the focusable input', () => {
    const { container } = render(<M3Select label="Status" />)

    const combobox = screen.getByRole('combobox', { name: 'Status' })
    const root = container.querySelector('.m3-select')

    expect(combobox.tagName).toBe('INPUT')
    expect(combobox.getAttribute('aria-controls')).toMatch(/-menu$/)
    expect(combobox.getAttribute('aria-expanded')).toBe('false')
    expect(root?.getAttribute('role')).toBeNull()
  })

  test('renders selected values and custom option content while respecting readonly and disabled states', async () => {
    vi.stubGlobal('ResizeObserver', class {
      observe() {}
      disconnect() {}
    })
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(240)
    const options = [
      { value: { id: 1 }, label: 'Draft' },
      { value: { id: 2 }, label: 'Published' },
    ]
    const onUpdate = vi.fn()
    const { container, rerender } = render(
      <M3Select
        id="status"
        label="Status"
        value={{ id: 2 }}
        options={options}
        equalPredicate={(left, right) => left?.id === right?.id}
        outlined
        invalid
        onUpdate={onUpdate}
      >
        <M3Select.Leading>{({ active }: { active: boolean }) => active ? 'Open' : 'Closed'}</M3Select.Leading>
        <M3Select.OptionLeading>{({ option }: { option: { label: string } }) => option.label[0]}</M3Select.OptionLeading>
        <M3Select.OptionContent>{({ option }: { option: { label: string } }) => `${option.label} item`}</M3Select.OptionContent>
      </M3Select>
    )

    const input = screen.getByRole('combobox', { name: 'Status' }) as HTMLInputElement
    expect(input.value).toBe('Published')
    expect(input.getAttribute('aria-controls')).toBe('status-menu')
    expect(container.textContent).toContain('Closed')

    fireEvent.click(input)
    expect(await screen.findByText('Draft item')).not.toBeNull()
    expect(screen.getByText('Published item')).not.toBeNull()
    fireEvent.click(screen.getByText('Draft item'))
    expect(onUpdate).toHaveBeenCalledWith(options[0].value)

    rerender(<M3Select label="Status" options={options} readonly />)
    expect(input.getAttribute('aria-readonly')).toBe('true')
    expect(input.value).toBe('')

    rerender(<M3Select label="Status" options={options} disabled />)
    expect(input.getAttribute('aria-disabled')).toBe('true')
    expect(input.hasAttribute('disabled')).toBe(true)
    expect(onUpdate).toHaveBeenCalledTimes(1)
  })
})
