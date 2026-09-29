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
type ModalRole = 'surface-container-low' | 'surface-container-high'

const SurfaceSideSheetDismissToRemove: FC<{ locale: StorybookLocale }> = ({ locale }) => {
  const text = localize(locale, {
    'en-US': { archive: 'Archive', boards: 'Boards', close: 'Close modal side sheet', closeRemove: 'Close modal and remove sheet', contextual: 'Contextual utility content.', description: 'After modal close, the side sheet is removed from the page instead of returning to docked mode.', dim: 'Low-brightness complementary content.', docked: 'Docked side sheet', dockedDescription: 'Coplanar layout participant with fixed width per layout region.', heading: 'Surface orchestration: side sheet remove flow', inbox: 'Inbox', interactive: 'Main content remains interactive.', lab: 'Lab', layer: 'Layer rebind: docked layer to modal layer.', modal: 'Modal side sheet', modalDescription: 'Anchored to end/right edge with full-height modal surface.', openNavigation: 'Open navigation', read: 'Read-heavy content block in the page flow.', removed: 'Side sheet removed', removeDescription: 'Closing this modal removes the side sheet from the scene.', secondary: 'Secondary block with mild emphasis.', switchModal: 'Switch to modal sheet', workspace: 'Workspace surfaces', workspaceDescription: 'Static blocks keep flow while side-sheet changes modality.' },
    'ru-RU': { archive: 'Архив', boards: 'Доски', close: 'Закрыть модальную панель', closeRemove: 'Закрыть и удалить панель', contextual: 'Контекстное вспомогательное содержимое.', description: 'После закрытия модальной панели она удаляется со страницы, а не возвращается в закреплённый режим.', dim: 'Дополнительное содержимое с пониженной яркостью.', docked: 'Закреплённая боковая панель', dockedDescription: 'Участник общей компоновки с фиксированной шириной для области.', heading: 'Управление поверхностью: удаление боковой панели', inbox: 'Входящие', interactive: 'Основное содержимое остаётся интерактивным.', lab: 'Лаборатория', layer: 'Переназначение слоя: из закреплённого в модальный.', modal: 'Модальная боковая панель', modalDescription: 'Полноразмерная модальная поверхность закреплена у правого края.', openNavigation: 'Открыть навигацию', read: 'Блок для чтения в потоке страницы.', removed: 'Боковая панель удалена', removeDescription: 'Закрытие модального режима удаляет панель из сцены.', secondary: 'Вторичный блок с умеренным акцентом.', switchModal: 'Переключить в модальный режим', workspace: 'Поверхности рабочего пространства', workspaceDescription: 'Статичные блоки остаются в потоке при смене режима панели.' },
  })
  const [navExpanded, setNavExpanded] = useStateRef(false)
  const [activeNavTab, setActiveNavTab] = useStateRef<NavTab>('inbox')
  const [sideSheetModal, setSideSheetModal, sideSheetModalRef] = useStateRef(false)
  const [sheetRemoved, setSheetRemoved, sheetRemovedRef] = useStateRef(false)
  const [sideSheetWidth, setSideSheetWidth, sideSheetWidthRef] = useStateRef(320)
  const [sideSheetDockedWidth, setSideSheetDockedWidth] = useStateRef(sideSheetWidthRef.current)
  const [modalShown, setModalShown] = useStateRef(false)
  const [modalVisible, setModalVisible] = useStateRef(false)
  const [modalWidth, setModalWidth] = useStateRef(sideSheetWidthRef.current)
  const [modalInsetTop, setModalInsetTop] = useStateRef(MODAL_INSET_TOP)
  const [modalInsetRight, setModalInsetRight] = useStateRef(-(sideSheetWidthRef.current + 12))
  const [modalInsetBottom, setModalInsetBottom] = useStateRef(MODAL_INSET_BOTTOM)
  const [modalRadiusLeft, setModalRadiusLeft] = useStateRef(0)
  const [modalElevation, setModalElevation] = useStateRef(0)
  const [modalRole, setModalRole] = useStateRef<ModalRole>('surface-container-low')
  const [transitioning, setTransitioning, transitioningRef] = useStateRef(false)

  const dockedHost = useRef<HTMLDivElement | null>(null)
  const layoutRoot = useRef<HTMLDivElement | null>(null)

  const hiddenInsetRight = (width: number) => -(width + 12)

  const resolveSheetWidthFromLayout = () => {
    const layoutWidth = Math.round(layoutRoot.current?.getBoundingClientRect().width ?? window.innerWidth)
    const estimated = Math.round((layoutWidth * SIDE_SHEET_WIDTH_RATIO) / SIDE_SHEET_WIDTH_STEP) * SIDE_SHEET_WIDTH_STEP

    return clamp(estimated, SIDE_SHEET_WIDTH_MIN, SIDE_SHEET_WIDTH_MAX)
  }

  const syncFixedWidth = () => {
    const nextWidth = resolveSheetWidthFromLayout()

    setSideSheetWidth(nextWidth)
    setModalWidth(nextWidth)

    if (sheetRemovedRef.current) {
      setSideSheetDockedWidth(0)
      setModalInsetRight(hiddenInsetRight(nextWidth))
      return
    }

    if (!sideSheetModalRef.current) {
      setSideSheetDockedWidth(nextWidth)
      setModalInsetRight(hiddenInsetRight(nextWidth))
    }
  }

  const measureDockedGeometry = () => {
    const host = dockedHost.current
    if (!host) {
      return null
    }

    const rect = host.getBoundingClientRect()

    return {
      width: Math.round(rect.width),
      insetTop: Math.round(rect.top),
      insetRight: Math.round(window.innerWidth - rect.right),
      insetBottom: Math.round(window.innerHeight - rect.bottom),
    }
  }

  const setModalGeometryFromDocked = () => {
    const docked = measureDockedGeometry()

    setModalWidth(docked?.width ?? sideSheetWidthRef.current)
    setModalInsetTop(docked?.insetTop ?? MODAL_INSET_TOP)
    setModalInsetRight(docked?.insetRight ?? MODAL_INSET_END)
    setModalInsetBottom(docked?.insetBottom ?? MODAL_INSET_BOTTOM)
  }

  const setModalGeometryTarget = () => {
    setModalWidth(sideSheetWidthRef.current)
    setModalInsetTop(MODAL_INSET_TOP)
    setModalInsetRight(MODAL_INSET_END)
    setModalInsetBottom(MODAL_INSET_BOTTOM)
  }

  const switchDockedToModal = async () => {
    if (sheetRemovedRef.current) {
      return
    }

    syncFixedWidth()
    setModalGeometryFromDocked()

    setModalRadiusLeft(0)
    setModalElevation(0)
    setModalRole('surface-container-low')
    setModalVisible(false)
    setModalShown(true)

    await raf()

    setModalVisible(true)
    await raf()

    setSideSheetModal(true)
    setSideSheetDockedWidth(0)
    setModalGeometryTarget()
    setModalRadiusLeft(28)
    setModalElevation(1)
    setModalRole('surface-container-high')
    await wait(PANEL_TRANSITION_MS)
  }

  const dismissModalAndRemove = async () => {
    if (!sideSheetModalRef.current) {
      return
    }

    setModalInsetTop(MODAL_INSET_TOP)
    setModalInsetBottom(MODAL_INSET_BOTTOM)
    setModalInsetRight(hiddenInsetRight(sideSheetWidthRef.current))
    setModalElevation(0)
    setModalRole('surface-container-low')
    setModalRadiusLeft(0)
    await wait(PANEL_TRANSITION_MS)

    setModalVisible(false)
    await wait(SCRIM_FADE_MS)
    setModalShown(false)
    setSideSheetModal(false)
    setSideSheetDockedWidth(0)
    setSheetRemoved(true)
  }

  const handleTopbarAction = async () => {
    if (transitioningRef.current || sheetRemovedRef.current) {
      return
    }

    setTransitioning(true)

    if (!sideSheetModalRef.current) {
      await switchDockedToModal()
      setTransitioning(false)
      return
    }

    await dismissModalAndRemove()
    setTransitioning(false)
  }

  const closeModalFromPanel = async () => {
    if (!sideSheetModalRef.current || transitioningRef.current) {
      return
    }

    setTransitioning(true)
    await dismissModalAndRemove()
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
    <div className="surface-side-sheet">
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
            disabled={transitioning || sheetRemoved}
            onClick={() => void handleTopbarAction()}
          >
            {
              sheetRemoved
                ? text.removed
                : (sideSheetModal ? text.closeRemove : text.switchModal)
            }
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
          >
            <main className="surface-side-sheet__content-grid">
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

            {!sheetRemoved ? (
              <div
                ref={dockedHost}
                className="surface-side-sheet__docked-host"
                style={{ width: `${sideSheetDockedWidth}px` }}
              >
                {!sideSheetModal ? (
                  <M3Surface
                    className="surface-side-sheet__sheet"
                    fillWidth={true}
                    fillHeight={true}
                    rounding={0}
                    variant="surface-container-low"
                    elevation={0}
                    overflow="auto"
                  >
                    <h3>{text.docked}</h3><p>{text.dockedDescription}</p><p>{text.interactive}</p>
                    <p className="surface-side-sheet__meta">
                      Fixed width: {sideSheetWidth}px
                    </p>
                  </M3Surface>
                ) : null}
              </div>
            ) : null}

            {modalShown ? (
              <M3Surface
                className="surface-side-sheet__sheet surface-side-sheet__sheet_modal"
                mode="modal"
                shown={modalVisible}
                anchor="end"
                fillWidth={false}
                fillHeight={false}
                width={modalWidth}
                insetTop={modalInsetTop}
                insetRight={modalInsetRight}
                insetBottom={modalInsetBottom}
                roundingTopLeft={modalRadiusLeft}
                roundingBottomLeft={modalRadiusLeft}
                roundingTopRight={0}
                roundingBottomRight={0}
                transitionMs={PANEL_TRANSITION_MS}
                transitionTiming={PANEL_TRANSITION_EASING}
                zIndex={520}
                variant={modalRole}
                elevation={modalElevation}
                overflow="auto"
                onDismiss={() => void closeModalFromPanel()}
              >
                <div className="surface-side-sheet__modal-header">
                  <h3>{text.modal}</h3>

                  {sideSheetModal ? (
                    <M3IconButton
                      className="surface-side-sheet__modal-close"
                      appearance="standard"
                      aria-label={text.close}
                      disabled={transitioning}
                      onClick={() => void closeModalFromPanel()}
                    >
                      <M3Icon name="close" />
                    </M3IconButton>
                  ) : null}
                </div>

                <p>{text.layer}</p><p>{text.modalDescription}</p><p>{text.removeDescription}</p>
                <p className="surface-side-sheet__meta">
                  Fixed width: {modalWidth}px
                </p>
              </M3Surface>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SurfaceSideSheetDismissToRemove
