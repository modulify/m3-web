import type { ElementReference, Interactable } from '@modulify/m3-foundation/types/dom'

import { defineComponent } from 'vue'
import { fireEvent } from '@testing-library/vue'
import { h, ref } from 'vue'
import { render, screen } from '@testing-library/vue'

import { M3Chip } from '@/components/chip'
import { M3Icon } from '@/components/icon'

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

    expect(view.container.textContent).toBe('Updates')
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

  test('uses a supplied leading icon instead of the filter checkmark', () => {
    const { container } = render(M3Chip, {
      props: {
        variant: 'filter',
        selected: true,
      },
      slots: {
        default: () => [h(M3Icon, { name: 'favorite', 'aria-hidden': 'true' }), 'Favorites'],
      },
    })

    expect(container.querySelector('.m3-chip_has-leading-icon')).not.toBeNull()
    expect(container.querySelector('.m3-chip__icon_selection')).toBeNull()
    expect(screen.getByRole('button', { name: 'Favorites' }).getAttribute('aria-pressed')).toBe('true')
  })

  test('keeps trailing icon and dismissal disabled with the chip', async () => {
    const view = render(M3Chip, {
      props: {
        variant: 'input',
        disabled: true,
        dismissible: true,
        dismissLabel: 'Remove tag',
      },
      slots: {
        default: () => ['Priority', h(M3Icon, { name: 'label', 'aria-hidden': 'true' })],
      },
    })

    expect(view.container.querySelector('.m3-chip_has-trailing-icon')).not.toBeNull()
    expect(screen.getByRole('button', { name: 'Priority' }).hasAttribute('disabled')).toBe(true)
    expect(screen.getByRole('button', { name: 'Remove tag' }).hasAttribute('disabled')).toBe(true)

    await fireEvent.click(screen.getByRole('button', { name: 'Priority' }))
    expect(view.emitted().toggle).toBeUndefined()
    expect(view.emitted().dismiss).toBeUndefined()
  })

  test('emits an action click without toggling a non-filter chip', async () => {
    const view = render(M3Chip, {
      props: {
        variant: 'assist',
        showCheckmark: false,
      },
      slots: {
        default: 'Get directions',
      },
    })

    await fireEvent.click(screen.getByRole('button', { name: 'Get directions' }))

    expect(view.emitted().click).toHaveLength(1)
    expect(view.emitted().toggle).toBeUndefined()
  })

  test('lets the click listener prevent a filter chip from toggling', async () => {
    const onClick = vi.fn((event: MouseEvent) => event.preventDefault())
    const onToggle = vi.fn()

    render(M3Chip, {
      props: { variant: 'filter', onClick, onToggle },
      slots: { default: 'Pinned' },
    })

    await fireEvent.click(screen.getByRole('button', { name: 'Pinned' }))
    expect(onClick).toHaveBeenCalledOnce()
    expect(onToggle).not.toHaveBeenCalled()
  })

  test('exposes click and focus controls through the chip action', () => {
    const chip = ref<(ElementReference<HTMLSpanElement> & Interactable) | null>(null)
    const onClick = vi.fn()
    const Harness = defineComponent({
      setup: () => () => h(M3Chip, { ref: chip, onClick }, { default: () => 'Pinned' }),
    })
    render(Harness)

    const button = screen.getByRole('button', { name: 'Pinned' })
    expect(chip.value?.el?.contains(button)).toBe(true)
    chip.value?.focus()
    expect(document.activeElement).toBe(button)
    chip.value?.blur()
    expect(document.activeElement).not.toBe(button)
    chip.value?.click()
    expect(onClick).toHaveBeenCalledOnce()
  })
})
