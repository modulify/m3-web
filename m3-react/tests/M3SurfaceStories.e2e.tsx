import '../storybook/examples/surface/styles.scss'

import { fireEvent } from '@testing-library/react'
import { page } from 'vitest/browser'
import { render, waitFor } from '@testing-library/react'

import SurfaceCardPageMorph from '../storybook/examples/surface/SurfaceCardPageMorph'
import SurfaceNestedDialogsChain from '../storybook/examples/surface/SurfaceNestedDialogsChain'
import SurfaceSideSheetAlwaysModal from '../storybook/examples/surface/SurfaceSideSheetAlwaysModal'
import SurfaceSideSheetModalToWindow from '../storybook/examples/surface/SurfaceSideSheetModalToWindow'
import SurfaceSideSheetMorph from '../storybook/examples/surface/SurfaceSideSheetMorph'

const query = <ElementType extends Element>(selector: string): ElementType => {
  const element = document.querySelector<ElementType>(selector)
  if (!element) throw new Error(`Element not found: ${selector}`)

  return element
}

test('reopens always-modal side-sheet with animated entry after close', async () => {
  await page.viewport(1440, 1024)
  const view = render(<SurfaceSideSheetAlwaysModal locale="en-US" />)
  let entryTransitions = 0
  let observingEntry = false
  const onTransitionRun = (event: TransitionEvent) => {
    if (observingEntry && event.propertyName === 'right' && event.target instanceof HTMLElement && event.target.matches('[data-testid="surface-always-panel"]')) {
      entryTransitions++
      observingEntry = false
    }
  }
  document.addEventListener('transitionrun', onTransitionRun)

  try {
    const openAndObserveEntry = async (expectedTransitions: number) => {
      await waitFor(() => expect(query<HTMLButtonElement>('[data-testid="surface-always-open"]').disabled).toBe(false), { timeout: 2200 })
      observingEntry = true
      fireEvent.click(query<HTMLButtonElement>('[data-testid="surface-always-open"]'))
      await waitFor(() => expect(document.querySelector('[data-testid="surface-always-panel"]')).not.toBeNull(), { timeout: 2200 })
      await waitFor(() => expect(entryTransitions).toBe(expectedTransitions), { timeout: 2200 })
      await waitFor(() => expect(query<HTMLButtonElement>('[data-testid="surface-always-close"]').disabled).toBe(false), { timeout: 2200 })
      await waitFor(() => expect(Number.parseFloat(getComputedStyle(query<HTMLElement>('[data-testid="surface-always-panel"]')).right)).toBe(0), { timeout: 2200 })
    }

    await openAndObserveEntry(1)
    fireEvent.click(query<HTMLButtonElement>('[data-testid="surface-always-close"]'))
    await waitFor(() => expect(document.querySelector('[data-testid="surface-always-panel"]')).toBeNull(), { timeout: 2200 })
    await openAndObserveEntry(2)
  } finally {
    document.removeEventListener('transitionrun', onTransitionRun)
    view.unmount()
  }
})

test('animates card rounding while expanding to a page', async () => {
  await page.viewport(1440, 1024)
  const view = render(<SurfaceCardPageMorph locale="en-US" />)

  try {
    expect(getComputedStyle(query<HTMLElement>('[data-testid="surface-card-morph"]')).borderTopLeftRadius).toBe('24px')

    fireEvent.click(query<HTMLButtonElement>('[data-testid="surface-card-toggle"]'))

    await waitFor(() => {
      const panel = query<HTMLElement>('[data-testid="surface-card-morph"]')
      expect(panel.getAnimations().some(animation =>
        'transitionProperty' in animation && animation.transitionProperty === 'border-top-left-radius'
      )).toBe(true)
    })

    await waitFor(() => expect(getComputedStyle(query<HTMLElement>('[data-testid="surface-card-morph"]')).borderTopLeftRadius).toBe('0px'), { timeout: 2200 })

    await waitFor(() => expect(query<HTMLButtonElement>('[data-testid="surface-card-toggle"]').disabled).toBe(false), { timeout: 2200 })
    fireEvent.click(query<HTMLButtonElement>('[data-testid="surface-card-toggle"]'))

    await waitFor(() => {
      const panel = query<HTMLElement>('[data-testid="surface-card-morph"]')
      expect(panel.getAnimations().some(animation =>
        'transitionProperty' in animation && animation.transitionProperty === 'border-top-left-radius'
      )).toBe(true)
    })

    await waitFor(() => expect(getComputedStyle(query<HTMLElement>('[data-testid="surface-card-morph"]')).borderTopLeftRadius).toBe('24px'), { timeout: 2200 })
  } finally {
    view.unmount()
  }
})

