import type { ComponentSetupContext } from '@/utils/component'
import type {
  DividerInset,
  DividerOrientation,
} from '@modulify/m3-foundation/types/components/divider'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { HTMLAttributes, Ref } from 'react'

import { useRef } from 'react'

import defineComponent from '@/utils/component'
import { toClassName } from '@/utils/styling'
import { useElementReference } from '@/hooks'

export interface M3DividerProps extends Omit<HTMLAttributes<HTMLHRElement>, 'children'> {
  ref?: Ref<M3DividerExposed>;
  orientation?: DividerOrientation;
  inset?: DividerInset;
}

export interface M3DividerExposed extends ElementReference<HTMLHRElement> {}

export default defineComponent(function M3Divider({
  ref: _ref,
  orientation = 'horizontal',
  inset = 'none',
  role = 'presentation',
  'aria-orientation': ariaOrientation,
  className = '',
  ...attrs
}: M3DividerProps, { expose }: ComponentSetupContext<M3DividerExposed>) {
  const root = useRef<HTMLHRElement | null>(null)
  expose(useElementReference(root))

  return (
    <hr
      ref={root}
      className={toClassName([className, {
        'm3-divider': true,
        'm3-divider_vertical': orientation === 'vertical',
        [`m3-divider_inset-${inset}`]: inset !== 'none',
      }])}
      role={role}
      aria-orientation={ariaOrientation ?? (role === 'separator' && orientation === 'vertical' ? 'vertical' : undefined)}
      {...attrs}
    />
  )
})
