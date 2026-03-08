import type { FC } from 'react'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'
import {
  M3Navigation,
  M3NavigationTab,
} from '@/components/navigation'
import {
  M3Surface,
  M3SurfacePanel,
} from '@/components/surface'
import { useSurfaceSideSheetMorph } from '@/components/surface/orchestration/useSurfaceSideSheetMorph'
import {
  m3MotionEasings,
} from '@modulify/m3-foundation/lib/motion'
import { useStateRef } from '@/components/surface/orchestration/useStateRef'

const PANEL_TRANSITION_EASING = m3MotionEasings.standard

type NavTab = 'inbox' | 'boards' | 'archive' | 'lab'

const SurfaceSideSheetMorph: FC = () => {
  const [navExpanded, setNavExpanded] = useStateRef(false)
  const [activeNavTab, setActiveNavTab] = useStateRef<NavTab>('inbox')
  const {
    sideSheetModal,
    sideSheetWidth,
    transitioning,
    modalShown,
    dockedPanelShown,
    dockedPanelStyle,
    modalPanelProps,
    dockedHostStyle,
    dockedHostRef: dockedHost,
    layoutRootRef: layoutRoot,
    toggleSideSheetMode,
    closeModalFromPanel,
  } = useSurfaceSideSheetMorph()

  return (
    <div
      className="surface-side-sheet"
      data-sheet-modal={sideSheetModal ? 'true' : 'false'}
      data-testid="surface-morph-root"
    >
      <M3SurfacePanel
        className="surface-side-sheet__topbar"
        fillHeight={false}
        height={72}
        variant="surface-container"
        elevation={0}
      >
        <div className="surface-side-sheet__topbar-content">
          <div>
            <strong>Surface orchestration: side sheet morph</strong>
            <p>Docked sheet transitions into modal sheet with fixed width, right-edge anchoring, and full-height modal target.</p>
          </div>

          <M3Button
            appearance="tonal"
            disabled={transitioning}
            data-testid="surface-morph-toggle"
            onClick={() => void toggleSideSheetMode()}
          >
            {sideSheetModal ? 'Switch to docked sheet' : 'Switch to modal sheet'}
          </M3Button>
        </div>
      </M3SurfacePanel>

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
          <M3SurfacePanel
            className="surface-side-sheet__header-card"
            fillHeight={false}
            height={120}
            rounding={20}
            variant="surface-container-lowest"
            elevation={0}
          >
            <h3>Workspace surfaces</h3>
            <p>Static blocks keep flow while side-sheet changes modality.</p>
          </M3SurfacePanel>

          <div
            ref={layoutRoot}
            className="surface-side-sheet__layout"
            data-testid="surface-morph-layout"
          >
            <main
              className="surface-side-sheet__content-grid"
              data-testid="surface-morph-content-grid"
            >
              <M3SurfacePanel
                className="surface-side-sheet__grid-surface"
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
                className="surface-side-sheet__grid-surface"
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
                className="surface-side-sheet__grid-surface"
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
                className="surface-side-sheet__grid-surface"
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

            <div
              ref={dockedHost}
              className="surface-side-sheet__docked-host"
              style={dockedHostStyle}
              data-testid="surface-morph-docked-host"
            >
              {dockedPanelShown ? (
                <M3SurfacePanel
                  className="surface-side-sheet__sheet surface-side-sheet__sheet_docked"
                  fillWidth={true}
                  fillHeight={true}
                  overflow="auto"
                  variant="surface-container-low"
                  elevation={0}
                  style={dockedPanelStyle}
                  data-testid="surface-morph-sheet"
                  data-panel-mode="docked"
                >
                  <h3>Docked side sheet</h3>
                  <p>Coplanar layout participant with adaptive CSS width inside the layout host.</p>
                  <p>Main content remains interactive.</p>
                  <p className="surface-side-sheet__meta">
                    Adaptive width: {sideSheetWidth}px
                  </p>
                </M3SurfacePanel>
              ) : null}
            </div>

            {modalShown ? (
              <M3Surface
                className="surface-side-sheet__sheet surface-side-sheet__sheet_modal"
                mode="modal"
                {...modalPanelProps}
                transitionTiming={PANEL_TRANSITION_EASING}
                data-testid="surface-morph-sheet"
                data-panel-mode="modal"
                onDismiss={() => void closeModalFromPanel()}
              >
                {sideSheetModal ? (
                  <>
                    <div className="surface-side-sheet__modal-header">
                      <h3>Modal side sheet</h3>

                      <M3IconButton
                        className="surface-side-sheet__modal-close"
                        appearance="standard"
                        aria-label="Close modal side sheet"
                        disabled={transitioning}
                        data-testid="surface-morph-close"
                        onClick={() => void closeModalFromPanel()}
                      >
                        <M3Icon name="close" />
                      </M3IconButton>
                    </div>

                    <p>Layer rebind: docked layer to modal layer.</p>
                    <p>Stable modal state stays in overlay, while docked state remains layout-driven.</p>
                    <p className="surface-side-sheet__meta">
                      Measured transition width: {modalPanelProps.width}px
                    </p>
                  </>
                ) : null}
              </M3Surface>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SurfaceSideSheetMorph
