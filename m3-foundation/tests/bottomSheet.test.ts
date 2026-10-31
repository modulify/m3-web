/** @vitest-environment jsdom */

import {
  afterEach,
  expect,
  test,
  vi,
} from 'vitest'

import { attachBottomSheet } from '../lib/bottomSheet'
import { bottomSheetHeights, bottomSheetPosition } from '../lib/bottomSheet/geometry'

test('modal initial height is capped at half the viewport', () => {
  expect(bottomSheetHeights(900, 390, 800, 'modal', true)).toEqual({
    collapsed: 400,
    expanded: 728,
  })
  expect(bottomSheetHeights(200, 390, 800, 'modal', true)).toEqual({
    collapsed: 248,
    expanded: 248,
  })
})

test('standard sheets fit content until a peek height is supplied', () => {
  expect(bottomSheetHeights(900, 800, 800, 'standard', true)).toEqual({
    collapsed: 744,
    expanded: 744,
  })
  expect(bottomSheetHeights(900, 800, 800, 'standard', true, 280)).toEqual({
    collapsed: 280,
    expanded: 744,
  })
  expect(bottomSheetHeights(900, 390, 800, 'standard', false, 280)).toEqual({
    collapsed: 280,
    expanded: 728,
  })
})

test('drag release resolves close, collapse, and expansion', () => {
  const heights = { collapsed: 360, expanded: 728 }

  expect(bottomSheetPosition(260, heights)).toBe('closed')
  expect(bottomSheetPosition(400, heights)).toBe('collapsed')
  expect(bottomSheetPosition(600, heights)).toBe('expanded')
})

const createSheet = (withHandle = true) => {
  const panel = document.createElement('div')
  const content = document.createElement('div')
  const handle = withHandle ? document.createElement('button') : null
  const captured = new Set<number>()

  if (handle) {
    panel.append(handle)
    Object.defineProperties(handle, {
      setPointerCapture: { value: vi.fn((id: number) => captured.add(id)) },
      hasPointerCapture: { value: vi.fn((id: number) => captured.has(id)) },
      releasePointerCapture: { value: vi.fn((id: number) => captured.delete(id)) },
    })
  }
  panel.append(content)
  document.body.append(panel)
  Object.defineProperty(content, 'scrollHeight', { configurable: true, value: 900 })
  panel.getBoundingClientRect = vi.fn(() => ({
    height: Number.parseFloat(panel.style.getPropertyValue('--m3-bottom-sheet-height')) || 400,
  }) as DOMRect)

  let resize: ResizeObserverCallback = () => {}
  const disconnect = vi.fn()
  vi.stubGlobal('ResizeObserver', class {
    constructor (callback: ResizeObserverCallback) { resize = callback }
    observe = vi.fn()
    disconnect = disconnect
  })
  vi.stubGlobal('innerWidth', 390)
  vi.stubGlobal('innerHeight', 800)

  return { panel, content, handle, resize: () => resize([], {} as ResizeObserver), disconnect }
}

const dragEvent = (type: string, y: number, id = 1) => Object.assign(
  new Event(type, { bubbles: true, cancelable: true }),
  { pointerId: id, button: 0, clientY: y }
)

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.replaceChildren()
})

test('handle clicks toggle expansion and external updates restore the requested state', () => {
  const { panel, content, handle, resize, disconnect } = createSheet()
  const onExpand = vi.fn()
  const onDismiss = vi.fn()
  const sheet = attachBottomSheet({
    panel,
    content,
    handle,
    variant: 'modal',
    visible: true,
    expanded: false,
    onExpand,
    onDismiss,
  })

  expect(panel.style.getPropertyValue('--m3-bottom-sheet-height')).toBe('400px')
  handle!.click()
  expect(onExpand).toHaveBeenLastCalledWith(true)
  expect(panel.style.getPropertyValue('--m3-bottom-sheet-height')).toBe('728px')
  handle!.click()
  expect(onExpand).toHaveBeenLastCalledWith(false)

  sheet.update({ variant: 'modal', visible: true, expanded: true, onExpand, onDismiss })
  expect(panel.style.getPropertyValue('--m3-bottom-sheet-height')).toBe('728px')
  resize()
  window.dispatchEvent(new Event('resize'))
  expect(panel.style.getPropertyValue('--m3-bottom-sheet-height')).toBe('728px')

  sheet.collapse()
  expect(onExpand).toHaveBeenLastCalledWith(false)
  sheet.expand()
  expect(onExpand).toHaveBeenLastCalledWith(true)
  sheet.dispose()
  expect(disconnect).toHaveBeenCalledOnce()
})

