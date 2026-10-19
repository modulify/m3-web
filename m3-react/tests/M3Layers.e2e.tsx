import type { M3PopperExposed } from '@/components/popper'
import type { SnackbarHostMethods } from '@/components/snackbar'

import { act } from '@testing-library/react'
import { createRef } from 'react'
import { fireEvent, render } from '@testing-library/react'
import { useState } from 'react'
import { waitFor } from '@testing-library/react'

import { M3Popper } from '@/components/popper'
import { M3Search } from '@/components/search'
import { M3SnackbarHost } from '@/components/snackbar'
import { M3Surface } from '@/components/surface'

test('a popover stays in its modal layer and handles Escape before the modal', async () => {
  const onToggle = vi.fn()

  function Scenario() {
    const [target, setTarget] = useState<HTMLButtonElement | null>(null)

    return <M3Surface mode="modal" shown onToggle={onToggle}>
      <button ref={setTarget}>Open menu</button>
      <M3Popper target={target} detachTimeout={null}>
        <button>Menu action</button>
      </M3Popper>
    </M3Surface>
  }

  const view = render(<Scenario />)
  try {
    const trigger = document.querySelector<HTMLButtonElement>('.m3-surface button')!
    fireEvent.click(trigger)
    await waitFor(() => expect(document.querySelector('.m3-popper_shown')).not.toBeNull())

    const layer = trigger.closest<HTMLElement>('.m3-layer')!
    const popper = document.querySelector<HTMLElement>('.m3-popper_shown')!
    expect(layer.querySelector('.m3-layer__popovers')!.contains(popper)).toBe(true)
    expect(getComputedStyle(layer).zIndex).toBe('1000')
    expect(getComputedStyle(layer.querySelector<HTMLElement>('.m3-layer__popovers')!).zIndex).toBe('100')
    expect(popper.inert).toBe(false)

    popper.querySelector<HTMLButtonElement>('button')!.focus()
    act(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true })))
    expect(document.activeElement).toBe(trigger)

    act(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })))
    await waitFor(() => expect(document.querySelector('.m3-popper_shown')).toBeNull())
    expect(onToggle).not.toHaveBeenCalled()

    act(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })))
    expect(onToggle).toHaveBeenCalledWith(false)
  } finally {
    view.unmount()
  }
})

test('a snackbar opened from a modal belongs to that layer', async () => {
  const host = createRef<SnackbarHostMethods>()
  const scene = (shown: boolean) => <>
    <M3SnackbarHost ref={host} />
    <M3Surface mode="modal" shown={shown}><button>Notify</button></M3Surface>
  </>
  const view = render(scene(true))

  try {
    const trigger = document.querySelector<HTMLButtonElement>('.m3-surface button')!
    trigger.focus()
    let result: Promise<string> | undefined
    await act(async () => { result = host.current?.show({ message: 'Layer notice', duration: null }) })

    const layer = trigger.closest<HTMLElement>('.m3-layer')!
    const feedback = layer.querySelector<HTMLElement>('.m3-layer__feedback')!
    expect(feedback.querySelector('.m3-snackbar-host')).not.toBeNull()
    expect(feedback.querySelector('.m3-snackbar')).not.toBeNull()
    expect(getComputedStyle(feedback).zIndex).toBe('50')

    const close = feedback.querySelector<HTMLButtonElement>('.m3-snackbar__close')!
    close.focus()
    expect(document.activeElement).toBe(close)

    view.rerender(scene(false))
    expect(await result).toBe('disposed')
  } finally {
    view.unmount()
  }
})

test('a reopened modal moves above the previously opened modal', async () => {
  const surfaces = (firstShown: boolean, secondShown: boolean) => <>
    <M3Surface mode="modal" shown={firstShown}><button>First</button></M3Surface>
    <M3Surface mode="modal" shown={secondShown}><button>Second</button></M3Surface>
  </>

  const view = render(surfaces(true, true))
  try {
    const first = [...document.querySelectorAll<HTMLButtonElement>('.m3-surface button')].find(button => button.textContent === 'First')!
    const second = [...document.querySelectorAll<HTMLButtonElement>('.m3-surface button')].find(button => button.textContent === 'Second')!
    const firstLayer = first.closest<HTMLElement>('.m3-layer')!
    const secondLayer = second.closest<HTMLElement>('.m3-layer')!

    expect(firstLayer.nextElementSibling).toBe(secondLayer)
    expect(firstLayer.inert).toBe(true)
    expect(document.activeElement).toBe(second)

    view.rerender(surfaces(false, true))
    view.rerender(surfaces(true, true))
    await waitFor(() => expect(secondLayer.nextElementSibling).toBe(firstLayer))
    expect(secondLayer.inert).toBe(true)
    expect(firstLayer.inert).toBe(false)
    expect(document.activeElement).toBe(first)
  } finally {
    view.unmount()
  }
})

