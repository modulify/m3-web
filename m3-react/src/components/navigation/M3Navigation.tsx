import type {
  Alignment,
  Appearance,
  AutoAppearance,
} from '@modulify/m3-foundation/types/components/navigation'
import type { ComponentSetupContext } from '@/utils/component'
import type { FC, HTMLAttributes } from 'react'
import type { NavigationView } from '@modulify/m3-foundation/types/components/navigation'
import type { RailCollapse } from '@modulify/m3-foundation/types/components/navigation'
import type {
  RailExpandedMode,
} from '@modulify/m3-foundation/types/components/navigation'
import type { ReactNode } from 'react'
import type { Ref } from 'react'

import { activateModalFocus } from '@modulify/m3-foundation/lib/modal'
import { createPortal } from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import {
  isBarAppearance,
  isExpandableAppearance,
  isExpandedRail,
  isHiddenRail,
  isModalExpansion,
  resolveNavigationAppearance,
} from '@modulify/m3-foundation/lib/navigation'
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react'

import M3NavigationAppearance from '@/components/navigation/M3NavigationAppearance'

import defineComponent from '@/utils/component'
import { defineSlot, distinct } from '@/utils/content'
import { toClassName } from '@/utils/styling'
import {
  useBreakpoint,
  useLayerHost,
  useRecord,
  useWatch,
} from '@/hooks'

import M3NavigationSection from './M3NavigationSection'
import M3NavigationView, { useM3NavigationView } from './M3NavigationView'

export interface M3NavigationProps extends Omit<HTMLAttributes<HTMLElement>, 'onToggle'> {
  ref?: Ref<M3NavigationExposed>;
  appearance?: Appearance;
  appearances?: readonly [AutoAppearance, ...AutoAppearance[]];
  alignment?: Alignment;
  expansion?: RailExpandedMode;
  collapse?: RailCollapse;
  expanded?: boolean;
  onToggle?: (expanded: boolean) => void;
}

export interface M3NavigationExposed extends M3NavigationMethods {}

export interface M3NavigationMethods {
  expand (): void;
  collapse (): void;
}

type ViewSlotProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  children?: ReactNode | ((props: { view: NavigationView }) => ReactNode);
}

const ViewSlotContent: FC<Pick<ViewSlotProps, 'children'>> = ({ children }) => {
  const view = useM3NavigationView()

  return <>{typeof children === 'function' ? view && children({ view }) : children}</>
}

const Top: FC<ViewSlotProps> = defineSlot('M3Navigation.Top', ({
  className = '',
  children = [],
  ...attrs
}) => (
  <div className={toClassName(['m3-navigation__top', className])} {...attrs}>
    <ViewSlotContent>{children}</ViewSlotContent>
  </div>
))

const Header: FC<ViewSlotProps> = defineSlot('M3Navigation.Header', ({
  className = '',
  children = [],
  ...attrs
}) => (
  <div className={toClassName(['m3-navigation__header', className])} {...attrs}>
    <ViewSlotContent>{children}</ViewSlotContent>
  </div>
))

const Subheader: FC<ViewSlotProps> = defineSlot('M3Navigation.Subheader', ({
  className = '',
  children = [],
  ...attrs
}) => (
  <M3NavigationSection.Header className={className} {...attrs}>
    <ViewSlotContent>{children}</ViewSlotContent>
  </M3NavigationSection.Header>
))

