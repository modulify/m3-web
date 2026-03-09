import {
  fireEvent,
  render,
  screen,
} from '@testing-library/vue'

import { M3Chip } from '@/components/chip'

describe('m3-vue/chip', () => {
  test('toggles selected state for filter chips via aria-pressed', async () => {
    const view = render(M3Chip, {
      props: {
        variant: 'filter',
        selected: false,
      },
      slots: {
        default: 'Updates',
      },
    })

    const button = screen.getByRole('button', { name: 'Updates' })

    expect(button.getAttribute('aria-pressed')).toBe('false')

    await fireEvent.click(button)

    expect(view.emitted().toggle?.[0]).toEqual([true])
    expect(view.emitted()['update:selected']?.[0]).toEqual([true])
  })

  test('renders dismiss affordance independently from the main action', async () => {
    const view = render(M3Chip, {
      props: {
        variant: 'input',
        dismissible: true,
      },
      slots: {
        default: 'Project Alpha',
      },
    })

    const dismiss = screen.getByRole('button', { name: 'Remove' })

    await fireEvent.click(dismiss)

    expect(view.emitted().dismiss?.length).toBe(1)
    expect(view.emitted().click).toBeUndefined()
  })

  test('shows selection icon for selected filter chips without a leading icon', () => {
    const { container } = render(M3Chip, {
      props: {
        variant: 'filter',
        selected: true,
      },
      slots: {
        default: 'Assigned to me',
      },
    })

    expect(container.querySelector('.m3-chip__icon_selection')).not.toBeNull()
  })
})
