import React from 'react'

import { isEmptyNode } from '@/utils/content'
import { toClassName } from '@/utils/styling'

export interface M3BadgeProps extends React.HTMLAttributes<HTMLElement> {
  label?: string;
}

const M3Badge: React.FC<M3BadgeProps> = ({
  label = '',
  className = '',
  children = null,
  ...args
}) => (
  <span
    className={toClassName([className, {
      'm3-badge': true,
      'm3-badge_labelled': !isEmptyNode(children) || label.length > 0,
    }])}
    {...args}
  >
    {children ?? label}
  </span>
)

export default M3Badge