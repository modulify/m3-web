import type { M3RichTooltipExposed } from '@/components/rich-tooltip'

import { act } from '@testing-library/react'
import { createRef } from 'react'
import { render, waitFor } from '@testing-library/react'

import { M3RichTooltip } from '@/components/rich-tooltip'

describe('m3-react/rich-tooltip', () => {
  let target: HTMLButtonElement

  beforeEach(() => {
    target = document.createElement('button')
    document.body.append(target)
  })

  afterEach(() => target.remove())

  test('uses the tooltip role for explanatory content', async () => {
    const view = render(
      <M3RichTooltip target={target} detachTimeout={null} className="shortcut-hint" shown>
        Press Ctrl+K to search
      </M3RichTooltip>
    )

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

  test('labels an interactive dialog with its heading and exposes the popper', async () => {
    const tooltip = createRef<M3RichTooltipExposed>()
    const onToggle = vi.fn()
    const view = render(
      <M3RichTooltip
        ref={tooltip}
        target={target}
        overflow={[]}
        detachTimeout={null}
        aria-labelledby="external-title"
        shown
        onToggle={onToggle}
      >
        <M3RichTooltip.Heading>Bulk actions</M3RichTooltip.Heading>
        Choose an action for selected items.
        <M3RichTooltip.Footer>
          <button type="button">Apply</button>
        </M3RichTooltip.Footer>
      </M3RichTooltip>
    )

    try {
      await waitFor(() => {
        expect(tooltip.current?.el).not.toBeNull()
        expect(document.querySelector('.m3-rich-tooltip__footer button')?.textContent).toBe('Apply')
      })

      const dialog = document.querySelector<HTMLElement>('.m3-rich-tooltip')!
      const heading = dialog.querySelector<HTMLElement>('.m3-rich-tooltip__heading')!

      expect(dialog.getAttribute('role')).toBe('dialog')
      expect(dialog.getAttribute('aria-labelledby')?.split(' ')).toEqual(['external-title', heading.id])
      expect(tooltip.current?.contains(dialog)).toBe(true)

      await act(() => tooltip.current?.adjust())
      await waitFor(() => expect(dialog.classList.contains('m3-popper_shown')).toBe(true))

      act(() => tooltip.current?.hide(true, 'generic'))
      await waitFor(() => expect(onToggle).toHaveBeenLastCalledWith(false))

      act(() => tooltip.current?.show(true))
      await waitFor(() => expect(onToggle).toHaveBeenLastCalledWith(true))
    } finally {
      view.unmount()
    }
  })
})
