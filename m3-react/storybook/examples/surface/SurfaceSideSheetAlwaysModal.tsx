import type { FC } from 'react'

import type { StorybookLocale } from '../../i18n'

import { clamp } from '@modulify/m3-foundation/lib/surface/orchestration'
import { raf } from '@modulify/m3-foundation/lib/surface/orchestration'
import { useEffect, useRef } from 'react'
import { wait } from '@modulify/m3-foundation/lib/surface/orchestration'

import { durations, easing } from '@modulify/m3-foundation/lib/motion'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'
import { M3Navigation, M3NavigationTab } from '@/components/navigation'
import { M3Surface } from '@/components/surface'

import { useStateRef } from '@/components/surface/orchestration/useStateRef'

import { localize } from '../../i18n'

const SIDE_SHEET_WIDTH_MIN = 280
const SIDE_SHEET_WIDTH_MAX = 360
const SIDE_SHEET_WIDTH_RATIO = 0.32
const SIDE_SHEET_WIDTH_STEP = 4

const MODAL_INSET_TOP = 0
const MODAL_INSET_BOTTOM = 0
const MODAL_INSET_END = 0
const PANEL_TRANSITION_MS = durations.medium2
const PANEL_TRANSITION_EASING = easing.standard
const SCRIM_FADE_MS = durations.long2

type NavTab = 'inbox' | 'boards' | 'archive' | 'lab'

const SurfaceSideSheetAlwaysModal: FC<{ locale: StorybookLocale }> = ({ locale }) => {
  const text = localize(locale, {
    'en-US': { archive: 'Archive', boards: 'Boards', close: 'Close modal side sheet', closeActions: 'Close actions: scrim click or close button inside the panel.', contextual: 'Contextual utility content.', description: 'The side sheet exists only in modal mode and can be shown repeatedly from the page header.', dim: 'Low-brightness complementary content.', heading: 'Surface orchestration: always-modal side sheet', inbox: 'Inbox', lab: 'Lab', modal: 'Modal side sheet', modalDescription: 'This side sheet is always modal and never returns to a docked state.', open: 'Show modal side sheet', opened: 'Modal side sheet is open', openNavigation: 'Open navigation', read: 'Read-heavy content block in the page flow.', secondary: 'Secondary block with mild emphasis.', workspace: 'Workspace surfaces', workspaceDescription: 'Background layout stays in flow while the side sheet appears as a modal overlay.' },
    'ru-RU': { archive: 'Архив', boards: 'Доски', close: 'Закрыть модальную панель', closeActions: 'Способы закрытия: нажатие на scrim или кнопка внутри панели.', contextual: 'Контекстное вспомогательное содержимое.', description: 'Боковая панель существует только в модальном режиме и может открываться повторно из заголовка страницы.', dim: 'Дополнительное содержимое с пониженной яркостью.', heading: 'Управление поверхностью: всегда модальная панель', inbox: 'Входящие', lab: 'Лаборатория', modal: 'Модальная боковая панель', modalDescription: 'Эта панель всегда модальная и не возвращается в закреплённое состояние.', open: 'Показать модальную панель', opened: 'Модальная панель открыта', openNavigation: 'Открыть навигацию', read: 'Блок для чтения в потоке страницы.', secondary: 'Вторичный блок с умеренным акцентом.', workspace: 'Поверхности рабочего пространства', workspaceDescription: 'Фоновая компоновка остаётся в потоке, пока панель показана как модальный overlay.' },
  })
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
            <strong>{text.heading}</strong><p>{text.description}</p>
          </div>

          <M3Button
            appearance="tonal"
            disabled={transitioning || modalMounted}
            data-testid="surface-always-open"
            onClick={() => void openModal()}
          >
            {modalMounted ? text.opened : text.open}
          </M3Button>
        </div>
      </M3Surface>

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
          <M3Surface
            className="surface-side-sheet__header-card"
            fillHeight={false}
            height={120}
            rounding={20}
            variant="surface-container-lowest"
            elevation={0}
          >
            <h3>{text.workspace}</h3><p>{text.workspaceDescription}</p>
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
                <p>{text.read}</p>
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
                <p>{text.secondary}</p>
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
                <p>{text.contextual}</p>
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
                <p>{text.dim}</p>
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
                  <h3>{text.modal}</h3>

                  <M3IconButton
                    className="surface-side-sheet__modal-close"
                    appearance="standard"
                    aria-label={text.close}
                    disabled={transitioning}
                    data-testid="surface-always-close"
                    onClick={() => void closeModal()}
                  >
                    <M3Icon name="close" />
                  </M3IconButton>
                </div>

                <p>{text.modalDescription}</p><p>{text.closeActions}</p>
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
