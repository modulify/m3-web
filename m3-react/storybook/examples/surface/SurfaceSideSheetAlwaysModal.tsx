import type { FC } from 'react'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'
import {
  M3Navigation,
  M3NavigationTab,
} from '@/components/navigation'
import { M3Surface } from '@/components/surface'
import { useStateRef } from '@/components/surface/orchestration/useStateRef'
import {
  clamp,
  raf,
  wait,
} from '@modulify/m3-foundation/lib/surface/orchestration'
import {
  m3MotionDurations,
  m3MotionEasings,
} from '@modulify/m3-foundation/lib/motion'

import {
  useEffect,
  useRef,
} from 'react'

const SIDE_SHEET_WIDTH_MIN = 280
const SIDE_SHEET_WIDTH_MAX = 360
const SIDE_SHEET_WIDTH_RATIO = 0.32
const SIDE_SHEET_WIDTH_STEP = 4

const MODAL_INSET_TOP = 0
const MODAL_INSET_BOTTOM = 0
const MODAL_INSET_END = 0
const PANEL_TRANSITION_MS = m3MotionDurations.medium2
const PANEL_TRANSITION_EASING = m3MotionEasings.standard
const SCRIM_FADE_MS = m3MotionDurations.long2

type NavTab = 'inbox' | 'boards' | 'archive' | 'lab'

