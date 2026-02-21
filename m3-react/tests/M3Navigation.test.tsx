import {
  act,
  fireEvent,
  render,
  screen,
} from '@testing-library/react'

import {
  M3Navigation,
  M3NavigationSection,
  M3NavigationTab,
} from '@/components/navigation'

describe('m3-react/navigation', () => {
  test('renders slots and closes by scrim click', () => {
    const onToggle = vi.fn()

    render(
      <M3Navigation expanded={true} onToggle={onToggle}>
        <M3Navigation.Top>Top</M3Navigation.Top>
        <M3Navigation.Header>Header</M3Navigation.Header>
        <M3Navigation.Subheader>Subheader</M3Navigation.Subheader>

        <M3NavigationTab label="Home" />

        <M3NavigationSection>
          <M3NavigationSection.Header>Section header</M3NavigationSection.Header>
          <M3NavigationTab label="Settings" />
        </M3NavigationSection>
      </M3Navigation>
    )

    expect(screen.getByText('Top')).not.toBeNull()
    expect(screen.getByText('Header')).not.toBeNull()
    expect(screen.getByText('Subheader')).not.toBeNull()
    expect(screen.getByText('Section header')).not.toBeNull()

    const scrim = document.body.querySelector('.m3-scrim') as HTMLElement

    fireEvent.click(scrim)

    expect(onToggle).toHaveBeenCalledWith(false)
  })

  test('requests collapsing in auto mode after resize to large breakpoint', () => {
    const onToggle = vi.fn()
    const initialWidth = window.innerWidth

    render(
      <M3Navigation
        appearance="auto"
        expanded={true}
        onToggle={onToggle}
      >
        <M3NavigationTab label="Home" />
      </M3Navigation>
    )

    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        writable: true,
        value: 1700,
      })

      window.dispatchEvent(new Event('resize'))
    })

    expect(onToggle).toHaveBeenCalledWith(false)

    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: initialWidth,
    })
  })
})
