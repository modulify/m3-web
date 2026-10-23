import type { Appearance } from '@modulify/m3-foundation/types/components/list'
import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { HTMLAttributes, Ref } from 'react'

import { useRef } from 'react'

import defineComponent from '@/utils/component'
import { toClassName } from '@/utils/styling'
import { useElementReference } from '@/hooks'

export interface M3ListProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<M3ListExposed>;
  appearance?: Appearance;
}

export interface M3ListExposed extends ElementReference<HTMLDivElement> {}

export default defineComponent(function M3List({
  ref: _ref,
  appearance = 'standard',
  className = '',
  children = [],
  ...attrs
}: M3ListProps, { expose }: ComponentSetupContext<M3ListExposed>) {
  const root = useRef<HTMLDivElement | null>(null)
  expose(useElementReference(root))

  return (
    <div
      ref={root}
      role="list"
      className={toClassName([className, {
        'm3-list': true,
        [`m3-list_${appearance}`]: appearance !== 'standard',
      }])}
      {...attrs}
    >
      {children}
    </div>
  )
})
