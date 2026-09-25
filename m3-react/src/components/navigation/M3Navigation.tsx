import type {
  Alignment,
  Appearance,
} from '@modulify/m3-foundation/types/components/navigation'
import type { ComponentSetupContext } from '@/utils/component'
import type { FC, HTMLAttributes, Ref } from 'react'

import { CSSTransition } from 'react-transition-group'

import { createPortal } from 'react-dom'
import { useEffect, useMemo } from 'react'

import M3NavigationAppearance from '@/components/navigation/M3NavigationAppearance'

import { compose } from '@/utils/events'
import defineComponent from '@/utils/component'
import { defineSlot, distinct } from '@/utils/content'
import { toClassName } from '@/utils/styling'
import { useBreakpoint, useRecord, useWatch } from '@/hooks'

import M3NavigationSection from './M3NavigationSection'

export interface M3NavigationProps extends Omit<HTMLAttributes<HTMLElement>, 'onToggle'> {
  ref?: Ref<M3NavigationExposed>;
  appearance?: Appearance;
  alignment?: Alignment;
  expanded?: boolean;
  onToggle?: (expanded: boolean) => void;
}

export interface M3NavigationExposed extends M3NavigationMethods {}

export interface M3NavigationMethods {
  expand (): void;
  collapse (): void;
}

const Top: FC<HTMLAttributes<HTMLElement>> = defineSlot('M3Navigation.Top', ({
  className = '',
  children = [],
  ...attrs
}) => (
  <div className={toClassName(['m3-navigation__top', className])} {...attrs}>
    {children}
  </div>
))

const Header: FC<HTMLAttributes<HTMLElement>> = defineSlot('M3Navigation.Header', ({
  className = '',
  children = [],
  ...attrs
}) => (
  <div className={toClassName(['m3-navigation__header', className])} {...attrs}>
    {children}
  </div>
))

const Subheader: FC<HTMLAttributes<HTMLElement>> = defineSlot('M3Navigation.Subheader', ({
  className = '',
  children = [],
  ...attrs
}) => (
  <M3NavigationSection.Header className={className} {...attrs}>
    {children}
  </M3NavigationSection.Header>
))

export default defineComponent(function M3Navigation({
  ref: _ref,
  appearance = 'auto',
  alignment = 'top',
  expanded = false,
  className = '',
  children = [],
  onToggle = (_: boolean) => {},
  onTransitionEnd = (_) => {},
  ...attrs
}: M3NavigationProps, { expose }: ComponentSetupContext<M3NavigationExposed>) {
  const breakpoint = useBreakpoint()

  const state = useRecord({
    appearance: expanded ? 'drawer' : appearance,
    transitioning: expanded,
  }, ['appearance', 'transitioning'])

  const parsed = useMemo(() => distinct(children, {
    slots: {
      top: Top,
      header: Header,
      subheader: Subheader,
    },
    collections: {
      sections: M3NavigationSection,
    },
  }), [children])

  const handlers = useRecord({
    onToggle,
  })

  useWatch(onToggle, onToggle => handlers.onToggle = onToggle)

  expose({
    expand: () => handlers.onToggle(true),
    collapse: () => handlers.onToggle(false),
  })

  useWatch(expanded, expanded => {
    if (expanded) {
      state.transitioning = true
    }
  })

  useEffect(() => {
    if (appearance === 'auto' && breakpoint.ge('large')) {
      handlers.onToggle(false)
      state.transitioning = false
    }
  }, [appearance, breakpoint])

  useEffect(() => {
    state.appearance = expanded ? 'drawer' : appearance
  }, [appearance, expanded])

  return createPortal(
    <>
      <CSSTransition
        in={expanded}
        timeout={{ appear: 500, enter: 500, exit: 800 }}
        classNames={{
          appear: 'm3-transition-fade-enter-from',
          appearActive: 'm3-transition-fade-enter-active',
          exit: 'm3-transition-fade-leave-active',
          exitActive: 'm3-transition-fade-leave-to',
        }}
      >
        <div
          className="m3-scrim"
          style={!expanded && !state.transitioning ? { display: 'none' } : undefined}
          onClick={() => handlers.onToggle(false)}
        />
      </CSSTransition>

      <nav
        className={toClassName([className, {
          ['m3-navigation']: true,
          ['m3-navigation_' + state.appearance]: true,
          ['m3-navigation_' + alignment]: true,
          ['m3-navigation_modal']: expanded || state.transitioning,
        }])}
        onTransitionEnd={compose(() => {
          if (!expanded) {
            state.transitioning = false
          }
        }, onTransitionEnd)}
        {...attrs}
      >
        {parsed.slots.top}
        {parsed.slots.header}
        <M3NavigationAppearance.Provider value={state.appearance}>
          <M3NavigationSection>
            {parsed.slots.subheader}
            {parsed.content}
          </M3NavigationSection>
          {parsed.collections.sections}
        </M3NavigationAppearance.Provider>
      </nav>
    </>,
    document.body
  )
}, {
  slots: { Header, Subheader, Top },
})
