// @vitest-environment jsdom

import {
  afterEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest'

import {
  activateModalLayer,
  activatePopover,
  createLayerHost,
  mountLayerHost,
  mountPopoverHost,
  raisePopover,
  resolveFeedbackContainer,
  resolvePopoverContainer,
  setLayerModal,
} from '../lib/layers'

const disposals: Array<() => void> = []

const escape = (options: KeyboardEventInit = {}) => {
  const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true, ...options })
  document.dispatchEvent(event)
  return event
}

afterEach(() => {
  disposals.reverse().forEach(dispose => dispose())
  disposals.length = 0
  document.body.replaceChildren()
})

describe('UI layer ownership', () => {
  test('raises an opening modal without detaching its layer host', async () => {
    const opening = createLayerHost(document)
    const previous = createLayerHost(document)
    const background = createLayerHost(document)
    setLayerModal(opening, true)
    setLayerModal(previous, true)
    setLayerModal(background, false)
    document.body.append(opening, previous, background)

    const records: MutationRecord[] = []
    const observer = new MutationObserver(changes => records.push(...changes))
    observer.observe(document.body, { childList: true })

    const close = activateModalLayer(opening, vi.fn())
    disposals.push(close)
    await Promise.resolve()

    expect([...document.body.children]).toEqual([previous, opening, background])
    expect(records.some(record => [...record.addedNodes, ...record.removedNodes].includes(opening))).toBe(false)
    observer.disconnect()
  })

  test('places popovers and feedback in their modal host unless an explicit container is supplied', () => {
    const layer = createLayerHost(document)
    setLayerModal(layer, true)
    mountLayerHost(layer, document.body)
    const target = document.createElement('button')
    layer.append(target)
    const popovers = layer.querySelector<HTMLElement>('.m3-layer__popovers')
    const feedback = layer.querySelector<HTMLElement>('.m3-layer__feedback')

    expect(resolvePopoverContainer(target)).toBe(popovers)
    expect(resolveFeedbackContainer(target)).toBe(feedback)
    expect(resolvePopoverContainer(null)).toBe(document.body)
    expect(resolveFeedbackContainer(null)).toBeNull()

    const popover = document.createElement('div')
    mountPopoverHost(popover, target)
    expect(popover.parentElement).toBe(popovers)

    const custom = document.createElement('div')
    custom.id = 'custom-popovers'
    document.body.append(custom)
    expect(resolvePopoverContainer(target, '#custom-popovers')).toBe(custom)
    expect(resolvePopoverContainer(null, custom)).toBe(custom)
    expect(resolvePopoverContainer(target, '#missing')).toBe(document.body)

    setLayerModal(layer, false)
    expect(resolvePopoverContainer(target)).toBe(document.body)
  })

  test('sends Escape to the top popover in the active modal, then to the modal', () => {
    const first = createLayerHost(document)
    const second = createLayerHost(document)
    setLayerModal(first, true)
    setLayerModal(second, true)
    document.body.append(first, second)

    const firstClose = vi.fn()
    const secondClose = vi.fn()
    const firstPopoverClose = vi.fn()
    const firstPopover = document.createElement('div')
    first.append(firstPopover)

    const closeFirst = activateModalLayer(first, firstClose)
    const closeFirstPopover = activatePopover(firstPopover, firstPopoverClose)
    disposals.push(closeFirst, closeFirstPopover)
    expect(escape().defaultPrevented).toBe(true)
    expect(firstPopoverClose).toHaveBeenCalledTimes(1)

    const closeSecond = activateModalLayer(second, secondClose)
    disposals.push(closeSecond)
    expect(escape().defaultPrevented).toBe(true)
    expect(secondClose).toHaveBeenCalledTimes(1)
    expect(firstPopoverClose).toHaveBeenCalledTimes(1)
    expect(escape({ shiftKey: true }).defaultPrevented).toBe(false)

    closeSecond()
    expect(escape().defaultPrevented).toBe(true)
    expect(firstPopoverClose).toHaveBeenCalledTimes(2)
    closeFirstPopover()
    expect(escape().defaultPrevented).toBe(true)
    expect(firstClose).toHaveBeenCalledTimes(1)

    closeFirst()
    expect(escape().defaultPrevented).toBe(false)
  })

  test('raises a popover by activation order and closes modal-owned popovers with the layer', () => {
    const layer = createLayerHost(document)
    setLayerModal(layer, true)
    document.body.append(layer)
    const closeLayer = activateModalLayer(layer, vi.fn(), false)
    disposals.push(closeLayer)

    const first = document.createElement('div')
    const second = document.createElement('div')
    layer.append(first, second)
    const firstClose = vi.fn()
    const secondClose = vi.fn()
    const disposeFirst = activatePopover(first, firstClose)
    const disposeSecond = activatePopover(second, secondClose)
    disposals.push(disposeFirst, disposeSecond)

    escape()
    expect(secondClose).toHaveBeenCalledTimes(1)
    raisePopover(first)
    expect(layer.lastElementChild).toBe(first)
    escape()
    expect(firstClose).toHaveBeenCalledTimes(1)

    closeLayer()
    expect(firstClose).toHaveBeenCalledTimes(2)
    expect(secondClose).toHaveBeenCalledTimes(2)
    expect(layer.dataset.m3LayerActive).toBeUndefined()
    disposeFirst()
    disposeSecond()
    raisePopover(first)
  })
})
