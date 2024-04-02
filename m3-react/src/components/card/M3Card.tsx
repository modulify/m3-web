import type {
  FC,
  HTMLAttributes,
  ReactNode,
} from 'react'

import type { Appearance } from '@modulify/m3-foundation/types/components/card'

import type { M3RippleMethods } from '@/components/ripple'

import { M3Ripple } from '@/components/ripple'

import { useRef } from 'react'

import makeId from '@/utils/id'

import { compose } from '@/utils/events'
import {
  augment,
  distinct,
} from '@/utils/content'
import { toClassName } from '@/utils/styling'

export interface M3CardProps extends HTMLAttributes<HTMLElement> {
  appearance?: Appearance;
  heading?: string;
  subheading?: string;
  interactive?: boolean;
  landscape?: boolean;
}

const Content: FC<{ children: ReactNode }> = props => <>{props.children}</>

const Media: FC<HTMLAttributes<HTMLElement>> = ({
  className = '',
  children = [],
  ...attrs
}) => (
  <div className={toClassName(['m3-card__media', className])} {...attrs}>
    {children}
  </div>
)

const Heading: FC<HTMLAttributes<HTMLElement>> = ({
  className = '',
  children = [],
  ...attrs
}) => (
  <div className={toClassName(['m3-card__heading', className])} {...attrs}>
    {children}
  </div>
)

const Subheading: FC<HTMLAttributes<HTMLElement>> = ({
  className = '',
  children = [],
  ...attrs
}) => (
  <div className={toClassName(['m3-card__subheading', className])} {...attrs}>
    {children}
  </div>
)

const M3Card: FC<M3CardProps> = ({
  id = makeId('m3-card'),
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
}) => {
  const state = useRef<HTMLDivElement | null>(null)
  const ripple = useRef<M3RippleMethods | null>(null)

  const [slots, content, hasSlot] = distinct(children, {
    content: Content,
    heading: Heading,
    media: Media,
    subheading: Subheading,
  })

  const hasHeading = hasSlot('heading') || heading.length > 0
  const hasSubheading = hasSlot('subheading') || subheading.length > 0

  const headingId = slots.heading?.props.id ?? null
  const headingEl = slots.heading
    ? headingId ? slots.heading : augment(slots.heading, { id: id + '-heading' })
    : heading.length
      ? <Heading id={id + '-heading'} children={heading} />
      : null

  const aria = !('aria-label' in attrs) && !hasSlot('content') && hasHeading ? {
    'aria-labelledby': headingId ?? id + '-heading',
  } : {}

  return (
    <section
      className={toClassName([className, {
        ['m3-card']: true,
        ['m3-card_' + appearance]: true,
        ['m3-card_interactive']: interactive,
        ['m3-card_landscape']: landscape,
      }])}
      role={role}
      onClick={compose(event => {
        if (interactive) {
          ripple.current?.activate(event)
        }
      }, onClick)}
      {...{
        ...(interactive ? { tabindex: 0 } : {}),
        ...aria,
        ...attrs,
      }}
    >
      {interactive ? (
        <div ref={state} className="m3-card__state">
          <M3Ripple ref={ripple} owner={state}/>
        </div>
      ) : null}
      {slots.content ?? (<>
        {slots.media}
        <div className="m3-card__content">
          {hasHeading || hasSubheading ? (
            <div className="m3-card__head">
              {headingEl}
              {slots.subheading ?? (subheading.length ? <Subheading children={subheading} /> : null) }
            </div>
          ) : null}
          {content}
        </div>
      </>)}
    </section>
  )
}

export default Object.assign(M3Card, {
  Content,
  Heading,
  Media,
  Subheading,
})
