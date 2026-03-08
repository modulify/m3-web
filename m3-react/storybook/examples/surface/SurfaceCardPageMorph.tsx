import type {
  FC,
} from 'react'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'
import {
  M3Navigation,
  M3NavigationTab,
} from '@/components/navigation'
import { M3SurfacePanel } from '@/components/surface'
import { useSurfaceCardPageMorph } from '@/components/surface/orchestration/useSurfaceCardPageMorph'
import { useStateRef } from '@/components/surface/orchestration/useStateRef'
import {
  m3MotionDurations,
  m3MotionEasings,
} from '@modulify/m3-foundation/lib/motion'

import { toClassName } from '@/utils/styling'

const TRANSITION_MS = m3MotionDurations.medium3
const TRANSITION_EASING = m3MotionEasings.standard

type NavTab = 'files' | 'timeline' | 'tasks' | 'analytics'

const SurfaceCardPageMorph: FC = () => {
  const [navExpanded, setNavExpanded] = useStateRef(false)
  const [activeNavTab, setActiveNavTab] = useStateRef<NavTab>('files')
  const {
    expanded,
    busy,
    backgroundCollapsed,
    originHeight,
    overlayStyle,
    canvasRef: canvas,
    originSlotRef: originSlot,
    toggleCardMode,
  } = useSurfaceCardPageMorph(TRANSITION_MS)
  const overlayActive = busy || expanded
  const compactWrapStyle = {
    width: '100%',
  } as const

  const morphSurfaceNode = (
    <M3SurfacePanel
      className={toClassName([
        'surface-card-page__morph-surface',
        expanded
          ? 'surface-card-page__morph-surface_expanded'
          : 'surface-card-page__morph-surface_compact',
      ])}
      fillWidth={true}
      fillHeight={overlayActive}
      rounding={expanded ? 0 : 24}
      transitionMs={TRANSITION_MS}
      transitionTiming={TRANSITION_EASING}
      variant={expanded ? 'surface' : 'surface-container-low'}
      elevation={expanded ? 0 : 1}
      overflow="auto"
      data-testid="surface-card-morph"
    >
      <h3>Morph target surface</h3>
      <p>
        In compact mode this surface behaves like a card. In expanded mode it replaces the
        page work area while keeping top bar and rail reserved.
      </p>

      <M3SurfacePanel
        className="surface-card-page__morph-nested"
        fillHeight={false}
        height={120}
        rounding={14}
        variant={expanded ? 'surface-container-low' : 'surface-container-high'}
        elevation={expanded ? 1 : 3}
      >
        Nested surface demonstrates composability in both states.
      </M3SurfacePanel>
    </M3SurfacePanel>
  )

  return (
    <div
      className="surface-card-page"
      data-card-expanded={expanded ? 'true' : 'false'}
      data-testid="surface-card-page-root"
    >
      <M3SurfacePanel
        className="surface-card-page__topbar"
        fillHeight={false}
        height={72}
        variant="surface-container"
        elevation={0}
      >
        <div className="surface-card-page__topbar-content">
          <div>
            <strong>Surface orchestration: card replacing page</strong>
            <p>The same surface morphs between compact card and page-like container.</p>
          </div>

          <M3Button
            appearance="filled"
            disabled={busy}
            data-testid="surface-card-toggle"
            onClick={() => void toggleCardMode()}
          >
            {expanded ? 'Return to card state' : 'Expand card to page state'}
          </M3Button>
        </div>
      </M3SurfacePanel>

      <M3Navigation
        expanded={navExpanded}
        onToggle={setNavExpanded}
        className="surface-card-page__nav"
        appearance="auto"
        alignment="top"
      >
        <M3Navigation.Top>
          <M3IconButton
            aria-label="Open navigation"
            onClick={() => setNavExpanded(true)}
          >
            <M3Icon name="menu" />
          </M3IconButton>
        </M3Navigation.Top>

        <M3NavigationTab
          label="Files"
          active={activeNavTab === 'files'}
          onNavigate={() => {
            setActiveNavTab('files')
            setNavExpanded(false)
          }}
        >
          <M3Icon name="folder" />
        </M3NavigationTab>

        <M3NavigationTab
          label="Timeline"
          active={activeNavTab === 'timeline'}
          onNavigate={() => {
            setActiveNavTab('timeline')
            setNavExpanded(false)
          }}
        >
          <M3Icon name="schedule" />
        </M3NavigationTab>

        <M3NavigationTab
          label="Tasks"
          active={activeNavTab === 'tasks'}
          onNavigate={() => {
            setActiveNavTab('tasks')
            setNavExpanded(false)
          }}
        >
          <M3Icon name="check_circle" />
        </M3NavigationTab>

        <M3NavigationTab
          label="Analytics"
          active={activeNavTab === 'analytics'}
          onNavigate={() => {
            setActiveNavTab('analytics')
            setNavExpanded(false)
          }}
        >
          <M3Icon name="insights" />
        </M3NavigationTab>
      </M3Navigation>

      <div className="surface-card-page__body">
        <div className="surface-card-page__workspace">
          <M3SurfacePanel
            className="surface-card-page__header-card"
            fillHeight={false}
            height={120}
            rounding={20}
            variant="surface-container-lowest"
            elevation={0}
          >
            <h3>Card-to-page transition playground</h3>
            <p>Original slot remains reserved while the morphing surface overlays the page area.</p>
          </M3SurfacePanel>

          <div
            ref={canvas}
            className="surface-card-page__canvas"
            data-testid="surface-card-canvas"
          >
            {!backgroundCollapsed ? (
              <div
                className="surface-card-page__grid"
                data-testid="surface-card-grid"
              >
                <div
                  ref={originSlot}
                  className={toClassName([
                    'surface-card-page__origin-slot',
                    {
                      'surface-card-page__origin-slot_filled': !overlayActive,
                    },
                  ])}
                  style={overlayActive ? { minHeight: `${originHeight}px` } : undefined}
                  data-testid="surface-card-origin"
                >
                  {!overlayActive ? (
                    <div
                      className="surface-card-page__overlay-wrap surface-card-page__overlay-wrap_inline"
                      style={compactWrapStyle}
                      data-testid="surface-card-overlay-wrap"
                    >
                      {morphSurfaceNode}
                    </div>
                  ) : null}
                </div>

                <M3SurfacePanel
                  className="surface-card-page__grid-card"
                  fillHeight={false}
                  height={184}
                  rounding={16}
                  variant="surface-container-low"
                  elevation={1}
                >
                  <strong>Static card A</strong>
                  <p>Background content remains in flow.</p>
                </M3SurfacePanel>

                <M3SurfacePanel
                  className="surface-card-page__grid-card"
                  fillHeight={false}
                  height={184}
                  rounding={16}
                  variant="surface-container"
                  elevation={2}
                >
                  <strong>Static card B</strong>
                  <p>Independent surface in the same scene.</p>
                </M3SurfacePanel>
              </div>
            ) : null}

            {overlayActive ? (
              <div className="surface-card-page__overlay">
                <div
                  className="surface-card-page__overlay-wrap"
                  style={overlayStyle}
                  data-testid="surface-card-overlay-wrap"
                >
                  {morphSurfaceNode}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SurfaceCardPageMorph
