import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { M3PopperExposed, M3PopperProps } from '@/components/popper'
import type { Ref } from 'react'

import { useRef } from 'react'

import { M3Popper } from '@/components/popper'

import defineComponent from '@/utils/component'
import { toClassName } from '@/utils/styling'

export interface M3MenuProps extends Omit<M3PopperProps, 'ref'> {
  ref?: Ref<M3MenuExposed>;
}

export interface M3MenuExposed extends ElementReference<HTMLDivElement> {}

export default defineComponent(function M3Menu({
  ref: _ref,
  target,
  shown = false,
  placement = 'bottom',
  strategy = 'absolute',
  boundary = 'clippingAncestors',
  container = 'body',
  offsetMainAxis = 0,
  offsetCrossAxis = 0,
  overflow = ['flip', 'shift', 'hide'],
  delay = { hide: 200 },
  disabled = false,
  detachTimeout = 5000,
  className = '',
  children = [],
  onShow = () => {},
  onHide = (_reason) => {},
  onToggle = (_shown: boolean) => {},
  ...attrs
}: M3MenuProps, { expose }: ComponentSetupContext<M3MenuExposed>) {
  const root = useRef<M3PopperExposed | null>(null)

  expose({
    get el () { return root.current?.el ?? null },
  })

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
    className={toClassName(['m3-menu', className])}
    animated
    hideOnMissClick
    {...attrs}
    onShow={onShow}
    onHide={onHide}
    onToggle={onToggle}
  >
    {children}
  </M3Popper>
})
