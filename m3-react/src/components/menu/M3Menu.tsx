import type {
  FC,
} from 'react'

import type { M3PopperProps } from '@/components/popper'

import { M3Popper } from '@/components/popper'

import { toClassName } from '@/utils/styling'

export interface M3MenuProps extends M3PopperProps {}

const M3Menu: FC<M3MenuProps> = ({
  shown = false,
  target,
  className = '',
  children = [],
  placement = 'bottom',
  overflow = ['flip', 'shift', 'hide'],
  strategy = 'absolute',
  boundary = 'clippingAncestors',
  container = 'body',
  offsetMainAxis = 0,
  offsetCrossAxis = 0,
  delay = { hide: 200 },
  disabled = false,
  detachTimeout = 5000,
  onShow = () => {},
  onHide = (_reason) => {},
  onToggle = (_shown: boolean) => {},
  ...attrs
}) => (
  <M3Popper
    shown={shown}
    target={target}
    targetTriggers={['click']}
    placement={placement}
    overflow={overflow}
    strategy={strategy}
    boundary={boundary}
    container={container}
    offsetMainAxis={offsetMainAxis}
    offsetCrossAxis={offsetCrossAxis}
    delay={delay}
    disabled={disabled}
    animated={true}
    detachTimeout={detachTimeout}
    className={toClassName(['m3-menu', className])}
    hideOnMissClick={true}
    onShow={onShow}
    onHide={onHide}
    onToggle={onToggle}
    {...attrs}
  >
    {children}
  </M3Popper>
)

export default M3Menu
