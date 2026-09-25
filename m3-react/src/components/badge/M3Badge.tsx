import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { HTMLAttributes, Ref } from 'react'

import { useRef } from 'react'

import defineComponent from '@/utils/component'
import { isEmptyNode } from '@/utils/content'
import { toClassName } from '@/utils/styling'
import { useElementReference } from '@/hooks'

export interface M3BadgeProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<M3BadgeExposed>;
  label?: string;
}

export interface M3BadgeExposed extends ElementReference<HTMLSpanElement> {}

export default defineComponent(function M3Badge({
  ref: _ref,
  label = '',
  className = '',
  children = null,
  ...args
}: M3BadgeProps, { expose }: ComponentSetupContext<M3BadgeExposed>) {
  const root = useRef<HTMLSpanElement | null>(null)
  expose(useElementReference(root))

  return (
    <span
      ref={root}
      className={toClassName([className, {
        'm3-badge': true,
        'm3-badge_labelled': !isEmptyNode(children) || label.length > 0,
      }])}
      {...args}
    >
      {children ?? label}
    </span>
  )
})
