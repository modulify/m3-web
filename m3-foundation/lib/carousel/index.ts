import type { CarouselGeometry } from './geometry'
import type { CarouselScroll, CarouselVariant } from '../../types/components/carousel'

import { carouselGeometry } from './geometry'

export type { CarouselFrame, CarouselGeometry, CarouselGeometryOptions } from './geometry'

export { carouselGeometry } from './geometry'

export interface CarouselControllerOptions {
  variant: CarouselVariant;
  scroll: CarouselScroll;
  preferred: number;
  onChange?: (index: number) => void;
}

export interface CarouselController {
  update(options: CarouselControllerOptions): void;
  goTo(index: number, smooth?: boolean): void;
  dispose(): void;
}

class NativeCarouselController implements CarouselController {
  private readonly viewport: HTMLElement
  private readonly track: HTMLElement
  private readonly stage: HTMLElement
  private readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  private readonly listeners = new AbortController()
  private readonly observer = new ResizeObserver(() => this.measure())
  private options: CarouselControllerOptions
  private items: HTMLElement[] = []
  private geometry: CarouselGeometry
  private frame = 0
  private snapTimer = 0
  private clickTimer = 0
  private active = -1
  private rtl = false
  private pointer: { id: number; start: number; offset: number; anchor: number; moved: boolean } | null = null
  private suppressClick = false

  constructor (private readonly root: HTMLElement, options: CarouselControllerOptions) {
    this.viewport = root.querySelector<HTMLElement>('.m3-carousel__scroll')!
    this.track = root.querySelector<HTMLElement>('.m3-carousel__track')!
    this.stage = root.querySelector<HTMLElement>('.m3-carousel__stage')!
    this.options = options
    this.geometry = carouselGeometry({
      variant: options.variant,
      width: 1,
      height: 1,
      count: 0,
      preferred: options.preferred,
      aspects: [],
      reduced: this.reducedMotion.matches,
    })
    this.listen()
    this.observer.observe(root)
    this.measure()
  }

  private offset () {
    return this.geometry.vertical ? this.viewport.scrollTop : this.viewport.scrollLeft
  }

  private limit () {
    return Math.max(0, this.geometry.extent - this.geometry.viewport)
  }

  private nearest (current = this.offset()) {
    const limit = this.limit()
    return this.geometry.positions.reduce((result, position, index) => {
      const distance = Math.abs(Math.min(position, limit) - current)
      const previous = Math.abs(Math.min(this.geometry.positions[result], limit) - current)
      const atEnd = distance === previous && limit > 0 && current >= limit - 1

      if (distance < previous || atEnd) return index
      return result
    }, 0)
  }

  private render () {
    this.frame = 0
    if (!this.items.length) return
    const frames = this.geometry.frames(this.offset())

    this.items.forEach((item, index) => {
      const current = frames[index]
      const position = this.rtl ? this.geometry.viewport - current.offset - current.size : current.offset

      item.style.setProperty('--m3-carousel-offset', position + 'px')
      item.style.setProperty('--m3-carousel-size', current.size + 'px')
      item.style.setProperty('--m3-carousel-parallax', (this.rtl ? -current.parallax : current.parallax) + 'px')
      item.style.setProperty('--m3-carousel-large', this.geometry.large + 'px')
      item.style.direction = this.rtl ? 'rtl' : 'ltr'
      item.dataset.scale = current.scale
    })

    const next = this.nearest()
    if (next !== this.active) {
      this.active = next
      this.options.onChange?.(next)
    }
  }

  private scheduleRender () {
    if (!this.frame) this.frame = requestAnimationFrame(() => this.render())
  }

  private snap () {
    this.snapTimer = 0
    if (this.pointer || this.options.scroll !== 'snap' || !this.items.length) return

    const index = this.nearest()
    const target = Math.min(this.geometry.positions[index], this.limit())
    if (Math.abs(this.offset() - target) > 1) this.goTo(index)
  }

  private onScroll () {
    this.scheduleRender()
    window.clearTimeout(this.snapTimer)
    this.snapTimer = window.setTimeout(() => this.snap(), 100)
  }

