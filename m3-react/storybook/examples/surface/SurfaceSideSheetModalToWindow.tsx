import type {
  CSSProperties,
  FC,
  FormEvent,
} from 'react'
import type { M3SelectOption } from '@/components/select'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'
import {
  M3Navigation,
  M3NavigationTab,
} from '@/components/navigation'
import { M3Select } from '@/components/select'
import {
  M3Surface,
  M3SurfacePanel,
} from '@/components/surface'
import { useStateRef } from '@/components/surface/orchestration/useStateRef'
import {
  clamp,
  raf,
  wait,
} from '@modulify/m3-foundation/lib/surface/orchestration'
import { M3TextField } from '@/components/text-field'
import { getSurfaceStateDescriptor } from '@modulify/m3-foundation/lib/surface/descriptor'
import {
  m3MotionDurations,
  m3MotionEasings,
} from '@modulify/m3-foundation/lib/motion'

import {
  useEffect,
  useRef,
} from 'react'

import { toClassName } from '@/utils/styling'

const SIDE_SHEET_WIDTH_MIN = 280
const SIDE_SHEET_WIDTH_MAX = 360
const SIDE_SHEET_WIDTH_RATIO = 0.32
const SIDE_SHEET_WIDTH_STEP = 4

const WINDOW_WIDTH_MIN = 440
const WINDOW_WIDTH_MAX = 920
const WINDOW_WIDTH_RATIO = 0.72
const WINDOW_WIDTH_STEP = 8

const MODAL_INSET_TOP = 0
const MODAL_INSET_BOTTOM = 0
const MODAL_INSET_END = 0
const PANEL_TRANSITION_MS = m3MotionDurations.medium4
const PANEL_TRANSITION_EASING = m3MotionEasings.standard
const SCRIM_FADE_MS = m3MotionDurations.long2
const DIALOG_HIDE_MS = m3MotionDurations.long2
const HIDDEN_SURFACE_DESCRIPTOR = getSurfaceStateDescriptor('hidden')
const MODAL_SIDE_SHEET_DESCRIPTOR = getSurfaceStateDescriptor('modal_side_sheet')
const MODAL_DIALOG_DESCRIPTOR = getSurfaceStateDescriptor('modal_dialog_window')

type NavTab = 'inbox' | 'boards' | 'archive' | 'lab'
type Priority = 'low' | 'normal' | 'high'

type FormState = {
  project: string;
  ownerEmail: string;
  startDate: string;
  priority: Priority;
  notes: string;
}

const DEFAULT_FORM: FormState = {
  project: 'Q3 Design Refresh',
  ownerEmail: 'owner@example.com',
  startDate: '2026-03-01',
  priority: 'normal',
  notes: 'Move supplemental workflows into a reusable surface with predictable transitions.',
}

const priorityOptions: Array<M3SelectOption<Priority>> = [{
  label: 'Low',
  value: 'low',
}, {
  label: 'Normal',
  value: 'normal',
}, {
  label: 'High',
  value: 'high',
}]

