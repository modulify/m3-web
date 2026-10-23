import type { Color } from '@modulify/m3-foundation/types/components/menu'
import type { ComponentSetupContext } from '@/utils/component'
import type { Density } from '@modulify/m3-foundation/types/components/menu'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { KeyboardEvent } from 'react'
import type { M3PopperExposed, M3PopperProps } from '@/components/popper'
import type { Ref } from 'react'

import { useRef } from 'react'

import { M3Popper } from '@/components/popper'

import defineComponent from '@/utils/component'
import { toClassName } from '@/utils/styling'

export interface M3MenuProps extends Omit<M3PopperProps, 'ref'> {
  ref?: Ref<M3MenuExposed>;
  color?: Color;
  density?: Density;
}

export interface M3MenuExposed extends ElementReference<HTMLDivElement> {}

export default defineComponent(function M3Menu({
  ref: _ref,
  color = 'standard',
  density = 0,
  target,
  shown = false,
  placement = 'bottom',
  strategy = 'absolute',
  boundary = 'clippingAncestors',
  container,
  offsetMainAxis = 0,
  offsetCrossAxis = 0,
  overflow = ['flip', 'shift', 'hide'],
  delay = { hide: 200 },
  disabled = false,
  detachTimeout = 5000,
  className = '',
  role = 'menu',
  children = [],
  onKeyDown = () => {},
  onShow = () => {},
  onHide = (_reason) => {},
  onToggle = (_shown: boolean) => {},
  ...attrs
}: M3MenuProps, { expose }: ComponentSetupContext<M3MenuExposed>) {
  const root = useRef<M3PopperExposed | null>(null)

  expose({
    get el () { return root.current?.el ?? null },
  })

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (role === 'menu') {
      const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
        ':scope > .m3-menu-item:not([aria-disabled="true"])'
      ))
      const current = items.indexOf(document.activeElement as HTMLElement)
      let next = current
      let handled = false

      switch (event.key) {
        case 'ArrowDown': next = items.length ? (current + 1) % items.length : current; handled = true; break
        case 'ArrowUp': next = items.length ? (current + items.length - 1) % items.length : current; handled = true; break
        case 'Home': next = 0; handled = true; break
        case 'End': next = items.length - 1; handled = true; break
        case 'Escape':
          root.current?.hide(true)
          handled = true
          break
        case 'ArrowLeft':
        case 'ArrowRight':
          if (target instanceof HTMLElement && target.getAttribute('aria-haspopup') === 'menu'
            && event.key === (placement.startsWith('left') ? 'ArrowRight' : 'ArrowLeft')) {
            root.current?.hide(true)
            handled = true
          }
          break
      }

      if (next !== current && items[next]) {
        items[next].focus()
      }

      if (handled) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    onKeyDown(event)
  }

  return <M3Popper
    ref={root}
    target={target}
    shown={shown}
    targetTriggers={['click']}
    disabled={disabled}
    delay={delay}
    detachTimeout={detachTimeout}
    placement={placement}
    strategy={strategy}
    boundary={boundary}
    container={container}
    overflow={overflow}
    offsetMainAxis={offsetMainAxis}
    offsetCrossAxis={offsetCrossAxis}
    className={toClassName(['m3-menu', className, {
      'm3-menu_vibrant': color === 'vibrant',
      [`m3-menu_density-${density}`]: density !== 0,
    }])}
    role={role}
    animated
    hideOnMissClick
    {...attrs}
    onKeyDown={handleKeyDown}
    onShow={onShow}
    onHide={(reason) => {
      if (reason === 'generic' && root.current?.el?.contains(document.activeElement) && target instanceof HTMLElement) {
        requestAnimationFrame(() => target.focus())
      }

      onHide(reason)
    }}
    onToggle={(open) => {
      onToggle(open)

      if (open && role === 'menu' && target instanceof HTMLElement && document.activeElement === target) {
        requestAnimationFrame(() => root.current?.el?.querySelector<HTMLElement>('.m3-menu > .m3-menu-item:not([aria-disabled="true"])')?.focus())
      }
    }}
  >
    {children}
  </M3Popper>
})