export default defineComponent(function M3Navigation({
  ref: _ref,
  appearance = 'auto',
  appearances,
  alignment = 'top',
  expansion = 'auto',
  collapse = 'rail',
  expanded = false,
  className = '',
  children = [],
  onToggle = (_: boolean) => {},
  onTransitionEnd = (_) => {},
  ...attrs
}: M3NavigationProps, { expose }: ComponentSetupContext<M3NavigationExposed>) {
  const breakpoint = useBreakpoint()

  const appearanceBase = appearance === 'auto'
    ? resolveNavigationAppearance(breakpoint.name, appearances)
    : appearance
  const previousAppearanceBase = useRef(appearanceBase)
  const state = useRecord({
    transitioning: isModalExpansion(appearanceBase, expanded, expansion, breakpoint.ge('large')),
  }, ['transitioning'])

  const appearanceActual = isExpandedRail(appearanceBase, expanded)
    || isHiddenRail(appearanceBase, expanded, collapse) && state.transitioning
    ? 'rail-expanded'
    : appearanceBase

  const modalDialog = useRef<HTMLDivElement | null>(null)
  const modalExpanded = isModalExpansion(appearanceBase, expanded, expansion, breakpoint.ge('large'))
  const modalActive = isExpandableAppearance(appearanceBase)
    && (isModalExpansion(appearanceBase, expanded, expansion, breakpoint.ge('large')) || state.transitioning)
  const layerHost = useLayerHost(modalActive)

  const railHidden = isHiddenRail(appearanceBase, expanded, collapse)
  const railLeaving = isHiddenRail(appearanceBase, expanded, collapse) && state.transitioning
  const view: NavigationView = {
    appearance: appearanceActual,
    modal: modalActive,
    hidden: railHidden && !railLeaving,
  }

  const scrim = useRef<HTMLDivElement | null>(null)
  const navigation = useRef<HTMLElement | null>(null)

  const { 'aria-hidden': ariaHidden, inert, ...navigationAttrs } = attrs

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
  const handlers = useRecord({ onToggle })

  useWatch(onToggle, onToggle => handlers.onToggle = onToggle)

  expose({
    expand: () => {
      if (isExpandableAppearance(appearanceBase)) handlers.onToggle(true)
    },
    collapse: () => {
      if (isExpandableAppearance(appearanceBase)) handlers.onToggle(false)
    },
  })

  useWatch(modalExpanded, expanded => {
    if (expanded) {
      state.transitioning = true
    }
  })

  useEffect(() => {
    if (!isExpandableAppearance(appearanceBase)
      || (previousAppearanceBase.current !== appearanceBase && !modalExpanded)) {
      state.transitioning = false
    }
    previousAppearanceBase.current = appearanceBase

    if (expanded && isBarAppearance(appearanceBase)) {
      handlers.onToggle(false)
    }
  }, [appearanceBase, expanded, modalExpanded])

  useEffect(() => {
    const element = navigation.current
    if (!isBarAppearance(appearanceActual) || !element || typeof ResizeObserver === 'undefined') {
      return
    }

    const observer = new ResizeObserver(() => {
      document.documentElement.style.setProperty('--m3-navigation-bar-measured-height', `${element.getBoundingClientRect().height}px`)
    })
    observer.observe(element)

    return () => {
      observer.disconnect()
      document.documentElement.style.removeProperty('--m3-navigation-bar-measured-height')
    }
  }, [appearanceActual])

  useLayoutEffect(() => {
    const dialog = modalDialog.current
    if (!modalActive || !dialog || !layerHost) return

    return activateModalFocus({
      dialog,
      layer: layerHost,
      onEscape: () => handlers.onToggle(false),
    })
  }, [modalActive, layerHost])

  if (!layerHost) return null

  return createPortal(
    <>
      <CSSTransition
        nodeRef={scrim}
        in={modalExpanded}
        timeout={{ appear: 500, enter: 500, exit: 800 }}
        classNames={{
          appear: 'm3-transition-fade-enter-from',
          appearActive: 'm3-transition-fade-enter-active',
          exit: 'm3-transition-fade-leave-active',
          exitActive: 'm3-transition-fade-leave-to',
        }}
        onExited={() => state.transitioning = false}
      >
        <div
          ref={scrim}
          style={isBarAppearance(appearanceBase) || (!modalExpanded && !state.transitioning) ? { display: 'none' } : undefined}
          className="m3-scrim"
          onClick={() => handlers.onToggle(false)}
        />
      </CSSTransition>

      <div
        ref={modalDialog}
        role={modalActive ? 'dialog' : undefined}
        aria-modal={modalActive ? true : undefined}
        aria-label={modalActive ? (attrs['aria-label'] ?? 'Navigation') : undefined}
        tabIndex={-1}
      >
        <nav
          ref={navigation}
          className={toClassName([className, {
            ['m3-navigation']: true,
            ['m3-navigation_' + appearanceActual]: true,
            ['m3-navigation_bar']: isBarAppearance(appearanceActual),
            ['m3-navigation_' + alignment]: true,
            ['m3-navigation_modal']: view.modal,
            ['m3-navigation_hide-collapsed']: appearanceBase === 'rail' && collapse === 'hidden',
            ['m3-navigation_rail-leaving']: railLeaving,
            ['m3-navigation_rail-hidden']: view.hidden,
          }])}
          aria-hidden={railHidden || ariaHidden}
          inert={railHidden || inert}
          {...navigationAttrs}
          onTransitionEnd={onTransitionEnd}
        >
          <M3NavigationAppearance.Provider value={appearanceActual}>
            <M3NavigationView.Provider value={view}>
              {parsed.slots.top}
              {parsed.slots.header}
              <div className="m3-navigation__body">
                <M3NavigationSection>
                  {parsed.slots.subheader}
                  {parsed.content}
                </M3NavigationSection>
                {parsed.collections.sections}
              </div>
            </M3NavigationView.Provider>
          </M3NavigationAppearance.Provider>
        </nav>
      </div>
    </>,
    layerHost
  )
}, {
  slots: { Header, Subheader, Top },
})