  private onPointerDown (event: PointerEvent) {
    if (event.pointerType !== 'mouse' || event.button !== 0) return

    const target = event.target as Element
    if (target.closest('a, button, input, textarea, select')) return

    this.viewport.style.userSelect = 'none'
    this.pointer = {
      id: event.pointerId,
      start: this.geometry.vertical ? event.clientY : event.clientX,
      offset: this.offset(),
      anchor: this.nearest(),
      moved: false,
    }
  }

  private onPointerMove (event: PointerEvent) {
    if (!this.pointer || event.pointerId !== this.pointer.id) return
    const difference = (this.geometry.vertical ? event.clientY : event.clientX) - this.pointer.start
    if (Math.abs(difference) > 4) this.pointer.moved = true
    if (!this.pointer.moved) return

    this.viewport.setPointerCapture(event.pointerId)
    if (this.geometry.vertical) {
      this.viewport.scrollTop = this.pointer.offset - difference
    } else {
      this.viewport.scrollLeft = this.pointer.offset - difference
    }
  }

  private onPointerUp (event: PointerEvent) {
    if (!this.pointer || event.pointerId !== this.pointer.id) return

    const { anchor, offset, moved } = this.pointer
    const distance = this.offset() - offset
    const step = (this.geometry.positions[1] ?? 0) - (this.geometry.positions[0] ?? 0)
    const threshold = Math.max(20, Math.min(36, step * 0.15))

    this.suppressClick = moved

    window.clearTimeout(this.clickTimer)

    this.clickTimer = window.setTimeout(() => this.suppressClick = false, 0)
    this.pointer = null
    this.viewport.style.userSelect = ''

    if (this.viewport.hasPointerCapture(event.pointerId)) {
      this.viewport.releasePointerCapture(event.pointerId)
    }

    window.clearTimeout(this.snapTimer)

    if (this.options.scroll === 'snap' && moved && Math.abs(distance) >= threshold) {
      const closest = this.nearest()
      const next = distance > 0 ? Math.max(closest, anchor + 1) : Math.min(closest, anchor - 1)
      this.goTo(next)
    } else {
      this.snapTimer = window.setTimeout(() => this.snap(), 100)
    }
  }

  private onPointerCancel (event: PointerEvent) {
    if (!this.pointer || event.pointerId !== this.pointer.id) return
    this.pointer = null
    this.viewport.style.userSelect = ''
  }

  private onKeyDown (event: KeyboardEvent) {
    const target = (event.target as Element).closest<HTMLElement>('.m3-carousel__item')
    if (!target || !this.root.contains(target)) return

    const activates = event.key === 'Enter' || event.key === ' '
    const interactive = target.classList.contains('m3-carousel__item_interactive')
    const disabled = target.getAttribute('aria-disabled') === 'true'

    if (activates && event.target === target && interactive && !disabled) {
      event.preventDefault()
      target.classList.add('m3-carousel__item_pressed')
      return
    }

    const index = this.items.indexOf(target)
    let direction = 0

    if (this.geometry.vertical) {
      if (event.key === 'ArrowDown') direction = 1
      if (event.key === 'ArrowUp') direction = -1
    } else {
      if (event.key === 'ArrowRight') direction = this.rtl ? -1 : 1
      if (event.key === 'ArrowLeft') direction = this.rtl ? 1 : -1
    }

    if (!direction && event.key !== 'Home' && event.key !== 'End') return

    let step = direction
    let next = index + direction

    if (event.key === 'Home') {
      step = 1
      next = 0
    } else if (event.key === 'End') {
      step = -1
      next = this.items.length - 1
    }

    while (next >= 0 && next < this.items.length && this.items[next].getAttribute('aria-disabled') === 'true') {
      next += step
    }

    if (next < 0 || next >= this.items.length) return

    event.preventDefault()
    this.items[next].focus({ preventScroll: true })
    this.goTo(next)
  }

  private onKeyUp (event: KeyboardEvent) {
    if (event.key !== 'Enter' && event.key !== ' ') return

    const target = event.target
    if (!(target instanceof HTMLElement) || !target.classList.contains('m3-carousel__item_interactive')) return

    target.classList.remove('m3-carousel__item_pressed')
    if (!this.root.contains(target) || target.getAttribute('aria-disabled') === 'true') return

    event.preventDefault()
    target.click()
  }

