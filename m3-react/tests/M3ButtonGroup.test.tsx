import { fireEvent, render, screen } from '@testing-library/react'

import { M3ButtonGroup, M3ButtonGroupItem } from '@/components/button-group'
import { M3Icon } from '@/components/icon'

describe('m3-react/button-group', () => {
  test('keeps one tab stop and moves it with arrow focus', () => {
    render(
      <M3ButtonGroup variant="connected" defaultValue="two">
        <M3ButtonGroupItem value="one">One</M3ButtonGroupItem>
        <M3ButtonGroupItem value="two">Two</M3ButtonGroupItem>
        <M3ButtonGroupItem value="three">Three</M3ButtonGroupItem>
      </M3ButtonGroup>
    )

    const one = screen.getByRole('button', { name: 'One' })
    const two = screen.getByRole('button', { name: 'Two' })
    const three = screen.getByRole('button', { name: 'Three' })
    expect([one.tabIndex, two.tabIndex, three.tabIndex]).toEqual([-1, 0, -1])
    two.focus()
    fireEvent.keyDown(two, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(three)
    expect([one.tabIndex, two.tabIndex, three.tabIndex]).toEqual([-1, -1, 0])
  })

  test('connected single selection updates pressed state and can require a choice', () => {
    const onChange = vi.fn()
    render(
      <M3ButtonGroup variant="connected" defaultValue="day" aria-label="View" required onChange={onChange}>
        <M3ButtonGroupItem value="day">Day</M3ButtonGroupItem>
        <M3ButtonGroupItem value="week">Week</M3ButtonGroupItem>
      </M3ButtonGroup>
    )

    const day = screen.getByRole('button', { name: 'Day' })
    const week = screen.getByRole('button', { name: 'Week' })
    expect(day.getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('group', { name: 'View' })).toBeTruthy()

    fireEvent.click(week)
    expect(onChange).toHaveBeenCalledWith('week')
    expect(week.getAttribute('aria-pressed')).toBe('true')

    fireEvent.click(week)
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  test('multiple selection can clear when not required and respects disabled buttons', () => {
    const onChange = vi.fn()
    render(
      <M3ButtonGroup variant="connected" selection="multiple" defaultValue={['bold']} onChange={onChange}>
        <M3ButtonGroupItem value="bold">Bold</M3ButtonGroupItem>
        <M3ButtonGroupItem value="italic">Italic</M3ButtonGroupItem>
        <M3ButtonGroupItem value="underline" disabled>Underline</M3ButtonGroupItem>
      </M3ButtonGroup>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Italic' }))
    expect(onChange).toHaveBeenLastCalledWith(['bold', 'italic'])
    fireEvent.click(screen.getByRole('button', { name: 'Bold' }))
    expect(onChange).toHaveBeenLastCalledWith(['italic'])
    fireEvent.click(screen.getByRole('button', { name: 'Underline' }))
    expect(onChange).toHaveBeenCalledTimes(2)
  })

  test('standard action group leaves pressed state unset and supports arrow focus', () => {
    const onClick = vi.fn()
    render(
      <M3ButtonGroup size="md" rounding="square">
        <M3ButtonGroupItem value="copy" onClick={onClick}>Copy</M3ButtonGroupItem>
        <M3ButtonGroupItem value="paste" disabled>Paste</M3ButtonGroupItem>
        <M3ButtonGroupItem value="share">Share</M3ButtonGroupItem>
      </M3ButtonGroup>
    )

    const copy = screen.getByRole('button', { name: 'Copy' })
    const share = screen.getByRole('button', { name: 'Share' })
    expect(copy.hasAttribute('aria-pressed')).toBe(false)
    expect(screen.getByRole('group').classList.contains('m3-button-group_md')).toBe(true)

    copy.focus()
    fireEvent.keyDown(copy, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(share)
    fireEvent.click(copy)
    expect(onClick).toHaveBeenCalledOnce()
  })

  test('connected action group has no toggle state', () => {
    const onClick = vi.fn()
    const onChange = vi.fn()
    render(
      <M3ButtonGroup variant="connected" selection="none" onChange={onChange}>
        <M3ButtonGroupItem value="copy" onClick={onClick}>Copy</M3ButtonGroupItem>
        <M3ButtonGroupItem value="share">Share</M3ButtonGroupItem>
      </M3ButtonGroup>
    )

    expect(screen.getByRole('group').classList.contains('m3-button-group_connected')).toBe(true)
    expect(screen.getByRole('button', { name: 'Copy' }).hasAttribute('aria-pressed')).toBe(false)
    expect(screen.getByRole('button', { name: 'Share' }).hasAttribute('aria-pressed')).toBe(false)

    fireEvent.click(screen.getByRole('button', { name: 'Copy' }))
    expect(onClick).toHaveBeenCalledOnce()
    expect(onChange).not.toHaveBeenCalled()
  })

  test('inherits group size and lets standard items opt into a different size', () => {
    const items = (size: 'md' | 'lg') => (
      <M3ButtonGroup size={size}>
        <M3ButtonGroupItem value="save">Save</M3ButtonGroupItem>
        <M3ButtonGroupItem value="more" kind="icon" aria-label="More"><M3Icon name="more_vert" /></M3ButtonGroupItem>
        <M3ButtonGroupItem value="small" size="sm">Small</M3ButtonGroupItem>
      </M3ButtonGroup>
    )
    const view = render(items('md'))

    expect(screen.getByRole('button', { name: 'Save' }).classList.contains('m3-button_md')).toBe(true)
    expect(screen.getByRole('button', { name: 'More' }).classList.contains('m3-button_md')).toBe(true)
    expect(screen.getByRole('button', { name: 'Small' }).classList.contains('m3-button_md')).toBe(false)
    expect(screen.getByRole('button', { name: 'Small' }).parentElement?.classList.contains('m3-button-group__wrapper_sm')).toBe(true)

    view.rerender(items('lg'))
    expect(screen.getByRole('button', { name: 'Save' }).classList.contains('m3-button_lg')).toBe(true)
    expect(screen.getByRole('button', { name: 'More' }).classList.contains('m3-button_lg')).toBe(true)
    expect(screen.getByRole('button', { name: 'Small' }).classList.contains('m3-button_lg')).toBe(false)
  })

  test('controlled value emits changes without mutating its own selection', () => {
    const onChange = vi.fn()
    render(
      <M3ButtonGroup variant="connected" value="one" onChange={onChange}>
        <M3ButtonGroupItem value="one">One</M3ButtonGroupItem>
        <M3ButtonGroupItem value="two">Two</M3ButtonGroupItem>
      </M3ButtonGroup>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Two' }))
    expect(onChange).toHaveBeenCalledWith('two')
    expect(screen.getByRole('button', { name: 'One' }).getAttribute('aria-pressed')).toBe('true')
  })

  test('right arrow moves backward in RTL and skips disabled items', () => {
    render(
      <M3ButtonGroup variant="connected" dir="rtl">
        <M3ButtonGroupItem value="one">One</M3ButtonGroupItem>
        <M3ButtonGroupItem value="two" disabled>Two</M3ButtonGroupItem>
        <M3ButtonGroupItem value="three">Three</M3ButtonGroupItem>
      </M3ButtonGroup>
    )

    const one = screen.getByRole('button', { name: 'One' })
    const three = screen.getByRole('button', { name: 'Three' })
    one.focus()
    fireEvent.keyDown(one, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(three)
    fireEvent.keyDown(three, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(one)
    fireEvent.keyDown(one, { key: 'ArrowUp' })
    expect(document.activeElement).toBe(three)
    fireEvent.keyDown(three, { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(one)
    fireEvent.keyDown(one, { key: 'Enter' })
    expect(document.activeElement).toBe(one)
  })

  test('required multiple selection retains its last selected item', () => {
    const onChange = vi.fn()
    render(
      <M3ButtonGroup variant="connected" selection="multiple" defaultValue={['one']} required onChange={onChange}>
        <M3ButtonGroupItem value="one">One</M3ButtonGroupItem>
        <M3ButtonGroupItem value="two">Two</M3ButtonGroupItem>
      </M3ButtonGroup>
    )

    fireEvent.click(screen.getByRole('button', { name: 'One' }))
    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'One' }).getAttribute('aria-pressed')).toBe('true')
  })

  test('optional single selection can clear and an empty multiple selection can start', () => {
    const onSingleChange = vi.fn()
    const { rerender } = render(
      <M3ButtonGroup variant="connected" defaultValue="one" onChange={onSingleChange}>
        <M3ButtonGroupItem value="one">One</M3ButtonGroupItem>
      </M3ButtonGroup>
    )

    fireEvent.click(screen.getByRole('button', { name: 'One' }))
    expect(onSingleChange).toHaveBeenCalledWith(null)
    expect(screen.getByRole('button', { name: 'One' }).getAttribute('aria-pressed')).toBe('false')

    const onMultipleChange = vi.fn()
    rerender(
      <M3ButtonGroup variant="connected" selection="multiple" onChange={onMultipleChange}>
        <M3ButtonGroupItem value="one">One</M3ButtonGroupItem>
      </M3ButtonGroup>
    )
    fireEvent.click(screen.getByRole('button', { name: 'One' }))
    expect(onMultipleChange).toHaveBeenCalledWith(['one'])
  })

  test('an item click handler can cancel a selection change', () => {
    const onChange = vi.fn()
    render(
      <M3ButtonGroup variant="connected" onChange={onChange}>
        <M3ButtonGroupItem value="one" onClick={event => event.preventDefault()}>One</M3ButtonGroupItem>
      </M3ButtonGroup>
    )

    fireEvent.click(screen.getByRole('button', { name: 'One' }))
    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'One' }).getAttribute('aria-pressed')).toBe('false')
  })

  test('icons and text use separate button content wrappers', () => {
    render(
      <M3ButtonGroup>
        <M3ButtonGroupItem value="save"><svg aria-hidden="true" />Save</M3ButtonGroupItem>
      </M3ButtonGroup>
    )

    const button = screen.getByRole('button', { name: 'Save' })
    expect(button.querySelector('.m3-button__icon svg')).toBeTruthy()
    expect(button.querySelector('.m3-button__text')?.textContent).toBe('Save')
    expect(button.querySelector(':scope > .m3-button__ripple > .m3-ripple')).toBeTruthy()
    expect(button.querySelector(':scope > .m3-button__state')).toBeTruthy()
  })

  test('detects an icon-only item and fills its icon only while selected', () => {
    render(
      <M3ButtonGroup selection="single">
        <M3ButtonGroupItem value="more" aria-label="More"><M3Icon name="more_vert" /></M3ButtonGroupItem>
      </M3ButtonGroup>
    )

    const button = screen.getByRole('button', { name: 'More' })
    expect(button.classList.contains('m3-button-group__item_icon-only')).toBe(true)
    expect(button.querySelector('.m3-icon_outlined')).toBeTruthy()
    fireEvent.click(button)
    expect(button.querySelector('.m3-icon_filled')).toBeTruthy()
  })
})
