import type { Appearance } from '@modulify/m3-foundation/types/components/card'
import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { FC, HTMLAttributes } from 'react'
import type { M3RippleExposed } from '@/components/ripple'
import type { Ref } from 'react'

import { useRef } from 'react'

import { M3Ripple } from '@/components/ripple'

import { augment } from '@/utils/content'
import { compose } from '@/utils/events'
import defineComponent from '@/utils/component'
import { defineSlot, distinct } from '@/utils/content'
import { toClassName } from '@/utils/styling'
import {
  useElementEffect,
  useElementReference,
  useId,
  useTarget,
} from '@/hooks'

export interface M3CardProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<M3CardExposed>;
  appearance?: Appearance;
  heading?: string;
  subheading?: string;
  interactive?: boolean;
  landscape?: boolean;
}

export interface M3CardExposed extends ElementReference<HTMLElement> {}

const Content = defineSlot('M3Card.Content')

const Media: FC<HTMLAttributes<HTMLElement>> = defineSlot('M3Card.Media', ({
  className = '',
  children = [],
  ...attrs
}) => (
  <div className={toClassName(['m3-card__media', className])} {...attrs}>
    {children}
  </div>
))

const Heading: FC<HTMLAttributes<HTMLElement>> = defineSlot('M3Card.Heading', ({
  className = '',
  children = [],
  ...attrs
}) => (
  <div className={toClassName(['m3-card__heading', className])} {...attrs}>
    {children}
  </div>
))

const Subheading: FC<HTMLAttributes<HTMLElement>> = defineSlot('M3Card.Subheading', ({
  className = '',
  children = [],
  ...attrs
}) => (
  <div className={toClassName(['m3-card__subheading', className])} {...attrs}>
    {children}
  </div>
))

export default defineComponent(function M3Card({
  ref: _ref,
  id,
  appearance = 'filled',
  heading = '',
  subheading = '',
  interactive = false,
  landscape = false,
  className = '',
  role = 'region',
  children = [],
  onClick = (_) => {},
  ...attrs
}: M3CardProps, { expose }: ComponentSetupContext<M3CardExposed>) {
  const _id = useId(id ,'m3-card')
  const root = useRef<HTMLElement | null>(null)
  const state = useRef<HTMLDivElement | null>(null)
  const ripple = useRef<M3RippleExposed | null>(null)
  const [rippleTarget, setRippleTarget] = useTarget<HTMLDivElement>()
  expose(useElementReference(root))

  const [slots, content, hasSlot] = distinct(children, {
    content: Content,
    heading: Heading,
    media: Media,
    subheading: Subheading,
  })

  useElementEffect(state, setRippleTarget)

  const hasHeading = hasSlot('heading') || heading.length > 0
  const hasSubheading = hasSlot('subheading') || subheading.length > 0

  const headingId = slots.heading?.props.id ?? null
  const headingEl = slots.heading
    ? headingId ? slots.heading : augment(slots.heading, { id: _id + '-heading' })
    : heading.length
      ? <Heading id={_id + '-heading'}>{heading}</Heading>
      : null

  const aria = !('aria-label' in attrs) && !hasSlot('content') && hasHeading ? {
    'aria-labelledby': headingId ?? _id + '-heading',
  } : {}

  return (
    <section
      ref={root}
      className={toClassName([className, {
        ['m3-card']: true,
        ['m3-card_' + appearance]: true,
        ['m3-card_interactive']: interactive,
        ['m3-card_landscape']: landscape,
      }])}
      role={role}
      onClick={compose(event => {
        if (interactive) {
          ripple.current?.activate(event.nativeEvent)
        }
      }, onClick)}
      {...{
        ...(interactive ? { tabIndex: 0 } : {}),
        ...aria,
        ...attrs,
      }}
    >
      {interactive ? (
        <div ref={state} className="m3-card__state">
          <M3Ripple ref={ripple} owner={rippleTarget} />
        </div>
      ) : null}
      {slots.content ?? (<>
        {slots.media}
        <div className="m3-card__content">
          {hasHeading || hasSubheading ? (
            <div className="m3-card__head">
              {headingEl}
              {slots.subheading ?? (subheading.length ? <Subheading>{subheading}</Subheading> : null) }
            </div>
          ) : null}
          {content}
        </div>
      </>)}
    </section>
  )
}, {
  slots: { Content, Heading, Media, Subheading },
})