test('morphs a docked side sheet into a modal and returns it to the layout', async () => {
  await page.viewport(1440, 1024)
  const view = render(<SurfaceSideSheetMorph locale="en-US" />)

  try {
    const root = query<HTMLElement>('[data-testid="surface-morph-root"]')
    const toggle = query<HTMLButtonElement>('[data-testid="surface-morph-toggle"]')

    expect(root.dataset.sheetModal).toBe('false')
    expect(query<HTMLElement>('[data-panel-mode="docked"]').getBoundingClientRect().width).toBeGreaterThan(0)

    fireEvent.click(toggle)

    await waitFor(() => expect(root.dataset.sheetModal).toBe('true'), { timeout: 2200 })
    await waitFor(() => {
      const panel = query<HTMLElement>('[data-panel-mode="modal"]')
      expect(panel.getBoundingClientRect().width).toBeGreaterThan(0)
    }, { timeout: 2200 })
    await waitFor(() => expect(toggle.disabled).toBe(false), { timeout: 2200 })

    fireEvent.click(toggle)

    await waitFor(() => expect(root.dataset.sheetModal).toBe('false'), { timeout: 2200 })
    await waitFor(() => expect(document.querySelector('[data-panel-mode="modal"]')).toBeNull(), { timeout: 2200 })
    expect(query<HTMLElement>('[data-panel-mode="docked"]').getBoundingClientRect().width).toBeGreaterThan(0)

    await waitFor(() => expect(toggle.disabled).toBe(false), { timeout: 2200 })
    fireEvent.click(toggle)
    await waitFor(() => expect(root.dataset.sheetModal).toBe('true'), { timeout: 2200 })
    await waitFor(() => {
      const close = query<HTMLButtonElement>('[data-testid="surface-morph-close"]')
      expect(close.disabled).toBe(false)
    }, { timeout: 2200 })
    fireEvent.click(query<HTMLButtonElement>('[data-testid="surface-morph-close"]'))

    await waitFor(() => expect(root.dataset.sheetModal).toBe('false'), { timeout: 2200 })
    await waitFor(() => expect(document.querySelector('[data-panel-mode="modal"]')).toBeNull(), { timeout: 2200 })
  } finally {
    view.unmount()
  }
})

test('closes a modal window and reopens it in side-sheet mode', async () => {
  await page.viewport(1440, 1024)
  const view = render(<SurfaceSideSheetModalToWindow locale="en-US" />)

  try {
    const root = query<HTMLElement>('[data-testid="surface-window-root"]')

    fireEvent.click(query<HTMLButtonElement>('[data-testid="surface-window-open"]'))
    await waitFor(() => {
      expect(query<HTMLElement>('[data-testid="surface-window-panel"]').dataset.panelMode).toBe('sheet')
    }, { timeout: 2200 })

    const toggle = query<HTMLButtonElement>('[data-testid="surface-window-toggle-mode"]')
    await waitFor(() => expect(toggle.disabled).toBe(false), { timeout: 2200 })
    fireEvent.click(toggle)

    await waitFor(() => {
      expect(query<HTMLElement>('[data-testid="surface-window-panel"]').dataset.panelMode).toBe('window')
    }, { timeout: 2200 })
    await waitFor(() => {
      expect(query<HTMLButtonElement>('[data-testid="surface-window-close"]').disabled).toBe(false)
    }, { timeout: 2200 })
    fireEvent.click(query<HTMLButtonElement>('[data-testid="surface-window-close"]'))

    await waitFor(() => {
      expect(document.querySelector('[data-testid="surface-window-panel"]')).toBeNull()
      expect(root.dataset.panelMounted).toBe('false')
    }, { timeout: 2600 })

    await waitFor(() => {
      expect(query<HTMLButtonElement>('[data-testid="surface-window-open"]').disabled).toBe(false)
    }, { timeout: 2200 })
    fireEvent.click(query<HTMLButtonElement>('[data-testid="surface-window-open"]'))

    await waitFor(() => {
      expect(query<HTMLElement>('[data-testid="surface-window-panel"]').dataset.panelMode).toBe('sheet')
    }, { timeout: 2200 })
  } finally {
    view.unmount()
  }
})

test('keeps one active scrim while opening a nested dialog chain', async () => {
  await page.viewport(1440, 1024)
  const view = render(<SurfaceNestedDialogsChain locale="en-US" />)

  try {
    fireEvent.click(query<HTMLButtonElement>('[data-testid="surface-dialog-chain-open-root"]'))

    for (let level = 1; level <= 4; level++) {
      await waitFor(() => {
        expect(document.querySelector(`[data-testid="surface-dialog-chain-level-${level}"]`)).not.toBeNull()
        expect(document.querySelectorAll('.m3-surface__scrim')).toHaveLength(1)
      }, { timeout: 2200 })

      if (level < 4) {
        fireEvent.click(query<HTMLButtonElement>(`[data-testid="surface-dialog-chain-open-next-${level}"]`))
      }
    }
  } finally {
    view.unmount()
  }
})
