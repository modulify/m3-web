import type { ForwardRefRenderFunction } from 'react'
import type { M3PopperMethods, M3PopperProps } from '@/components/popper'

import { forwardRef, useImperativeHandle, useRef } from 'react'

import { M3Popper } from '@/components/popper'

import { defineSlot, distinct } from '@/utils/content'
import { toClassName } from '@/utils/styling'

export interface M3RichTooltipProps extends M3PopperProps {}
export interface M3RichTooltipMethods extends M3PopperMethods {}

const Heading = defineSlot('M3RichTooltip.Heading')
const Footer = defineSlot('M3RichTooltip.Footer')

const M3RichTooltip: ForwardRefRenderFunction<
  M3RichTooltipMethods,
  M3RichTooltipProps
> = ({
  delay = { hide: 150 },
  overflow = ['flip', 'shift', 'hide'],
  className = '',
  children = [],
  ...props
}, ref) => {
  const popper = useRef<M3PopperMethods | null> (null)

  const [slots, content] = distinct(children, {
    heading: Heading,
    footer: Footer,
  })

  useImperativeHandle(ref, () => ({
    show: (immediately = false) => popper.current?.show(immediately),
    hide: (immediately = false, reason: 'generic') => popper.current?.hide(immediately, reason),
    adjust: () => popper.current?.adjust() ?? Promise.resolve(),
    contains: (el: Element | null) => popper.current?.contains(el) ?? false,
  }))

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
}

export default Object.assign(forwardRef(M3RichTooltip), {
  Heading,
  Footer,
})
