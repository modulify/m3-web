// @vitest-environment jsdom

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest'

import { activateModalFocus } from '../lib/modal'

const disposals: Array<() => void> = []

const button = (label: string, tabIndex = 0) => {
  const element = document.createElement('button')
  element.textContent = label
  element.tabIndex = tabIndex
  return element
}

const tab = (shiftKey = false) => {
  const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true, shiftKey })
  document.dispatchEvent(event)
  return event
}

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue({ length: 1 } as DOMRectList)
})

afterEach(() => {
  disposals.reverse().forEach(dispose => dispose())
  disposals.length = 0
  document.body.replaceChildren()
  vi.restoreAllMocks()
})

describe('modal focus', () => {
  test('inerts the background and wraps Tab in positive tabindex order', async () => {
    const trigger = button('Open')
    const background = button('Background')
    const dialog = document.createElement('div')
    const second = button('Second', 2)
    const first = button('First', 1)
    const regular = button('Regular')
    const disabled = button('Disabled')
    disabled.disabled = true
    const hidden = button('Hidden')
    hidden.style.visibility = 'hidden'
    dialog.append(second, first, regular, disabled, hidden)
    document.body.append(trigger, background, dialog)
    trigger.focus()

    const onEscape = vi.fn()
    const dispose = activateModalFocus({ dialog, onEscape })
    disposals.push(dispose)

    expect(background.inert).toBe(true)
    expect(trigger.inert).toBe(true)
    expect(dialog.tabIndex).toBe(-1)
    expect(document.activeElement).toBe(first)

    expect(tab(true).defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(regular)
    expect(tab().defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(first)

    const newSibling = button('Later')
    document.body.append(newSibling)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(newSibling.inert).toBe(true)
    background.focus()
    expect(document.activeElement).toBe(first)

    dispose()
    await Promise.resolve()
    expect(background.inert).not.toBe(true)
    expect(dialog.hasAttribute('tabindex')).toBe(false)
    expect(document.activeElement).toBe(trigger)
    expect(tab().defaultPrevented).toBe(false)
  })

  test('uses the dialog itself when no focusable control exists and respects exemptions', () => {
    const exempt = button('Always available')
    const dialog = document.createElement('div')
    document.body.append(exempt, dialog)
    const dispose = activateModalFocus({ dialog, exempt: () => [exempt, null], onEscape: vi.fn() })
    disposals.push(dispose)

    expect(exempt.inert).not.toBe(true)
    expect(document.activeElement).toBe(dialog)
    expect(tab().defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(dialog)
    dispose()
  })

  test('protects siblings along a nested modal path and preserves a supplied tab index', () => {
    const layout = document.createElement('main')
    const sidebar = button('Sidebar')
    const dialog = document.createElement('div')
    dialog.tabIndex = -1
    const first = button('First', 3)
    const second = button('Second', 3)
    dialog.append(first, second)
    layout.append(sidebar, dialog)
    document.body.append(layout)

    const dispose = activateModalFocus({ dialog, onEscape: vi.fn() })
    disposals.push(dispose)

    expect(layout.inert).not.toBe(true)
    expect(sidebar.inert).toBe(true)
    expect(document.activeElement).toBe(first)
    dispose()
    expect(dialog.tabIndex).toBe(-1)
    expect(sidebar.inert).not.toBe(true)
  })

  test('restores focus to the previous modal when the top modal closes', async () => {
    const first = document.createElement('div')
    const firstAction = button('First action')
    first.append(firstAction)
    const second = document.createElement('div')
    const secondAction = button('Second action')
    second.append(secondAction)
    document.body.append(first, second)

    const closeFirst = activateModalFocus({ dialog: first, onEscape: vi.fn() })
    disposals.push(closeFirst)
    expect(document.activeElement).toBe(firstAction)

    const closeSecond = activateModalFocus({ dialog: second, onEscape: vi.fn() })
    disposals.push(closeSecond)
    expect(first.inert).toBe(true)
    expect(document.activeElement).toBe(secondAction)

    closeSecond()
    await Promise.resolve()
    expect(first.inert).not.toBe(true)
    expect(document.activeElement).toBe(firstAction)
    closeFirst()
  })

  test('allows an outer modal to close before the active inner modal', async () => {
    const first = document.createElement('div')
    first.append(button('First action'))
    const second = document.createElement('div')
    const secondAction = button('Second action')
    second.append(secondAction)
    document.body.append(first, second)

    const closeFirst = activateModalFocus({ dialog: first, onEscape: vi.fn() })
    const closeSecond = activateModalFocus({ dialog: second, onEscape: vi.fn() })
    disposals.push(closeFirst, closeSecond)
    closeFirst()
    closeFirst()

    expect(document.activeElement).toBe(secondAction)
    expect(second.inert).not.toBe(true)
    closeSecond()
    await Promise.resolve()
    expect(first.inert).not.toBe(true)
  })

  test('keeps focus on a new control when a modal closes before restoration runs', async () => {
    const trigger = button('Open')
    const dialog = document.createElement('div')
    const action = button('Continue')
    const next = button('Next')
    dialog.append(action)
    document.body.append(trigger, dialog, next)
    trigger.focus()
    const dispose = activateModalFocus({ dialog, onEscape: vi.fn() })
    disposals.push(dispose)

    dispose()
    next.focus()
    await Promise.resolve()
    expect(document.activeElement).toBe(next)
  })

  test('falls back to the remaining modal if its previous focus target was removed', async () => {
    const first = document.createElement('div')
    const firstAction = button('First action')
    first.append(firstAction)
    const second = document.createElement('div')
    second.append(button('Second action'))
    document.body.append(first, second)

    const closeFirst = activateModalFocus({ dialog: first, onEscape: vi.fn() })
    disposals.push(closeFirst)
    const closeSecond = activateModalFocus({ dialog: second, onEscape: vi.fn() })
    disposals.push(closeSecond)
    firstAction.remove()

    closeSecond()
    await Promise.resolve()
    expect(document.activeElement).toBe(first)
  })
})
