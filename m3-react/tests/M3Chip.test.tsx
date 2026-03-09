import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react'

import { M3Chip } from '@/components/chip'

describe('m3-react/chip', () => {
  test('toggles selected state for filter chips via aria-pressed', () => {
    const onToggle = vi.fn()

    render(
      <M3Chip variant="filter" selected={false} onToggle={onToggle}>
        Updates
      </M3Chip>
    )

    const button = screen.getByRole('button', { name: 'Updates' })

    expect(button.getAttribute('aria-pressed')).toBe('false')

    fireEvent.click(button)

    expect(onToggle).toHaveBeenCalledWith(true)
  })

  test('renders dismiss affordance independently from the main action', () => {
    const onClick = vi.fn()
    const onDismiss = vi.fn()

    render(
      <M3Chip
        variant="input"
        dismissible={true}
        onClick={onClick}
        onDismiss={onDismiss}
      >
        Project Alpha
      </M3Chip>
    )

    const dismiss = screen.getByRole('button', { name: 'Remove' })

    fireEvent.click(dismiss)

    expect(onDismiss).toHaveBeenCalledTimes(1)
    expect(onClick).not.toHaveBeenCalled()
  })

  test('shows selection icon for selected filter chips without a leading icon', () => {
    const { container } = render(
      <M3Chip variant="filter" selected={true}>
        Assigned to me
      </M3Chip>
    )

    expect(container.querySelector('.m3-chip__icon_selection')).not.toBeNull()
  })
})