const SurfaceSideSheetAlwaysModal: FC = () => {
  const [navExpanded, setNavExpanded] = useStateRef(false)
  const [activeNavTab, setActiveNavTab] = useStateRef<NavTab>('inbox')
  const [sideSheetWidth, setSideSheetWidth, sideSheetWidthRef] = useStateRef(320)
  const [modalInsetRight, setModalInsetRight] = useStateRef(-(sideSheetWidthRef.current + 12))
  const [modalRadiusLeft, setModalRadiusLeft] = useStateRef(0)
  const [modalElevation, setModalElevation] = useStateRef(0)
  const [modalMounted, setModalMounted, modalMountedRef] = useStateRef(false)
  const [modalVisible, setModalVisible] = useStateRef(false)
  const [transitioning, setTransitioning, transitioningRef] = useStateRef(false)

  const layoutRoot = useRef<HTMLDivElement | null>(null)

  const hiddenInsetRight = (width: number) => -(width + 12)

  const resolveSheetWidthFromLayout = () => {
    const layoutWidth = Math.round(layoutRoot.current?.getBoundingClientRect().width ?? window.innerWidth)
    const estimated = Math.round((layoutWidth * SIDE_SHEET_WIDTH_RATIO) / SIDE_SHEET_WIDTH_STEP) * SIDE_SHEET_WIDTH_STEP

    return clamp(estimated, SIDE_SHEET_WIDTH_MIN, SIDE_SHEET_WIDTH_MAX)
  }

  const syncFixedWidth = () => {
    const width = resolveSheetWidthFromLayout()
    setSideSheetWidth(width)

    if (!modalMountedRef.current) {
      setModalInsetRight(hiddenInsetRight(width))
    }

    return width
  }

  const openModal = async () => {
    if (transitioningRef.current || modalMountedRef.current) {
      return
    }

    setTransitioning(true)
    const width = syncFixedWidth()

    setModalRadiusLeft(0)
    setModalElevation(0)
    setModalInsetRight(hiddenInsetRight(width))
    setModalMounted(true)

    await raf()

    setModalVisible(true)
    await raf()

    setModalInsetRight(MODAL_INSET_END)
    setModalRadiusLeft(28)
    setModalElevation(1)
    await wait(PANEL_TRANSITION_MS)
    setTransitioning(false)
  }

  const closeModal = async () => {
    if (transitioningRef.current || !modalMountedRef.current) {
      return
    }

    setTransitioning(true)
    setModalInsetRight(hiddenInsetRight(sideSheetWidthRef.current))
    setModalRadiusLeft(0)
    setModalElevation(0)
    await wait(PANEL_TRANSITION_MS)

    setModalVisible(false)
    await wait(SCRIM_FADE_MS)
    setModalMounted(false)
    setTransitioning(false)
  }

  useEffect(() => {
    const onResize = () => {
      syncFixedWidth()
    }

    syncFixedWidth()
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div
      className="surface-side-sheet"
      data-modal-mounted={modalMounted ? 'true' : 'false'}
      data-testid="surface-always-root"
    >
      <M3Surface
        className="surface-side-sheet__topbar"
        fillHeight={false}
        height={72}
        variant="surface-container"
        elevation={0}
      >
        <div className="surface-side-sheet__topbar-content">
          <div>
            <strong>Surface orchestration: always-modal side sheet</strong>
            <p>The side sheet exists only in modal mode and can be shown repeatedly from the page header.</p>
          </div>

          <M3Button
            appearance="tonal"
            disabled={transitioning || modalMounted}
            data-testid="surface-always-open"
            onClick={() => void openModal()}
          >
            {modalMounted ? 'Modal side sheet is open' : 'Show modal side sheet'}
          </M3Button>
        </div>
      </M3Surface>

      <M3Navigation
        expanded={navExpanded}
        onToggle={setNavExpanded}
        className="surface-side-sheet__nav"
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
          label="Inbox"
          active={activeNavTab === 'inbox'}
          onNavigate={() => {
            setActiveNavTab('inbox')
            setNavExpanded(false)
          }}
        >
          <M3Icon name="inbox" />
        </M3NavigationTab>

        <M3NavigationTab
          label="Boards"
          active={activeNavTab === 'boards'}
          onNavigate={() => {
            setActiveNavTab('boards')
            setNavExpanded(false)
          }}
        >
          <M3Icon name="dashboard" />
        </M3NavigationTab>

        <M3NavigationTab
          label="Archive"
          active={activeNavTab === 'archive'}
          onNavigate={() => {
            setActiveNavTab('archive')
            setNavExpanded(false)
          }}
        >
          <M3Icon name="archive" />
        </M3NavigationTab>

        <M3NavigationTab
          label="Lab"
          active={activeNavTab === 'lab'}
          onNavigate={() => {
            setActiveNavTab('lab')
            setNavExpanded(false)
          }}
        >
          <M3Icon name="science" />
        </M3NavigationTab>
      </M3Navigation>

      <div className="surface-side-sheet__body">
        <div className="surface-side-sheet__workspace">
          <M3Surface
            className="surface-side-sheet__header-card"
            fillHeight={false}
            height={120}
            rounding={20}
            variant="surface-container-lowest"
            elevation={0}
          >
            <h3>Workspace surfaces</h3>
            <p>Background layout stays in flow while the side sheet appears as a modal overlay.</p>
          </M3Surface>

          <div
            ref={layoutRoot}
            className="surface-side-sheet__layout"
            data-testid="surface-always-layout"
          >
            <main
              className="surface-side-sheet__content-grid"
              data-testid="surface-always-content-grid"
            >
              <M3Surface
                className="surface-side-sheet__grid-surface"
                fillHeight={false}
                height={136}
                rounding={18}
                variant="surface-container-lowest"
                elevation={0}
              >
                <strong>surface-container-lowest</strong>
                <p>Read-heavy content block in the page flow.</p>
              </M3Surface>

              <M3Surface
                className="surface-side-sheet__grid-surface"
                fillHeight={false}
                height={136}
                rounding={18}
                variant="surface-container-low"
                elevation={1}
              >
                <strong>surface-container-low</strong>
                <p>Secondary block with mild emphasis.</p>
              </M3Surface>

              <M3Surface
                className="surface-side-sheet__grid-surface"
                fillHeight={false}
                height={136}
                rounding={18}
                variant="surface-container-high"
                elevation={3}
              >
                <strong>surface-container-high</strong>
                <p>Contextual utility content.</p>
              </M3Surface>

              <M3Surface
                className="surface-side-sheet__grid-surface"
                fillHeight={false}
                height={136}
                rounding={18}
                variant="surface-dim"
                elevation={0}
              >
                <strong>surface-dim</strong>
                <p>Low-brightness complementary content.</p>
              </M3Surface>
            </main>

            {modalMounted ? (
              <M3Surface
                className="surface-side-sheet__sheet surface-side-sheet__sheet_modal"
                mode="modal"
                shown={modalVisible}
                anchor="end"
                fillWidth={false}
                fillHeight={false}
                width={sideSheetWidth}
                insetTop={MODAL_INSET_TOP}
                insetRight={modalInsetRight}
                insetBottom={MODAL_INSET_BOTTOM}
                roundingTopLeft={modalRadiusLeft}
                roundingBottomLeft={modalRadiusLeft}
                roundingTopRight={0}
                roundingBottomRight={0}
                transitionMs={PANEL_TRANSITION_MS}
                transitionTiming={PANEL_TRANSITION_EASING}
                zIndex={520}
                variant="surface-container-high"
                elevation={modalElevation}
                overflow="auto"
                data-testid="surface-always-panel"
                onDismiss={() => void closeModal()}
              >
                <div className="surface-side-sheet__modal-header">
                  <h3>Modal side sheet</h3>

                  <M3IconButton
                    className="surface-side-sheet__modal-close"
                    appearance="standard"
                    aria-label="Close modal side sheet"
                    disabled={transitioning}
                    data-testid="surface-always-close"
                    onClick={() => void closeModal()}
                  >
                    <M3Icon name="close" />
                  </M3IconButton>
                </div>

                <p>This side sheet is always modal and never returns to a docked state.</p>
                <p>Close actions: scrim click or close button inside the panel.</p>
                <p className="surface-side-sheet__meta">
                  Fixed width: {sideSheetWidth}px
                </p>
              </M3Surface>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SurfaceSideSheetAlwaysModal
