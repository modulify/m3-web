import type {
  CSSProperties,
  FC,
} from 'react'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'
import {
  M3Navigation,
  M3NavigationTab,
} from '@/components/navigation'
import { M3Surface } from '@/components/surface'
import {
  m3MotionDurations,
  m3MotionEasings,
} from '@modulify/m3-foundation/lib/motion'

import {
  useEffect,
  useRef,
} from 'react'

import { toClassName } from '@/utils/styling'

import {
  raf,
  useStateRef,
  wait,
} from './utils'

const TRANSITION_MS = m3MotionDurations.medium3
const TRANSITION_EASING = m3MotionEasings.standard

type NavTab = 'files' | 'timeline' | 'tasks' | 'analytics'

type Motion = {
  top: number;
  left: number;
  width: number;
  height: number;
}

const SurfaceCardPageMorph: FC = () => {
  const [expanded, setExpanded, expandedRef] = useStateRef(false)
  const [busy, setBusy, busyRef] = useStateRef(false)
  const [navExpanded, setNavExpanded] = useStateRef(false)
  const [backgroundCollapsed, setBackgroundCollapsed] = useStateRef(false)
  const [activeNavTab, setActiveNavTab] = useStateRef<NavTab>('files')
  const [originHeight, setOriginHeight] = useStateRef(220)

  const [motion, setMotion] = useStateRef<Motion>({
    top: 16,
    left: 16,
    width: 320,
    height: 220,
  })

  const canvas = useRef<HTMLDivElement | null>(null)
  const originSlot = useRef<HTMLDivElement | null>(null)

  const overlayStyle: CSSProperties = {
    top: `${motion.top}px`,
    left: `${motion.left}px`,
    width: `${motion.width}px`,
    height: `${motion.height}px`,
  }

  const measureOrigin = (): Motion | null => {
    if (!canvas.current || !originSlot.current) {
      return null
    }

    const canvasRect = canvas.current.getBoundingClientRect()
    const originRect = originSlot.current.getBoundingClientRect()

    return {
      top: originRect.top - canvasRect.top,
      left: originRect.left - canvasRect.left,
      width: originRect.width,
      height: originRect.height,
    }
  }

  const measureExpanded = (): Motion | null => {
    if (!canvas.current) {
      return null
    }

    const canvasRect = canvas.current.getBoundingClientRect()

    return {
      top: 0,
      left: 0,
      width: canvasRect.width,
      height: canvasRect.height,
    }
  }

  const initMotion = async () => {
    await raf()

    const origin = measureOrigin()
    if (!origin) {
      return
    }

    setMotion(origin)
    setOriginHeight(origin.height)
  }

  const expandCard = async () => {
    setBackgroundCollapsed(false)

    const origin = measureOrigin()
    if (origin) {
      setMotion(origin)
      setOriginHeight(origin.height)
    }

    setExpanded(true)
    await raf()

    const full = measureExpanded()
    if (!full) {
      return
    }

    setMotion(full)
    await wait(TRANSITION_MS)
    setBackgroundCollapsed(true)
  }

  const collapseCard = async () => {
    if (backgroundCollapsed) {
      setBackgroundCollapsed(false)
      await raf()
    }

    const full = measureExpanded()
    if (full) {
      setMotion(full)
    }

    const origin = measureOrigin()
    if (origin) {
      setOriginHeight(origin.height)
    }

    setExpanded(false)
    await raf()

    if (!origin) {
      return
    }

    setMotion(origin)
    await wait(TRANSITION_MS)
  }

  const toggleCardMode = async () => {
    if (busyRef.current) {
      return
    }

    setBusy(true)

    if (expandedRef.current) {
      await collapseCard()
      setBusy(false)
      return
    }

    await expandCard()
    setBusy(false)
  }

  useEffect(() => {
    void initMotion()
  }, [])

  return (
    <div
      className="surface-card-page"
      data-card-expanded={expanded ? 'true' : 'false'}
      data-testid="surface-card-page-root"
    >
      <M3Surface
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
      </M3Surface>

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
          <M3Surface
            className="surface-card-page__header-card"
            fillHeight={false}
            height={120}
            rounding={20}
            variant="surface-container-lowest"
            elevation={0}
          >
            <h3>Card-to-page transition playground</h3>
            <p>Original slot remains reserved while the morphing surface overlays the page area.</p>
          </M3Surface>

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
                  className="surface-card-page__origin-slot"
                  style={{ minHeight: `${originHeight}px` }}
                  data-testid="surface-card-origin"
                />

                <M3Surface
                  className="surface-card-page__grid-card"
                  fillHeight={false}
                  height={184}
                  rounding={16}
                  variant="surface-container-low"
                  elevation={1}
                >
                  <strong>Static card A</strong>
                  <p>Background content remains in flow.</p>
                </M3Surface>

                <M3Surface
                  className="surface-card-page__grid-card"
                  fillHeight={false}
                  height={184}
                  rounding={16}
                  variant="surface-container"
                  elevation={2}
                >
                  <strong>Static card B</strong>
                  <p>Independent surface in the same scene.</p>
                </M3Surface>
              </div>
            ) : null}

            <div className="surface-card-page__overlay">
              <div
                className="surface-card-page__overlay-wrap"
                style={overlayStyle}
                data-testid="surface-card-overlay-wrap"
              >
                <M3Surface
                  className={toClassName([
                    'surface-card-page__morph-surface',
                    expanded
                      ? 'surface-card-page__morph-surface_expanded'
                      : 'surface-card-page__morph-surface_compact',
                  ])}
                  fillWidth={true}
                  fillHeight={true}
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

                  <M3Surface
                    className="surface-card-page__morph-nested"
                    fillHeight={false}
                    height={120}
                    rounding={14}
                    variant={expanded ? 'surface-container-low' : 'surface-container-high'}
                    elevation={expanded ? 1 : 3}
                  >
                    Nested surface demonstrates composability in both states.
                  </M3Surface>
                </M3Surface>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SurfaceCardPageMorph
