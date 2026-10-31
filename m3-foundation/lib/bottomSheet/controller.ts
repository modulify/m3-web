import type { BottomSheetHeights } from './geometry'
import type { BottomSheetVariant } from '../../types/components/bottom-sheet'

import { bottomSheetHeights, bottomSheetPosition } from './geometry'

export interface BottomSheetControllerOptions {
  panel: HTMLElement;
  content: HTMLElement;
  handle: HTMLButtonElement | null;
  variant: BottomSheetVariant;
  visible: boolean;
  expanded: boolean;
  peek?: number;
  onExpand: (expanded: boolean) => void;
  onDismiss: () => void;
}

export interface BottomSheetController {
  update(options: Omit<BottomSheetControllerOptions, 'panel' | 'content' | 'handle'>): void;
  expand(): void;
  collapse(): void;
  dispose(): void;
}

interface DragState {
  pointer: number;
  startY: number;
  startHeight: number;
  moved: boolean;
}

class BottomSheetManager implements BottomSheetController {
  private readonly panel: HTMLElement
  private readonly content: HTMLElement
  private readonly handle: HTMLButtonElement | null
  private readonly listeners = new AbortController()
  private readonly observer: ResizeObserver | null
  private current: BottomSheetControllerOptions
  private expanded: boolean
  private externalExpanded: boolean
  private drag: DragState | null = null
  private suppressClick = false
  private heights: BottomSheetHeights

  constructor(options: BottomSheetControllerOptions) {
    this.panel = options.panel
    this.content = options.content
    this.handle = options.handle
    this.current = options
    this.expanded = options.expanded
    this.externalExpanded = options.expanded
    this.heights = bottomSheetHeights(0, innerWidth, innerHeight, options.variant, !!options.handle, options.peek)
    this.observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => this.measure())

    const signal = this.listeners.signal
    this.handle?.addEventListener('pointerdown', event => this.onPointerDown(event), { signal })
    this.handle?.addEventListener('pointermove', event => this.onPointerMove(event), { signal })
    this.handle?.addEventListener('pointerup', event => this.finishDrag(event), { signal })
    this.handle?.addEventListener('pointercancel', event => this.finishDrag(event, true), { signal })
    this.handle?.addEventListener('click', event => this.onClick(event), { signal })
    window.addEventListener('resize', () => this.measure(), { signal })
    this.observer?.observe(this.content)
    this.measure()
  }

  private setHeight(height: number) {
    this.panel.style.setProperty('--m3-bottom-sheet-height', `${Math.max(0, height)}px`)
  }

  private targetHeight() {
    return this.expanded ? this.heights.expanded : this.heights.collapsed
  }

  private measure() {
    this.heights = bottomSheetHeights(
      this.content.scrollHeight,
      innerWidth,
      innerHeight,
      this.current.variant,
      !!this.handle,
      this.current.peek
    )
    if (!this.drag) this.setHeight(this.targetHeight())
  }

  private changeExpansion(next: boolean) {
    this.expanded = next
    this.setHeight(this.targetHeight())
    this.current.onExpand(next)
  }

  private onPointerDown(event: PointerEvent) {
    if (event.button !== 0 || !this.current.visible) return

    this.suppressClick = false
    this.drag = {
      pointer: event.pointerId,
      startY: event.clientY,
      startHeight: this.panel.getBoundingClientRect().height,
      moved: false,
    }
    this.handle?.setPointerCapture?.(event.pointerId)
  }

  private onPointerMove(event: PointerEvent) {
    if (!this.drag || event.pointerId !== this.drag.pointer) return

    const distance = this.drag.startY - event.clientY
    if (Math.abs(distance) <= 5 && !this.drag.moved) return

    this.drag.moved = true
    this.panel.classList.add('m3-bottom-sheet_dragging')
    this.setHeight(Math.max(0, Math.min(this.heights.expanded, this.drag.startHeight + distance)))
    event.preventDefault()
  }

  private finishDrag(event: PointerEvent, canceled = false) {
    if (!this.drag || event.pointerId !== this.drag.pointer) return

    const moved = this.drag.moved
    this.drag = null
    this.panel.classList.remove('m3-bottom-sheet_dragging')
    if (this.handle?.hasPointerCapture?.(event.pointerId)) this.handle.releasePointerCapture(event.pointerId)

    if (canceled) {
      this.setHeight(this.targetHeight())
    } else if (moved) {
      this.suppressClick = true
      const position = bottomSheetPosition(this.panel.getBoundingClientRect().height, this.heights)
      if (position === 'closed') this.current.onDismiss()
      else this.changeExpansion(position === 'expanded')
    }
  }

  private onClick(event: MouseEvent) {
    if (this.suppressClick) {
      this.suppressClick = false
      event.preventDefault()
      event.stopPropagation()
      return
    }

    if (this.heights.expanded - this.heights.collapsed < 1) this.current.onDismiss()
    else this.changeExpansion(!this.expanded)
  }

  update(next: Omit<BottomSheetControllerOptions, 'panel' | 'content' | 'handle'>) {
    this.current = { ...this.current, ...next }
    if (next.expanded !== this.externalExpanded) {
      this.expanded = next.expanded
      this.externalExpanded = next.expanded
    }
    this.measure()
  }

  expand() { this.changeExpansion(true) }
  collapse() { this.changeExpansion(false) }

  dispose() {
    this.listeners.abort('Bottom sheet disposed')
    this.observer?.disconnect()
    this.panel.classList.remove('m3-bottom-sheet_dragging')
  }
}

/** Attach the drag handle, size observer, and viewport listener to a mounted sheet. */
export function attachBottomSheet(options: BottomSheetControllerOptions): BottomSheetController {
  return new BottomSheetManager(options)
}