test('dragging the handle expands, dismisses, and cancels without a follow-up click', () => {
  const { panel, content, handle } = createSheet()
  const onExpand = vi.fn()
  const onDismiss = vi.fn()
  const sheet = attachBottomSheet({
    panel,
    content,
    handle,
    variant: 'modal',
    visible: true,
    expanded: false,
    onExpand,
    onDismiss,
  })

  handle!.dispatchEvent(dragEvent('pointerdown', 500))
  handle!.dispatchEvent(dragEvent('pointermove', 200))
  expect(panel.classList.contains('m3-bottom-sheet_dragging')).toBe(true)
  expect(panel.style.getPropertyValue('--m3-bottom-sheet-height')).toBe('700px')
  handle!.dispatchEvent(dragEvent('pointerup', 200))
  expect(onExpand).toHaveBeenCalledWith(true)
  expect(panel.classList.contains('m3-bottom-sheet_dragging')).toBe(false)
  expect(handle!.hasPointerCapture(1)).toBe(false)

  handle!.click()
  expect(onExpand).toHaveBeenCalledTimes(1)
  handle!.dispatchEvent(dragEvent('pointerdown', 200))
  handle!.dispatchEvent(dragEvent('pointermove', 700))
  handle!.dispatchEvent(dragEvent('pointerup', 700))
  expect(onDismiss).toHaveBeenCalledOnce()

  handle!.dispatchEvent(dragEvent('pointerdown', 500))
  handle!.dispatchEvent(dragEvent('pointermove', 550))
  handle!.dispatchEvent(dragEvent('pointercancel', 550))
  expect(panel.style.getPropertyValue('--m3-bottom-sheet-height')).toBe('728px')
  sheet.dispose()
})

test('a non-draggable sheet fits its content and can close from the handle', () => {
  const { panel, content, handle } = createSheet()
  Object.defineProperty(content, 'scrollHeight', { configurable: true, value: 200 })
  const onDismiss = vi.fn()
  const sheet = attachBottomSheet({
    panel,
    content,
    handle,
    variant: 'standard',
    visible: true,
    expanded: false,
    onExpand: vi.fn(),
    onDismiss,
  })

  handle!.click()
  expect(onDismiss).toHaveBeenCalledOnce()
  sheet.dispose()
})

test('hidden sheets and unrelated pointer movements do not start a drag', () => {
  const { panel, content, handle } = createSheet()
  const onExpand = vi.fn()
  const onDismiss = vi.fn()
  const sheet = attachBottomSheet({
    panel,
    content,
    handle,
    variant: 'modal',
    visible: false,
    expanded: false,
    onExpand,
    onDismiss,
  })

  handle!.dispatchEvent(dragEvent('pointerdown', 500))
  handle!.dispatchEvent(dragEvent('pointermove', 200))
  expect(panel.classList.contains('m3-bottom-sheet_dragging')).toBe(false)

  sheet.update({ variant: 'modal', visible: true, expanded: false, onExpand, onDismiss })
  handle!.dispatchEvent(dragEvent('pointerdown', 500))
  handle!.dispatchEvent(dragEvent('pointermove', 200, 2))
  handle!.dispatchEvent(dragEvent('pointermove', 497))
  expect(panel.classList.contains('m3-bottom-sheet_dragging')).toBe(false)
  handle!.dispatchEvent(dragEvent('pointerup', 200, 2))
  handle!.dispatchEvent(dragEvent('pointerup', 497))

  expect(onExpand).not.toHaveBeenCalled()
  expect(onDismiss).not.toHaveBeenCalled()
  expect(panel.style.getPropertyValue('--m3-bottom-sheet-height')).toBe('400px')
  sheet.dispose()
})
