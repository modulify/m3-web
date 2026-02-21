import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react'

import { M3Icon } from '@/components/icon'
import { M3NavigationTab } from '@/components/navigation'

describe('m3-react/navigation-tab', () => {
  test('renders active tab with filled icon and badge', () => {
    const { container } = render(
      <M3NavigationTab active={true} label="Inbox" badged={true}>
        <M3NavigationTab.Icon>
          <M3Icon name="mail" />
        </M3NavigationTab.Icon>
      </M3NavigationTab>
    )

    const root = container.querySelector('.m3-navigation-tab') as HTMLElement
    const icon = container.querySelector('.m3-icon') as HTMLElement
    const badge = container.querySelector('.m3-navigation-tab__badge') as HTMLElement

    expect(root.classList.contains('m3-navigation-tab_active')).toBe(true)
    expect(icon.classList.contains('m3-icon_filled')).toBe(true)
    expect(root.getAttribute('aria-labelledby')).toContain('-label-for-rail')
    expect(badge).not.toBeNull()
  })

  test('fires onNavigate on click', () => {
    const onNavigate = vi.fn()

    render(
      <M3NavigationTab label="Inbox" onNavigate={onNavigate}>
        <M3NavigationTab.Icon>
          <M3Icon name="mail" />
        </M3NavigationTab.Icon>
      </M3NavigationTab>
    )

    fireEvent.click(screen.getByRole('button'))

    expect(onNavigate).toHaveBeenCalledTimes(1)
  })

  test('respects explicit aria-label over generated aria-labelledby', () => {
    const { container } = render(
      <M3NavigationTab
        label="Inbox"
        aria-label="Custom tab label"
      />
    )

    const root = container.querySelector('.m3-navigation-tab') as HTMLElement

    expect(root.getAttribute('aria-label')).toBe('Custom tab label')
    expect(root.getAttribute('aria-labelledby')).toBeNull()
  })
})
