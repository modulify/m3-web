import type {
  Alignment,
  Appearance,
} from '@modulify/m3-foundation/types/components/navigation'

import { CSSTransition } from 'react-transition-group'

import M3NavigationAppearance from '@/components/navigation/M3NavigationAppearance'
import M3NavigationSection from './M3NavigationSection'

import React, {
  isValidElement,
  useEffect,
  useState,
} from 'react'

import { createPortal } from 'react-dom'
import { compose } from '@/utils/events'
import { toClassName } from '@/utils/styling'
import { useBreakpoint } from '@/composables/breakpoint'

export interface M3NavigationProps extends React.HTMLAttributes<HTMLElement> {
  appearance?: Appearance;
  alignment?: Alignment;
  expanded?: boolean;
  onToggle?: (expanded: boolean) => void;
}

const Top: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  className = '',
  children = [],
  ...attrs
}) => (
  <div className={toClassName(['m3-navigation__top', className])} {...attrs}>
    {children}
  </div>
)

const Header: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  className = '',
  children = [],
  ...attrs
}) => (
  <div className={toClassName(['m3-navigation__header', className])} {...attrs}>
    {children}
  </div>
)

const Subheader: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  className = '',
  children = [],
  ...attrs
}) => (
  <M3NavigationSection.Header className={className} {...attrs}>
    {children}
  </M3NavigationSection.Header>
)

const toSlots = (children: React.ReactNode) => {
  let top: React.ReactNode = null
  let header: React.ReactNode = null
  let subheader: React.ReactNode = null

  const content: React.ReactNode[] = []
  const sections: React.ReactNode[] = []

  React.Children.forEach(children, child => {
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

// eslint-disable-next-line max-lines-per-function
const M3Navigation: React.FC<M3NavigationProps> = ({
  appearance = 'auto',
  alignment = 'top',
  expanded = false,
  className = '',
  children = [],
  onToggle = (_: boolean) => {},
  onTransitionEnd = (_) => {},
  ...attrs
}) => {
  const appearanceActual: Appearance = expanded ? 'drawer' : appearance
  const breakpoint = useBreakpoint()

  const slots = toSlots(children)

  const [transitioning, setTransitioning] = useState(expanded)

  useEffect(() => {
    if (expanded) {
      setTransitioning(true)
    }
  }, [expanded])

  useEffect(() => {
    if (appearance === 'auto' && breakpoint.ge('large')) {
      onToggle(false)
      setTransitioning(false)
    }
  }, [appearance, breakpoint])

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
          style={!expanded && !transitioning ? { display: 'none' } : null}
          onClick={() => onToggle(false)}
        />
      </CSSTransition>

      <nav
        className={toClassName([className, {
          ['m3-navigation']: true,
          ['m3-navigation_' + appearanceActual]: true,
          ['m3-navigation_' + alignment]: true,
          ['m3-navigation_modal']: expanded || transitioning,
        }])}
        onTransitionEnd={compose(() => {
          if (!expanded) {
            setTransitioning(false)
          }
        }, onTransitionEnd)}
        {...attrs}
      >
        {slots.top}
        {slots.header}
        <M3NavigationAppearance.Provider value={appearanceActual}>
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