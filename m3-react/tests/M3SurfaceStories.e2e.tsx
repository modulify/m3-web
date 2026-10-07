import '../storybook/examples/surface/styles.scss'

import { fireEvent } from '@testing-library/react'
import { page } from 'vitest/browser'
import { render, waitFor } from '@testing-library/react'

import SurfaceCardPageMorph from '../storybook/examples/surface/SurfaceCardPageMorph'
import SurfaceSideSheetAlwaysModal from '../storybook/examples/surface/SurfaceSideSheetAlwaysModal'

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