  private listen () {
    const signal = this.listeners.signal
    this.viewport.addEventListener('scroll', () => this.onScroll(), { passive: true, signal })
    this.viewport.addEventListener('pointerdown', event => this.onPointerDown(event), { signal })
    window.addEventListener('pointermove', event => this.onPointerMove(event), { signal })
    window.addEventListener('pointerup', event => this.onPointerUp(event), { signal })
    window.addEventListener('pointercancel', event => this.onPointerCancel(event), { signal })
    this.viewport.addEventListener('dragstart', event => {
      if (this.pointer) event.preventDefault()
    }, { signal })
    this.viewport.addEventListener('click', event => {
      if (!this.suppressClick) return
      event.preventDefault()
      event.stopPropagation()
      this.suppressClick = false
    }, { capture: true, signal })
    this.root.addEventListener('focusin', event => {
      const target = (event.target as Element).closest<HTMLElement>('.m3-carousel__item')
      if (!target?.matches(':focus-visible')) return

      const index = this.items.indexOf(target)
      if (index >= 0) this.goTo(index)
    }, { signal })
    this.root.addEventListener('focusout', event => {
      const item = (event.target as Element).closest<HTMLElement>('.m3-carousel__item')
      item?.classList.remove('m3-carousel__item_pressed')
    }, { signal })
    this.root.addEventListener('keydown', event => this.onKeyDown(event), { signal })
    this.root.addEventListener('keyup', event => this.onKeyUp(event), { signal })
    this.reducedMotion.addEventListener('change', () => this.measure(), { signal })
  }

  private sizeTrack () {
    if (this.geometry.vertical) {
      this.track.style.blockSize = this.geometry.extent + 'px'
      this.track.style.inlineSize = '100%'
      this.stage.style.blockSize = this.geometry.viewport + 'px'
      this.stage.style.inlineSize = '100%'
    } else {
      this.track.style.inlineSize = this.geometry.extent + 'px'
      this.track.style.blockSize = '100%'
      this.stage.style.inlineSize = this.geometry.viewport + 'px'
      this.stage.style.blockSize = '100%'
    }
  }

  private measure () {
    const previous = this.geometry
    const previousLimit = this.limit()
    const current = this.offset()
    this.items = Array.from(this.stage.querySelectorAll<HTMLElement>('.m3-carousel__item'))
    this.geometry = carouselGeometry({
      variant: this.options.variant,
      width: Math.max(1, this.root.clientWidth),
      height: Math.max(1, this.root.clientHeight),
      count: this.items.length,
      preferred: this.options.preferred,
      aspects: this.items.map(item => Number(item.dataset.aspect) || 1),
      reduced: this.reducedMotion.matches,
    })
    const changed = previous.vertical !== this.geometry.vertical
      || previous.extent !== this.geometry.extent
      || previous.viewport !== this.geometry.viewport
      || previous.large !== this.geometry.large
      || previous.positions.length !== this.geometry.positions.length
      || previous.positions.some((position, index) => position !== this.geometry.positions[index])

    this.rtl = !this.geometry.vertical && getComputedStyle(this.root).direction === 'rtl'
    this.sizeTrack()
    // Repeated framework updates must not interrupt an in-flight smooth scroll.
    if (changed && previousLimit && current && this.active >= 0) this.goTo(this.active, false)
    this.render()
  }

  update (options: CarouselControllerOptions) {
    this.options = options
    this.measure()
  }

  goTo (index: number, smooth = true) {
    const item = Math.max(0, Math.min(this.items.length - 1, index))
    const target = Math.min(this.geometry.positions[item] ?? 0, this.limit())

    this.viewport.scrollTo({
      [this.geometry.vertical ? 'top' : 'left']: target,
      behavior: smooth && !this.reducedMotion.matches ? 'smooth' : 'auto',
    })
    this.scheduleRender()
  }

  dispose () {
    this.viewport.style.userSelect = ''
    this.listeners.abort('Carousel controller disposed')
    this.observer.disconnect()
    window.clearTimeout(this.snapTimer)
    window.clearTimeout(this.clickTimer)
    if (this.frame) cancelAnimationFrame(this.frame)
  }
}

export function attachCarousel(root: HTMLElement, options: CarouselControllerOptions): CarouselController {
  return new NativeCarouselController(root, options)
}
