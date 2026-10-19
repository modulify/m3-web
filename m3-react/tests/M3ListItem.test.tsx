import { fireEvent, render, screen } from '@testing-library/react'

import { M3ListItem } from '@/components/list'

describe('m3-react/list-item', () => {
  test('renders a three-line navigation row with leading and trailing content', () => {
    const onClick = vi.fn((event: { preventDefault(): void }) => event.preventDefault())
    const onKeyUp = vi.fn()
    const { container } = render(
      <M3ListItem href="/inbox" overline="Mail" headline="Inbox" supportingText="24 unread" selected onClick={onClick} onKeyUp={onKeyUp}>
        <M3ListItem.Leading><span>Icon</span></M3ListItem.Leading>
        <M3ListItem.Trailing><span>24</span></M3ListItem.Trailing>
      </M3ListItem>
    )
    const link = screen.getByRole('link', { name: /Inbox/ })
    const item = container.querySelector('.m3-list-item') as HTMLElement
    expect(item.classList.contains('m3-list-item_multiline')).toBe(true)
    expect(item.classList.contains('m3-list-item_selected')).toBe(true)
    expect(item.style.getPropertyValue('--m3-list-item-supporting-lines')).toBe('2')
    expect(container.querySelector('.m3-list-item__leading')).not.toBeNull()
    expect(container.querySelector('.m3-list-item__trailing')).not.toBeNull()
    fireEvent.click(link)
    fireEvent.keyUp(link, { code: 'Enter' })
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onKeyUp).toHaveBeenCalledTimes(1)
  })

  test('disables a destination without leaving an activatable href', () => {
    const onClick = vi.fn()
    const { container } = render(<M3ListItem href="/admin" headline="Admin" disabled onClick={onClick} />)
    const anchor = container.querySelector('a') as HTMLAnchorElement
    expect(anchor.getAttribute('href')).toBeNull()
    expect(anchor.getAttribute('aria-disabled')).toBe('true')
    expect(anchor.tabIndex).toBe(-1)
    expect(fireEvent.click(anchor)).toBe(false)
    expect(onClick).not.toHaveBeenCalled()
  })

  test('uses a button for interactive actions and allows slot-based supporting text', () => {
    const onClick = vi.fn()
    const { container } = render(
      <M3ListItem type="submit" lines={2} interactive onClick={onClick}>
        <M3ListItem.Headline>Save draft</M3ListItem.Headline>
        <M3ListItem.SupportingText>Keep working later</M3ListItem.SupportingText>
      </M3ListItem>
    )
    const button = screen.getByRole('button', { name: /Save draft/ }) as HTMLButtonElement
    expect(button.type).toBe('submit')
    expect(container.querySelector('.m3-list-item__supporting-text')).not.toBeNull()
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test('keeps a plain row non-interactive and uses content as its headline', () => {
    const { container } = render(
      // @ts-expect-error JavaScript consumers can supply an unsupported line count.
      <M3ListItem lines={5}>Plain content</M3ListItem>
    )
    expect(container.querySelector('button, a')).toBeNull()
    expect(container.querySelector('.m3-list-item__headline')?.textContent).toBe('Plain content')
    expect(container.querySelector('.m3-list-item_multiline')).toBeNull()
  })
})