const SurfaceSideSheetModalToWindow: FC = () => {
  const [navExpanded, setNavExpanded] = useStateRef(false)
  const [activeNavTab, setActiveNavTab] = useStateRef<NavTab>('inbox')
  const [sideSheetWidth, setSideSheetWidth, sideSheetWidthRef] = useStateRef(320)
  const [windowWidth, setWindowWidth] = useStateRef(720)

  const [modalInsetRight, setModalInsetRight] = useStateRef(-(sideSheetWidthRef.current + 12))
  const [modalRadiusLeft, setModalRadiusLeft] = useStateRef(HIDDEN_SURFACE_DESCRIPTOR.rounding.topLeft)
  const [modalElevationBase, setModalElevationBase] = useStateRef(HIDDEN_SURFACE_DESCRIPTOR.elevation)

  const [modalMounted, setModalMounted, modalMountedRef] = useStateRef(false)
  const [modalVisible, setModalVisible] = useStateRef(false)
  const [panelAsWindow, setPanelAsWindow, panelAsWindowRef] = useStateRef(false)
  const [windowClosing, setWindowClosing] = useStateRef(false)
  const [transitioning, setTransitioning, transitioningRef] = useStateRef(false)
  const [form, setForm] = useStateRef<FormState>({ ...DEFAULT_FORM })

  const layoutRoot = useRef<HTMLDivElement | null>(null)

  const panelAnchor = panelAsWindow ? MODAL_DIALOG_DESCRIPTOR.anchor : MODAL_SIDE_SHEET_DESCRIPTOR.anchor
  const panelWidth = panelAsWindow ? windowWidth : sideSheetWidth
  const panelInsetRight = panelAsWindow ? 0 : modalInsetRight
  const panelRoundingTopLeft = panelAsWindow ? MODAL_DIALOG_DESCRIPTOR.rounding.topLeft : modalRadiusLeft
  const panelRoundingBottomLeft = panelAsWindow ? MODAL_DIALOG_DESCRIPTOR.rounding.bottomLeft : modalRadiusLeft
  const panelRoundingTopRight = panelAsWindow
    ? MODAL_DIALOG_DESCRIPTOR.rounding.topRight
    : MODAL_SIDE_SHEET_DESCRIPTOR.rounding.topRight
  const panelRoundingBottomRight = panelAsWindow
    ? MODAL_DIALOG_DESCRIPTOR.rounding.bottomRight
    : MODAL_SIDE_SHEET_DESCRIPTOR.rounding.bottomRight
  const panelSurfaceRole = panelAsWindow ? MODAL_DIALOG_DESCRIPTOR.variant : MODAL_SIDE_SHEET_DESCRIPTOR.variant
  const panelElevation = panelAsWindow
    ? Math.max(MODAL_DIALOG_DESCRIPTOR.elevation, modalElevationBase)
    : modalElevationBase
  const panelTransitionMs = panelAsWindow && windowClosing
    ? DIALOG_HIDE_MS
    : PANEL_TRANSITION_MS
  const panelTransitionTiming = PANEL_TRANSITION_EASING
  const panelInlineStyle: CSSProperties = panelAsWindow && windowClosing
    ? {
      opacity: 0,
      transform: 'translate(-50%, calc(-50% - 24px))',
    }
    : {}

  const hiddenInsetRight = (width: number) => -(width + 12)

  const resolveSheetWidthFromLayout = () => {
    const layoutWidth = Math.round(layoutRoot.current?.getBoundingClientRect().width ?? window.innerWidth)
    const estimated = Math.round((layoutWidth * SIDE_SHEET_WIDTH_RATIO) / SIDE_SHEET_WIDTH_STEP) * SIDE_SHEET_WIDTH_STEP

    return clamp(estimated, SIDE_SHEET_WIDTH_MIN, SIDE_SHEET_WIDTH_MAX)
  }

  const resolveWindowWidth = () => {
    const estimated = Math.round((window.innerWidth * WINDOW_WIDTH_RATIO) / WINDOW_WIDTH_STEP) * WINDOW_WIDTH_STEP

    return clamp(estimated, WINDOW_WIDTH_MIN, WINDOW_WIDTH_MAX)
  }

  const syncDimensions = () => {
    const nextSheetWidth = resolveSheetWidthFromLayout()
    setSideSheetWidth(nextSheetWidth)
    setWindowWidth(resolveWindowWidth())

    if (!modalMountedRef.current) {
      setModalInsetRight(hiddenInsetRight(nextSheetWidth))
    }
  }

  const openModal = async () => {
    if (transitioningRef.current || modalMountedRef.current) {
      return
    }

    setTransitioning(true)
    setPanelAsWindow(false)
    setWindowClosing(false)
    syncDimensions()

    setModalRadiusLeft(HIDDEN_SURFACE_DESCRIPTOR.rounding.topLeft)
    setModalElevationBase(HIDDEN_SURFACE_DESCRIPTOR.elevation)
    setModalInsetRight(hiddenInsetRight(sideSheetWidthRef.current))
    setModalMounted(true)

    await raf()

    setModalVisible(true)
    await raf()

    setModalInsetRight(MODAL_INSET_END)
    setModalRadiusLeft(MODAL_SIDE_SHEET_DESCRIPTOR.rounding.topLeft)
    setModalElevationBase(MODAL_SIDE_SHEET_DESCRIPTOR.elevation)
    await wait(PANEL_TRANSITION_MS)
    setTransitioning(false)
  }

  const toggleWindowMode = async () => {
    if (transitioningRef.current || !modalMountedRef.current) {
      return
    }

    setTransitioning(true)

    if (!panelAsWindowRef.current) {
      setPanelAsWindow(true)
      await wait(PANEL_TRANSITION_MS)
      setTransitioning(false)
      return
    }

    setPanelAsWindow(false)
    await wait(PANEL_TRANSITION_MS)
    setTransitioning(false)
  }

  const closeWindowModal = async () => {
    setWindowClosing(true)
    await wait(DIALOG_HIDE_MS)

    setModalVisible(false)
    await wait(SCRIM_FADE_MS)
    setModalMounted(false)

    setModalInsetRight(hiddenInsetRight(sideSheetWidthRef.current))
    setModalRadiusLeft(HIDDEN_SURFACE_DESCRIPTOR.rounding.topLeft)
    setModalElevationBase(HIDDEN_SURFACE_DESCRIPTOR.elevation)
    setWindowClosing(false)
    setPanelAsWindow(false)
  }

  const closeSideSheetModal = async () => {
    setModalInsetRight(hiddenInsetRight(sideSheetWidthRef.current))
    setModalRadiusLeft(HIDDEN_SURFACE_DESCRIPTOR.rounding.topLeft)
    setModalElevationBase(HIDDEN_SURFACE_DESCRIPTOR.elevation)
    await wait(PANEL_TRANSITION_MS)

    setModalVisible(false)
    await wait(SCRIM_FADE_MS)
    setModalMounted(false)
  }

  const closeModal = async () => {
    if (transitioningRef.current || !modalMountedRef.current) {
      return
    }

    setTransitioning(true)

    if (panelAsWindowRef.current) {
      await closeWindowModal()
      setTransitioning(false)
      return
    }

    await closeSideSheetModal()
    setTransitioning(false)
  }

  const resetForm = () => {
    setForm({ ...DEFAULT_FORM })
  }

  useEffect(() => {
    const onResize = () => {
      syncDimensions()
    }

    syncDimensions()
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div
      className="surface-side-sheet-window"
      data-panel-mode={panelAsWindow ? 'window' : 'sheet'}
      data-panel-mounted={modalMounted ? 'true' : 'false'}
      data-testid="surface-window-root"
    >
      <M3SurfacePanel
        className="surface-side-sheet-window__topbar"
        fillHeight={false}
        height={72}
        variant="surface-container"
        elevation={0}
      >
        <div className="surface-side-sheet-window__topbar-content">
          <div>
            <strong>Surface orchestration: modal side sheet to window</strong>
            <p>Use the action inside the panel to morph a modal side sheet into a modal window.</p>
          </div>

          <M3Button
            appearance="tonal"
            disabled={transitioning || modalMounted}
            data-testid="surface-window-open"
            onClick={() => void openModal()}
          >
            {modalMounted ? 'Modal panel is open' : 'Show modal side sheet'}
          </M3Button>
        </div>
      </M3SurfacePanel>

      <M3Navigation
        expanded={navExpanded}
        onToggle={setNavExpanded}
        className="surface-side-sheet-window__nav"
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

      <div className="surface-side-sheet-window__body">
        <div className="surface-side-sheet-window__workspace">
          <M3SurfacePanel
            className="surface-side-sheet-window__header-card"
            fillHeight={false}
            height={120}
            rounding={20}
            variant="surface-container-lowest"
            elevation={0}
          >
            <h3>Workspace surfaces</h3>
            <p>Background layout stays in flow while the modal panel morphs between side-sheet and window geometries.</p>
          </M3SurfacePanel>

          <div
            ref={layoutRoot}
            className="surface-side-sheet-window__layout"
            data-testid="surface-window-layout"
          >
            <main
              className="surface-side-sheet-window__content-grid"
              data-testid="surface-window-content-grid"
            >
              <M3SurfacePanel
                className="surface-side-sheet-window__grid-surface"
                fillHeight={false}
                height={136}
                rounding={18}
                variant="surface-container-lowest"
                elevation={0}
              >
                <strong>surface-container-lowest</strong>
                <p>Read-heavy content block in the page flow.</p>
              </M3SurfacePanel>

              <M3SurfacePanel
                className="surface-side-sheet-window__grid-surface"
                fillHeight={false}
                height={136}
                rounding={18}
                variant="surface-container-low"
                elevation={1}
              >
                <strong>surface-container-low</strong>
                <p>Secondary block with mild emphasis.</p>
              </M3SurfacePanel>

              <M3SurfacePanel
                className="surface-side-sheet-window__grid-surface"
                fillHeight={false}
                height={136}
                rounding={18}
                variant="surface-container-high"
                elevation={3}
              >
                <strong>surface-container-high</strong>
                <p>Contextual utility content.</p>
              </M3SurfacePanel>

              <M3SurfacePanel
                className="surface-side-sheet-window__grid-surface"
                fillHeight={false}
                height={136}
                rounding={18}
                variant="surface-dim"
                elevation={0}
              >
                <strong>surface-dim</strong>
                <p>Low-brightness complementary content.</p>
              </M3SurfacePanel>
            </main>

            {modalMounted ? (
              <M3Surface
                className={toClassName([
                  'surface-side-sheet-window__sheet',
                  panelAsWindow
                    ? 'surface-side-sheet-window__sheet_window'
                    : 'surface-side-sheet-window__sheet_sheet',
                ])}
                mode="modal"
                shown={modalVisible}
                anchor={panelAnchor}
                fillWidth={false}
                fillHeight={false}
                width={panelWidth}
                insetTop={MODAL_INSET_TOP}
                insetRight={panelInsetRight}
                insetBottom={MODAL_INSET_BOTTOM}
                roundingTopLeft={panelRoundingTopLeft}
                roundingBottomLeft={panelRoundingBottomLeft}
                roundingTopRight={panelRoundingTopRight}
                roundingBottomRight={panelRoundingBottomRight}
                transitionMs={panelTransitionMs}
                transitionTiming={panelTransitionTiming}
                zIndex={520}
                variant={panelSurfaceRole}
                elevation={panelElevation}
                style={panelInlineStyle}
                overflow="auto"
                data-panel-mode={panelAsWindow ? 'window' : 'sheet'}
                data-window-closing={windowClosing ? 'true' : 'false'}
                data-testid="surface-window-panel"
                onDismiss={() => void closeModal()}
              >
                <div
                  className="surface-side-sheet-window__panel-content"
                  data-testid="surface-window-panel-content"
                >
                  <div className="surface-side-sheet-window__modal-header">
                    <h3>{panelAsWindow ? 'Window mode' : 'Modal side sheet'}</h3>

                    <div className="surface-side-sheet-window__modal-actions">
                      <M3IconButton
                        className="surface-side-sheet-window__modal-action"
                        appearance="standard"
                        aria-label={panelAsWindow ? 'Dock panel to side sheet mode' : 'Open panel in window mode'}
                        disabled={transitioning}
                        data-testid="surface-window-toggle-mode"
                        onClick={() => void toggleWindowMode()}
                      >
                        <M3Icon name={panelAsWindow ? 'close_fullscreen' : 'open_in_new'} />
                      </M3IconButton>

                      <M3IconButton
                        className="surface-side-sheet-window__modal-action"
                        appearance="standard"
                        aria-label="Close modal panel"
                        disabled={transitioning}
                        data-testid="surface-window-close"
                        onClick={() => void closeModal()}
                      >
                        <M3Icon name="close" />
                      </M3IconButton>
                    </div>
                  </div>

                  <p>Form layout adapts when switching from side-sheet to window mode.</p>

                  <form
                    className={toClassName([
                      'surface-side-sheet-window__form',
                      {
                        'surface-side-sheet-window__form_window': panelAsWindow,
                      },
                    ])}
                    onSubmit={(event: FormEvent<HTMLFormElement>) => event.preventDefault()}
                  >
                    <div className="surface-side-sheet-window__field">
                      <M3TextField
                        value={form.project}
                        label="Project name"
                        placeholder="Q3 Design Refresh"
                        outlined
                        onUpdate={(value) => {
                          setForm((previous) => ({
                            ...previous,
                            project: value,
                          }))
                        }}
                      />
                    </div>

                    <div className="surface-side-sheet-window__field">
                      <M3TextField
                        value={form.ownerEmail}
                        type="email"
                        label="Owner email"
                        placeholder="owner@example.com"
                        outlined
                        onUpdate={(value) => {
                          setForm((previous) => ({
                            ...previous,
                            ownerEmail: value,
                          }))
                        }}
                      />
                    </div>

                    <div className="surface-side-sheet-window__field">
                      <M3TextField
                        value={form.startDate}
                        label="Start date"
                        placeholder="YYYY-MM-DD"
                        outlined
                        onUpdate={(value) => {
                          setForm((previous) => ({
                            ...previous,
                            startDate: value,
                          }))
                        }}
                      />
                    </div>

                    <div className="surface-side-sheet-window__field">
                      <M3Select<Priority>
                        value={form.priority}
                        options={priorityOptions}
                        label="Priority"
                        outlined
                        onUpdate={(value) => {
                          setForm((previous) => ({
                            ...previous,
                            priority: value,
                          }))
                        }}
                      />
                    </div>

                    <div
                      className={toClassName([
                        'surface-side-sheet-window__field',
                        {
                          'surface-side-sheet-window__field_wide': panelAsWindow,
                        },
                      ])}
                    >
                      <M3TextField
                        value={form.notes}
                        multiline
                        label="Notes"
                        placeholder="Describe constraints, risks, and acceptance criteria."
                        outlined
                        onUpdate={(value) => {
                          setForm((previous) => ({
                            ...previous,
                            notes: value,
                          }))
                        }}
                      />
                    </div>

                    <div
                      className={toClassName([
                        'surface-side-sheet-window__form-actions',
                        {
                          'surface-side-sheet-window__form-actions_window': panelAsWindow,
                        },
                      ])}
                    >
                      <M3Button
                        appearance="text"
                        type="button"
                        onClick={resetForm}
                      >
                        Reset
                      </M3Button>
                      <M3Button appearance="filled" type="button">
                        Save
                      </M3Button>
                    </div>
                  </form>
                </div>
              </M3Surface>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SurfaceSideSheetModalToWindow
