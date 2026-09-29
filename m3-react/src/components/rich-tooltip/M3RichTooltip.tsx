import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { M3PopperExposed, M3PopperMethods, M3PopperProps } from '@/components/popper'
import type { Ref } from 'react'

import { mergeIdRefs } from '@modulify/m3-foundation/lib/dom'
import { useId, useRef } from 'react'

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
  const headingId = 'm3-rich-tooltip-heading-' + useId()

  const [slots, content] = distinct(children, {
    heading: Heading,
    footer: Footer,
  })

  const {
    role: roleProp,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledByProp,
    ...attrs
  } = props
  const role = roleProp ?? (slots.footer ? 'dialog' : 'tooltip')
  const ariaLabelledBy = role === 'dialog'
    && slots.heading
    && (ariaLabel === undefined || ariaLabelledByProp !== undefined)
    ? mergeIdRefs(ariaLabelledByProp, headingId)
    : ariaLabelledByProp

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
      delay={delay}
      overflow={overflow}
      className={toClassName(['m3-rich-tooltip', className])}
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      {...attrs}
    >
      <div className="m3-rich-tooltip__content">
        {slots.heading ? (
          <h3 id={headingId} className="m3-rich-tooltip__heading">
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
