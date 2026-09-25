import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { M3PopperExposed, M3PopperMethods, M3PopperProps } from '@/components/popper'
import type { Ref } from 'react'

import { useRef } from 'react'

import { M3Popper } from '@/components/popper'

import defineComponent from '@/utils/component'
import { defineSlot, distinct } from '@/utils/content'
import { toClassName } from '@/utils/styling'

export interface M3RichTooltipProps extends Omit<M3PopperProps, 'ref'> {
  ref?: Ref<M3RichTooltipExposed>;
}

export interface M3RichTooltipExposed extends M3RichTooltipMethods, ElementReference<HTMLDivElement> {}

export interface M3RichTooltipMethods extends M3PopperMethods {}

const Heading = defineSlot('M3RichTooltip.Heading')
const Footer = defineSlot('M3RichTooltip.Footer')

export default defineComponent(function M3RichTooltip({
  ref: _ref,
  delay = { hide: 150 },
  overflow = ['flip', 'shift', 'hide'],
  className = '',
  children = [],
  ...props
}: M3RichTooltipProps, { expose }: ComponentSetupContext<M3RichTooltipExposed>) {
  const popper = useRef<M3PopperExposed | null> (null)

  const [slots, content] = distinct(children, {
    heading: Heading,
    footer: Footer,
  })

  expose({
    get el () { return popper.current?.el ?? null },
    show: (immediately = false) => popper.current?.show(immediately),
    hide: (immediately = false, reason: 'generic') => popper.current?.hide(immediately, reason),
    adjust: () => popper.current?.adjust() ?? Promise.resolve(),
    contains: (el: Element | null) => popper.current?.contains(el) ?? false,
  })

  return (
    <M3Popper
      ref={popper}
      className={toClassName(['m3-rich-tooltip', className])}
      delay={delay}
      overflow={overflow}
      role="tooltip"
      {...props}
    >
      <div className="m3-rich-tooltip__content">
        {slots.heading ? (
          <h3 className="m3-rich-tooltip__heading">
            {slots.heading}
          </h3>
        ) : null}
        {content}
      </div>
      {slots.footer ? (
        <div className="m3-rich-tooltip__footer">
          {slots.footer}
        </div>
      ) : null}
    </M3Popper>
  )
}, {
  slots: { Heading, Footer },
})
