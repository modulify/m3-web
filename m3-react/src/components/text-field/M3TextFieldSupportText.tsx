import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { HTMLAttributes, Ref } from 'react'

import { useRef } from 'react'

import defineComponent from '@/utils/component'
import { toClassName } from '@/utils/styling'
import { useElementReference } from '@/hooks'

export interface M3TextFieldSupportTextProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<M3TextFieldSupportTextExposed>;
  text?: string;
  danger?: boolean;
  muted?: boolean;
}

export interface M3TextFieldSupportTextExposed extends ElementReference<HTMLDivElement> {}

export default defineComponent(function M3TextFieldSupportText({
  ref: _ref,
  text = '',
  danger = false,
  muted = false,
  className = '',
  children = null,
  ...attrs
}: M3TextFieldSupportTextProps, { expose }: ComponentSetupContext<M3TextFieldSupportTextExposed>) {
  const root = useRef<HTMLDivElement | null>(null)
  expose(useElementReference(root))

  return (
    <div
      ref={root}
      className={toClassName([className, {
        'm3-text-field-support-text': true,
        'm3-text-field-support-text_danger': danger,
        'm3-text-field-support-text_muted': muted,
      }])}
      {...attrs}
    >
      {children ?? text}
    </div>
  )
})
