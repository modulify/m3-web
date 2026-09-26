import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { HTMLAttributes, Ref } from 'react'

import { useRef } from 'react'

import defineComponent from '@/utils/component'
import { toClassName } from '@/utils/styling'
import { useElementReference } from '@/hooks'

export interface M3ListProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<M3ListExposed>;
  divided?: boolean;
}

export interface M3ListExposed extends ElementReference<HTMLDivElement> {}

export default defineComponent(function M3List({
  ref: _ref,
  divided = false,
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
        'm3-list_divided': divided,
      }])}
      {...attrs}
    >
      {children}
    </div>
  )
})
