import { fireEvent, render, screen } from '@testing-library/react'

import { M3Chip } from '@/components/chip'
import { M3Icon } from '@/components/icon'

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

  test('uses a supplied leading icon instead of the filter checkmark', () => {
    const onClick = vi.fn(event => event.preventDefault())
    const onToggle = vi.fn()
    const { container } = render(
      <M3Chip variant="filter" aria-label="Assigned" selected showCheckmark onClick={onClick} onToggle={onToggle}>
        <M3Icon name="person" />
        Assigned
      </M3Chip>
    )
    expect(container.querySelector('.m3-chip_has-leading-icon')).not.toBeNull()
    expect(container.querySelector('.m3-chip__icon_selection')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Assigned' }))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onToggle).not.toHaveBeenCalled()
  })

  test('supports a custom dismiss label and keyboard activation of both actions', () => {
    const onDismiss = vi.fn()
    const onToggle = vi.fn()
    const { container } = render(
      <M3Chip variant="filter" aria-label="Filter" dismissLabel="Remove filter" selected onDismiss={onDismiss} onToggle={onToggle}>
        Filter
      </M3Chip>
    )

    fireEvent.keyUp(screen.getByRole('button', { name: 'Filter' }), { code: 'Enter' })
    const dismiss = screen.getByRole('button', { name: 'Remove filter' })
    fireEvent.keyUp(dismiss, { code: 'Enter' })
    fireEvent.click(dismiss)
    expect(onDismiss).toHaveBeenCalledTimes(1)
    expect(onToggle).not.toHaveBeenCalled()
    expect(container.querySelector('.m3-chip_dismissible')).not.toBeNull()
  })
})
