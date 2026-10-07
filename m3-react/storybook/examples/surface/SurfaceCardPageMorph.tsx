import type { FC } from 'react'

import type { StorybookLocale } from '../../i18n'

import { durations, easing } from '@modulify/m3-foundation/lib/motion'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'
import { M3Navigation, M3NavigationTab } from '@/components/navigation'
import { M3SurfacePanel } from '@/components/surface'

import { toClassName } from '@/utils/styling'
import { useStateRef } from '@/components/surface/orchestration/useStateRef'
import {
  useSurfaceCardPageMorph,
} from '@/components/surface/orchestration/useSurfaceCardPageMorph'

import { localize } from '../../i18n'

const TRANSITION_MS = durations.medium3
const TRANSITION_EASING = easing.standard

type NavTab = 'files' | 'timeline' | 'tasks' | 'analytics'

const SurfaceCardPageMorph: FC<{ locale: StorybookLocale }> = ({ locale }) => {
  const text = localize(locale, {
    'en-US': { analytics: 'Analytics', compact: 'In compact mode this surface behaves like a card. In expanded mode it replaces the page work area while keeping top bar and rail reserved.', description: 'The same surface morphs between compact card and page-like container.', expand: 'Expand card to page state', files: 'Files', heading: 'Surface orchestration: card replacing page', morph: 'Morph target surface', nested: 'Nested surface demonstrates composability in both states.', openNavigation: 'Open navigation', playground: 'Card-to-page transition playground', playgroundDescription: 'Original slot remains reserved while the morphing surface overlays the page area.', return: 'Return to card state', staticA: 'Static card A', staticADescription: 'Background content remains in flow.', staticB: 'Static card B', staticBDescription: 'Independent surface in the same scene.', tasks: 'Tasks', timeline: 'Timeline' },
    'ru-RU': { analytics: 'Аналитика', compact: 'В компактном режиме поверхность ведёт себя как карточка. В развёрнутом она заменяет рабочую область, сохраняя верхнюю панель и рейку.', description: 'Одна поверхность преобразуется между компактной карточкой и контейнером страницы.', expand: 'Развернуть карточку в страницу', files: 'Файлы', heading: 'Управление поверхностью: карточка заменяет страницу', morph: 'Преобразуемая поверхность', nested: 'Вложенная поверхность показывает композицию в обоих состояниях.', openNavigation: 'Открыть навигацию', playground: 'Переход карточки в страницу', playgroundDescription: 'Исходное место остаётся зарезервированным, пока поверхность перекрывает рабочую область.', return: 'Вернуть состояние карточки', staticA: 'Статичная карточка A', staticADescription: 'Фоновое содержимое остаётся в потоке.', staticB: 'Статичная карточка B', staticBDescription: 'Независимая поверхность в той же сцене.', tasks: 'Задачи', timeline: 'Хронология' },
  })
  const [navExpanded, setNavExpanded] = useStateRef(false)
  const [activeNavTab, setActiveNavTab] = useStateRef<NavTab>('files')
  const {
    expanded,
    surfaceExpanded,
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
        surfaceExpanded
          ? 'surface-card-page__morph-surface_expanded'
          : 'surface-card-page__morph-surface_compact',
      ])}
      fillWidth={true}
      fillHeight={overlayActive}
      rounding={surfaceExpanded ? 0 : 24}
      transitionMs={TRANSITION_MS}
      transitionTiming={TRANSITION_EASING}
      variant={surfaceExpanded ? 'surface' : 'surface-container-low'}
      elevation={surfaceExpanded ? 0 : 1}
      overflow="auto"
      data-testid="surface-card-morph"
    >
      <h3>{text.morph}</h3>
      <p>{text.compact}</p>

      <M3SurfacePanel
        className="surface-card-page__morph-nested"
        fillHeight={false}
        height={120}
        rounding={14}
        variant={surfaceExpanded ? 'surface-container-low' : 'surface-container-high'}
        elevation={surfaceExpanded ? 1 : 3}
      >
        {text.nested}
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
            <strong>{text.heading}</strong>
            <p>{text.description}</p>
          </div>

          <M3Button
            appearance="filled"
            disabled={busy}
            data-testid="surface-card-toggle"
            onClick={() => void toggleCardMode()}
          >
            {expanded ? text.return : text.expand}
          </M3Button>
        </div>
      </M3SurfacePanel>

      <M3Navigation
        expanded={navExpanded}
        className="surface-card-page__nav"
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
          label={text.files}
          active={activeNavTab === 'files'}
          onNavigate={() => {
            setActiveNavTab('files')
            setNavExpanded(false)
          }}
        >
          <M3Icon name="folder" />
        </M3NavigationTab>

        <M3NavigationTab
          label={text.timeline}
          active={activeNavTab === 'timeline'}
          onNavigate={() => {
            setActiveNavTab('timeline')
            setNavExpanded(false)
          }}
        >
          <M3Icon name="schedule" />
        </M3NavigationTab>

        <M3NavigationTab
          label={text.tasks}
          active={activeNavTab === 'tasks'}
          onNavigate={() => {
            setActiveNavTab('tasks')
            setNavExpanded(false)
          }}
        >
          <M3Icon name="check_circle" />
        </M3NavigationTab>

        <M3NavigationTab
          label={text.analytics}
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
            <h3>{text.playground}</h3>
            <p>{text.playgroundDescription}</p>
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
                  <strong>{text.staticA}</strong>
                  <p>{text.staticADescription}</p>
                </M3SurfacePanel>

                <M3SurfacePanel
                  className="surface-card-page__grid-card"
                  fillHeight={false}
                  height={184}
                  rounding={16}
                  variant="surface-container"
                  elevation={2}
                >
                  <strong>{text.staticB}</strong>
                  <p>{text.staticBDescription}</p>
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