test('search and dialog follow activation order instead of component type', async () => {
  const scene = (searchOpen: boolean, dialogShown: boolean) => <>
    <M3Search query="" label="Search" status="" open={searchOpen} layout="docked" onQueryChange={() => {}} onOpenChange={() => {}} />
    <M3Surface mode="modal" shown={dialogShown}><button>Dialog action</button></M3Surface>
  </>

  const view = render(scene(true, false))
  try {
    const search = document.querySelector<HTMLElement>('.m3-search__view')!
    const searchLayer = search.closest<HTMLElement>('.m3-layer')!
    view.rerender(scene(true, true))
    const dialog = document.querySelector<HTMLElement>('.m3-surface')!
    const dialogLayer = dialog.closest<HTMLElement>('.m3-layer')!
    expect(searchLayer.nextElementSibling).toBe(dialogLayer)
    expect(searchLayer.inert).toBe(true)

    view.rerender(scene(false, true))
    view.rerender(scene(true, true))
    await waitFor(() => expect(dialogLayer.nextElementSibling).toBe(searchLayer))
    expect(dialogLayer.inert).toBe(true)
    expect(searchLayer.inert).toBe(false)
  } finally {
    view.unmount()
  }
})

test('showing an already open popover raises it visually and for Escape', async () => {
  const firstTarget = document.createElement('button')
  const secondTarget = document.createElement('button')
  document.body.append(firstTarget, secondTarget)
  const first = createRef<M3PopperExposed>()
  const second = createRef<M3PopperExposed>()
  const view = render(<>
    <M3Popper ref={first} target={firstTarget} targetTriggers={[]} detachTimeout={null}><button>First menu</button></M3Popper>
    <M3Popper ref={second} target={secondTarget} targetTriggers={[]} detachTimeout={null}><button>Second menu</button></M3Popper>
  </>)

  try {
    act(() => { first.current?.show(true); second.current?.show(true) })
    await waitFor(() => expect(document.querySelectorAll('.m3-popper_shown').length).toBe(2))
    const poppers = [...document.querySelectorAll<HTMLElement>('.m3-popper_shown')]
    const firstHost = poppers.find(popper => popper.textContent === 'First menu')!.parentElement!.parentElement!
    const secondHost = poppers.find(popper => popper.textContent === 'Second menu')!.parentElement!.parentElement!

    act(() => first.current?.show(true))
    expect(secondHost.nextElementSibling).toBe(firstHost)

    act(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })))
    await waitFor(() => expect(firstHost.querySelector('.m3-popper_shown')).toBeNull())
    expect(secondHost.querySelector('.m3-popper_shown')).not.toBeNull()
  } finally {
    view.unmount()
    firstTarget.remove()
    secondTarget.remove()
  }
})

test('a page popover becomes inert beneath a newly opened modal', async () => {
  const target = document.createElement('button')
  document.body.append(target)
  const scene = (modalShown: boolean) => <>
    <M3Popper target={target} overflow={[]} detachTimeout={null} shown><button>Page menu</button></M3Popper>
    <M3Surface mode="modal" shown={modalShown}><button>Modal action</button></M3Surface>
  </>
  const view = render(scene(false))

  try {
    await waitFor(() => expect(document.querySelector('.m3-popper_shown')).not.toBeNull())
    const popperHost = document.querySelector<HTMLElement>('.m3-popper_shown')!.parentElement!.parentElement!
    expect(popperHost.parentElement).toBe(document.body)

    view.rerender(scene(true))
    await waitFor(() => expect(popperHost.inert).toBe(true))
    const modalLayer = document.querySelector<HTMLElement>('.m3-layer[data-m3-layer="modal"]')!
    expect(popperHost.nextElementSibling).toBe(modalLayer)
  } finally {
    view.unmount()
    target.remove()
  }
})
