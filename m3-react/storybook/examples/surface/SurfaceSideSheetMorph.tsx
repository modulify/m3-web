import type { FC } from 'react'

import type { StorybookLocale } from '../../i18n'

import { easing } from '@modulify/m3-foundation/lib/motion'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'
import { M3Navigation, M3NavigationTab } from '@/components/navigation'
import { M3Surface, M3SurfacePanel } from '@/components/surface'

import { useStateRef } from '@/components/surface/orchestration/useStateRef'

import {
  useSurfaceSideSheetMorph,
} from '@/components/surface/orchestration/useSurfaceSideSheetMorph'

import { localize } from '../../i18n'

const PANEL_TRANSITION_EASING = easing.standard

type NavTab = 'inbox' | 'boards' | 'archive' | 'lab'

const SurfaceSideSheetMorph: FC<{ locale: StorybookLocale }> = ({ locale }) => {
  const text = localize(locale, {
    'en-US': { archive: 'Archive', boards: 'Boards', close: 'Close modal side sheet', contextual: 'Contextual utility content.', description: 'Docked sheet transitions into modal sheet with fixed width, right-edge anchoring, and full-height modal target.', dim: 'Low-brightness complementary content.', docked: 'Docked side sheet', dockedDescription: 'Coplanar layout participant with adaptive CSS width inside the layout host.', heading: 'Surface orchestration: side sheet morph', inbox: 'Inbox', interactive: 'Main content remains interactive.', lab: 'Lab', layer: 'Layer rebind: docked layer to modal layer.', modal: 'Modal side sheet', modalDescription: 'Stable modal state stays in overlay, while docked state remains layout-driven.', openNavigation: 'Open navigation', read: 'Read-heavy content block in the page flow.', secondary: 'Secondary block with mild emphasis.', switchDocked: 'Switch to docked sheet', switchModal: 'Switch to modal sheet', workspace: 'Workspace surfaces', workspaceDescription: 'Static blocks keep flow while side-sheet changes modality.' },
    'ru-RU': { archive: 'Архив', boards: 'Доски', close: 'Закрыть модальную панель', contextual: 'Контекстное вспомогательное содержимое.', description: 'Закреплённая панель переходит в полноразмерную модальную панель фиксированной ширины у правого края.', dim: 'Дополнительное содержимое с пониженной яркостью.', docked: 'Закреплённая боковая панель', dockedDescription: 'Участник общей компоновки с адаптивной CSS-шириной внутри контейнера.', heading: 'Управление поверхностью: преобразование боковой панели', inbox: 'Входящие', interactive: 'Основное содержимое остаётся интерактивным.', lab: 'Лаборатория', layer: 'Переназначение слоя: из закреплённого в модальный.', modal: 'Модальная боковая панель', modalDescription: 'Модальное состояние остаётся в overlay, а закреплённое управляется компоновкой.', openNavigation: 'Открыть навигацию', read: 'Блок для чтения в потоке страницы.', secondary: 'Вторичный блок с умеренным акцентом.', switchDocked: 'Переключить в закреплённый режим', switchModal: 'Переключить в модальный режим', workspace: 'Поверхности рабочего пространства', workspaceDescription: 'Статичные блоки остаются в потоке при смене режима панели.' },
  })
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
            <strong>{text.heading}</strong>
            <p>{text.description}</p>
          </div>

          <M3Button
            appearance="tonal"
            disabled={transitioning}
            data-testid="surface-morph-toggle"
            onClick={() => void toggleSideSheetMode()}
          >
            {sideSheetModal ? text.switchDocked : text.switchModal}
          </M3Button>
        </div>
      </M3SurfacePanel>

      <M3Navigation
        expanded={navExpanded}
        className="surface-side-sheet__nav"
        appearance="auto"
        alignment="top"
        onToggle={setNavExpanded}
      >
        <M3Navigation.Top>
          <M3IconButton
            aria-label={text.openNavigation}
            onClick={() => setNavExpanded(true)}
          >
            <M3Icon name="menu" />
          </M3IconButton>
        </M3Navigation.Top>

        <M3NavigationTab
          label={text.inbox}
          active={activeNavTab === 'inbox'}
          onNavigate={() => {
            setActiveNavTab('inbox')
            setNavExpanded(false)
          }}
        >
          <M3Icon name="inbox" />
        </M3NavigationTab>

        <M3NavigationTab
          label={text.boards}
          active={activeNavTab === 'boards'}
          onNavigate={() => {
            setActiveNavTab('boards')
            setNavExpanded(false)
          }}
        >
          <M3Icon name="dashboard" />
        </M3NavigationTab>

        <M3NavigationTab
          label={text.archive}
          active={activeNavTab === 'archive'}
          onNavigate={() => {
            setActiveNavTab('archive')
            setNavExpanded(false)
          }}
        >
          <M3Icon name="archive" />
        </M3NavigationTab>

        <M3NavigationTab
          label={text.lab}
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
            <h3>{text.workspace}</h3>
            <p>{text.workspaceDescription}</p>
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
                <p>{text.read}</p>
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
                <p>{text.secondary}</p>
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
                <p>{text.contextual}</p>
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
                <p>{text.dim}</p>
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
                  <h3>{text.docked}</h3>
                  <p>{text.dockedDescription}</p>
                  <p>{text.interactive}</p>
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
                transitionTiming={PANEL_TRANSITION_EASING}
                data-testid="surface-morph-sheet"
                data-panel-mode="modal"
                {...modalPanelProps}
                onDismiss={() => void closeModalFromPanel()}
              >
                {sideSheetModal ? (
                  <>
                    <div className="surface-side-sheet__modal-header">
                      <h3>{text.modal}</h3>

                      <M3IconButton
                        className="surface-side-sheet__modal-close"
                        appearance="standard"
                        aria-label={text.close}
                        disabled={transitioning}
                        data-testid="surface-morph-close"
                        onClick={() => void closeModalFromPanel()}
                      >
                        <M3Icon name="close" />
                      </M3IconButton>
                    </div>

                    <p>{text.layer}</p>
                    <p>{text.modalDescription}</p>
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
