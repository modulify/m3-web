import type {
  FC,
} from 'react'

import type { M3PopperProps } from '@/components/popper'

import { M3Popper } from '@/components/popper'

import { toClassName } from '@/utils/styling'

export interface M3MenuProps extends M3PopperProps {}

const M3Menu: FC<M3MenuProps> = ({
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
}) => (
  <M3Popper
    target={target}
    shown={shown}
    targetTriggers={['click']}
    placement={placement}
    strategy={strategy}
    boundary={boundary}
    container={container}
    offsetMainAxis={offsetMainAxis}
    offsetCrossAxis={offsetCrossAxis}
    overflow={overflow}
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
