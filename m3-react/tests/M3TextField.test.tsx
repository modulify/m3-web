import { fireEvent, render, screen } from '@testing-library/react'

import { M3TextField, M3TextFieldSupportText } from '@/components/text-field'

describe('m3-react/text-field', () => {
  test('labels the input and keeps the visual wrapper semantically neutral', () => {
    const { container } = render(<M3TextField label="Email" />)

    const input = screen.getByRole('textbox', { name: 'Email' })
    const root = container.querySelector('.m3-text-field')

    expect(input).not.toBeNull()
    expect(root?.getAttribute('role')).toBeNull()
  })

  test('combines an external accessible name with the visible label', () => {
    render(
      <>
        <span id="section-heading">Account</span>
        <M3TextField label="Email" aria-labelledby="section-heading" />
      </>
    )

    const input = screen.getByRole('textbox', { name: 'Account Email' })

    expect(input.getAttribute('aria-labelledby')).toMatch(/^section-heading .+-label$/)
  })

  test('uses an external accessible name when no visible label is supplied', () => {
    render(<><span id="standalone-label">Account ID</span><M3TextField aria-labelledby="standalone-label" /></>)
    const input = screen.getByRole('textbox', { name: 'Account ID' })
    expect(input.getAttribute('aria-labelledby')).toBe('standalone-label')
  })

  test('supports outlined multiline input, slots, focus, and updates', () => {
    const onInput = vi.fn()
    const onChange = vi.fn()
    const onUpdate = vi.fn()
    const onClick = vi.fn()
    const { container } = render(
      <M3TextField
        id="message"
        name="message"
        value="Draft"
        aria-describedby="hint"
        multiline
        outlined
        invalid
        onInput={onInput}
        onChange={onChange}
        onUpdate={onUpdate}
        onClick={onClick}
      >
        <M3TextField.Label>Message</M3TextField.Label>
        <M3TextField.LeadingIcon><span>Leading</span></M3TextField.LeadingIcon>
        <M3TextField.TrailingIcon><span>Trailing</span></M3TextField.TrailingIcon>
      </M3TextField>
    )
    const field = screen.getByRole('textbox', { name: 'Message' }) as HTMLTextAreaElement
    expect(field.tagName).toBe('TEXTAREA')
    expect(field.value).toBe('Draft')
    expect(field.getAttribute('aria-invalid')).toBe('true')
    expect(field.getAttribute('aria-describedby')).toBe('hint')
    expect(container.querySelector('.m3-text-field_outlined')).not.toBeNull()

    fireEvent.click(container.querySelector('.m3-text-field')!)
    expect(document.activeElement).toBe(field)
    expect(onClick).toHaveBeenCalledTimes(1)
    fireEvent.input(field, { target: { value: 'Updated' } })
    expect(onInput).toHaveBeenCalledWith('Updated')
    expect(onUpdate).toHaveBeenCalledWith('Updated')
    fireEvent.change(field, { target: { value: 'Final' } })
    expect(onChange).toHaveBeenCalledWith('Final')
    expect(onUpdate).toHaveBeenCalledTimes(1)
  })

  test('updates on each input in non-lazy mode and preserves numeric input semantics', () => {
    const onUpdate = vi.fn()
    render(<M3TextField type="number" value={12} aria-label="Amount" onUpdate={onUpdate} />)
    const field = screen.getByRole('textbox', { name: 'Amount' }) as HTMLInputElement
    expect(field.type).toBe('text')
    expect(field.value).toBe('12')
    fireEvent.input(field, { target: { value: '13' } })
    expect(onUpdate).toHaveBeenCalledWith('13')
  })

  test('renders an outlined field without a visual label when it has an accessible name', () => {
    const { container } = render(<M3TextField aria-label="Reference" outlined />)
    expect(screen.getByRole('textbox', { name: 'Reference' })).toBeTruthy()
    expect(container.querySelector('.m3-text-field__label')).toBeNull()
  })

  test('renders danger and muted support text with custom content', () => {
    const { container } = render(
      <M3TextFieldSupportText text="Fallback" className="custom-hint" role="alert" danger muted>
        The value is unavailable
      </M3TextFieldSupportText>
    )
    const hint = screen.getByRole('alert')
    expect(hint.textContent).toBe('The value is unavailable')
    expect(hint.classList.contains('m3-text-field-support-text_danger')).toBe(true)
    expect(hint.classList.contains('m3-text-field-support-text_muted')).toBe(true)
    expect(container.querySelector('.custom-hint')).toBe(hint)
  })

  test('uses neutral defaults for plain supporting text', () => {
    const { container } = render(<><M3TextFieldSupportText text="Optional hint" /><M3TextFieldSupportText /></>)
    const hints = container.querySelectorAll('.m3-text-field-support-text')
    expect(hints[0].textContent).toBe('Optional hint')
    expect(hints[0].classList.contains('m3-text-field-support-text_danger')).toBe(false)
    expect(hints[1].textContent).toBe('')
  })
})
