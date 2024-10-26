import type {
  FC,
  HTMLAttributes,
  ReactNode,
} from 'react'

import type {
  Alignment,
  Appearance,
} from '@modulify/m3-foundation/types/components/navigation'

import { CSSTransition } from 'react-transition-group'

import M3NavigationAppearance from '@/components/navigation/M3NavigationAppearance'
import M3NavigationSection from './M3NavigationSection'

import {
  Children,
  isValidElement,
  useEffect,
  useMemo,
} from 'react'

import { createPortal } from 'react-dom'

import {
  useBreakpoint,
  useRecord,
  useWatch,
} from '@/hooks'

import { compose } from '@/utils/events'
import { toClassName } from '@/utils/styling'

export interface M3NavigationProps extends HTMLAttributes<HTMLElement> {
  appearance?: Appearance;
  alignment?: Alignment;
  expanded?: boolean;
  onToggle?: (expanded: boolean) => void;
}

const Top: FC<HTMLAttributes<HTMLElement>> = ({
  className = '',
  children = [],
  ...attrs
}) => (
  <div className={toClassName(['m3-navigation__top', className])} {...attrs}>
    {children}
  </div>
)

const Header: FC<HTMLAttributes<HTMLElement>> = ({
  className = '',
  children = [],
  ...attrs
}) => (
  <div className={toClassName(['m3-navigation__header', className])} {...attrs}>
    {children}
  </div>
)

const Subheader: FC<HTMLAttributes<HTMLElement>> = ({
  className = '',
  children = [],
  ...attrs
}) => (
  <M3NavigationSection.Header className={className} {...attrs}>
    {children}
  </M3NavigationSection.Header>
)

const distinct = (children: ReactNode) => {
  let top: ReactNode = null
  let header: ReactNode = null
  let subheader: ReactNode = null

  const content: ReactNode[] = []
  const sections: ReactNode[] = []

  Children.forEach(children, child => {
    if (isValidElement(child)) {
      switch (child.type) {
        case Top:
          top = child; break
        case Header:
          header = child; break
        case Subheader:
          subheader = child; break
        case M3NavigationSection:
          sections.push(child); break
        default:
          content.push(child)
      }
    } else {
      content.push(child)
    }
  })

  return { top, header, subheader, content, sections }
}

const M3Navigation: FC<M3NavigationProps> = ({
  appearance = 'auto',
  alignment = 'top',
  expanded = false,
  className = '',
  children = [],
  onToggle = (_: boolean) => {},
  onTransitionEnd = (_) => {},
  ...attrs
}) => {
  const breakpoint = useBreakpoint()

  const state = useRecord({
    appearance: expanded ? 'drawer' : appearance,
    transitioning: expanded,
  }, ['appearance', 'transitioning'])

  const slots = useMemo(() => distinct(children), [children])

  const handlers = useRecord({
    onToggle,
  })

  useWatch(onToggle, onToggle => handlers.onToggle = onToggle)

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
          style={!expanded && !state.transitioning ? { display: 'none' } : null}
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
        {slots.top}
        {slots.header}
        <M3NavigationAppearance.Provider value={state.appearance}>
          <M3NavigationSection>
            {slots.subheader}
            {slots.content}
          </M3NavigationSection>
          {slots.sections}
        </M3NavigationAppearance.Provider>
      </nav>
    </>,
    document.body
  )
}

export default Object.assign(M3Navigation, {
  Header,
  Subheader,
  Top,
})