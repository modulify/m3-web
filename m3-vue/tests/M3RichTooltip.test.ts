import { render, waitFor } from '@testing-library/vue'

import { M3RichTooltip } from '@/components/rich-tooltip'

describe('m3-vue/rich-tooltip', () => {
  let target: HTMLButtonElement

  beforeEach(() => {
    target = document.createElement('button')
    document.body.append(target)
  })

  afterEach(() => target.remove())

  test('uses the tooltip role for explanatory content', async () => {
    const view = render(M3RichTooltip, {
      props: {
        target: () => target,
        shown: true,
        detachTimeout: null,
        class: 'shortcut-hint',
      },
      slots: {
        default: 'Press Ctrl+K to search',
      },
    })

    try {
      await waitFor(() => {
        const tooltip = document.querySelector<HTMLElement>('.m3-rich-tooltip')

        expect(tooltip?.getAttribute('role')).toBe('tooltip')
        expect(tooltip?.classList.contains('shortcut-hint')).toBe(true)
        expect(tooltip?.textContent).toContain('Press Ctrl+K to search')
        expect(tooltip?.querySelector('.m3-rich-tooltip__footer')).toBeNull()
      })
    } finally {
      view.unmount()
    }
  })

  test('labels an interactive dialog with its heading', async () => {
    const view = render(M3RichTooltip, {
      props: {
        target: () => target,
        shown: true,
        detachTimeout: null,
      },
      attrs: {
        'aria-labelledby': 'external-title',
      },
      slots: {
        heading: 'Bulk actions',
        default: 'Choose an action for selected items.',
        footer: '<button type="button">Apply</button>',
      },
    })

    try {
      await waitFor(() => {
        expect(document.querySelector('.m3-rich-tooltip__footer button')?.textContent).toBe('Apply')
      })

      const dialog = document.querySelector<HTMLElement>('.m3-rich-tooltip')!
      const heading = dialog.querySelector<HTMLElement>('.m3-rich-tooltip__heading')!

      expect(dialog.getAttribute('role')).toBe('dialog')
      expect(dialog.getAttribute('aria-labelledby')?.split(' ')).toEqual(['external-title', heading.id])
    } finally {
      view.unmount()
    }
  })
})
