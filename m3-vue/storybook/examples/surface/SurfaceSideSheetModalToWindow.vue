<template>
    <div
        :data-panel-mounted="modalMounted ? 'true' : 'false'"
        :data-panel-mode="panelAsWindow ? 'window' : 'sheet'"
        data-testid="surface-window-root"
        class="surface-side-sheet-window"
    >
        <M3SurfacePanel
            :fill-height="false"
            :height="72"
            :elevation="0"
            class="surface-side-sheet-window__topbar"
            variant="surface-container"
        >
            <div class="surface-side-sheet-window__topbar-content">
                <div>
                    <strong>{{ text.heading }}</strong><p>{{ text.description }}</p>
                </div>

                <M3Button
                    :disabled="transitioning || modalMounted"
                    data-testid="surface-window-open"
                    appearance="tonal"
                    @click="openModal"
                >
                    {{ modalMounted ? text.opened : text.open }}
                </M3Button>
            </div>
        </M3SurfacePanel>

        <M3Navigation
            v-model:expanded="navExpanded"
            alignment="top"
            appearance="auto"
            class="surface-side-sheet-window__nav"
        >
            <template #top>
                <M3IconButton
                    :aria-label="text.openNavigation"
                    @click="navExpanded = true"
                >
                    <M3Icon name="menu" />
                </M3IconButton>
            </template>

            <M3NavigationTab
                :active="activeNavTab === 'inbox'"
                :label="text.inbox"
                @navigate="activeNavTab = 'inbox'; navExpanded = false"
            >
                <M3Icon name="inbox" />
            </M3NavigationTab>

            <M3NavigationTab
                :active="activeNavTab === 'boards'"
                :label="text.boards"
                @navigate="activeNavTab = 'boards'; navExpanded = false"
            >
                <M3Icon name="dashboard" />
            </M3NavigationTab>

            <M3NavigationTab
                :active="activeNavTab === 'archive'"
                :label="text.archive"
                @navigate="activeNavTab = 'archive'; navExpanded = false"
            >
                <M3Icon name="archive" />
            </M3NavigationTab>

            <M3NavigationTab
                :active="activeNavTab === 'lab'"
                :label="text.lab"
                @navigate="activeNavTab = 'lab'; navExpanded = false"
            >
                <M3Icon name="science" />
            </M3NavigationTab>
        </M3Navigation>

        <div class="surface-side-sheet-window__body">
            <div class="surface-side-sheet-window__workspace">
                <M3SurfacePanel
                    :fill-height="false"
                    :height="120"
                    :rounding="20"
                    :elevation="0"
                    class="surface-side-sheet-window__header-card"
                    variant="surface-container-lowest"
                >
                    <h3>{{ text.workspace }}</h3><p>{{ text.workspaceDescription }}</p>
                </M3SurfacePanel>

                <div
                    ref="layoutRoot"
                    data-testid="surface-window-layout"
                    class="surface-side-sheet-window__layout"
                >
                    <main
                        data-testid="surface-window-content-grid"
                        class="surface-side-sheet-window__content-grid"
                    >
                        <M3SurfacePanel
                            :fill-height="false"
                            :height="136"
                            :rounding="18"
                            :elevation="0"
                            class="surface-side-sheet-window__grid-surface"
                            variant="surface-container-lowest"
                        >
                            <strong>surface-container-lowest</strong>
                            <p>{{ text.read }}</p>
                        </M3SurfacePanel>

                        <M3SurfacePanel
                            :fill-height="false"
                            :height="136"
                            :rounding="18"
                            :elevation="1"
                            class="surface-side-sheet-window__grid-surface"
                            variant="surface-container-low"
                        >
                            <strong>surface-container-low</strong>
                            <p>{{ text.secondary }}</p>
                        </M3SurfacePanel>

                        <M3SurfacePanel
                            :fill-height="false"
                            :height="136"
                            :rounding="18"
                            :elevation="3"
                            class="surface-side-sheet-window__grid-surface"
                            variant="surface-container-high"
                        >
                            <strong>surface-container-high</strong>
                            <p>{{ text.contextual }}</p>
                        </M3SurfacePanel>

                        <M3SurfacePanel
                            :fill-height="false"
                            :height="136"
                            :rounding="18"
                            :elevation="0"
                            class="surface-side-sheet-window__grid-surface"
                            variant="surface-dim"
                        >
                            <strong>surface-dim</strong>
                            <p>{{ text.dim }}</p>
                        </M3SurfacePanel>
                    </main>

                    <M3Surface
                        v-if="modalMounted"
                        :data-panel-mode="panelAsWindow ? 'window' : 'sheet'"
                        :data-window-closing="windowClosing ? 'true' : 'false'"
                        :shown="modalVisible"
                        :transition-ms="panelTransitionMs"
                        :transition-timing="panelTransitionTiming"
                        :anchor="panelAnchor"
                        :fill-width="false"
                        :fill-height="false"
                        :width="panelWidth"
                        :inset-top="MODAL_INSET_TOP"
                        :inset-right="panelInsetRight"
                        :inset-bottom="MODAL_INSET_BOTTOM"
                        :rounding-top-left="panelRoundingTopLeft"
                        :rounding-bottom-left="panelRoundingBottomLeft"
                        :rounding-top-right="panelRoundingTopRight"
                        :rounding-bottom-right="panelRoundingBottomRight"
                        :z-index="520"
                        :elevation="panelElevation"
                        :variant="panelSurfaceRole"
                        :style="panelInlineStyle"
                        :class="[
                            'surface-side-sheet-window__sheet',
                            panelAsWindow ? 'surface-side-sheet-window__sheet_window' : 'surface-side-sheet-window__sheet_sheet',
                        ]"
                        data-testid="surface-window-panel"
                        mode="modal"
                        overflow="auto"
                        @dismiss="closeModal"
                    >
                        <div
                            data-testid="surface-window-panel-content"
                            class="surface-side-sheet-window__panel-content"
                        >
                            <div class="surface-side-sheet-window__modal-header">
                                <h3>{{ panelAsWindow ? text.window : text.modal }}</h3>

                                <div class="surface-side-sheet-window__modal-actions">
                                    <M3IconButton
                                        :aria-label="panelAsWindow ? text.dock : text.openWindow"
                                        :disabled="transitioning"
                                        data-testid="surface-window-toggle-mode"
                                        appearance="standard"
                                        class="surface-side-sheet-window__modal-action"
                                        @click="toggleWindowMode"
                                    >
                                        <M3Icon :name="panelAsWindow ? 'close_fullscreen' : 'open_in_new'" />
                                    </M3IconButton>

                                    <M3IconButton
                                        :disabled="transitioning"
                                        :aria-label="text.close"
                                        data-testid="surface-window-close"
                                        appearance="standard"
                                        class="surface-side-sheet-window__modal-action"
                                        @click="closeModal"
                                    >
                                        <M3Icon name="close" />
                                    </M3IconButton>
                                </div>
                            </div>

                            <p>{{ text.formDescription }}</p>

                            <form
                                :class="{ 'surface-side-sheet-window__form_window': panelAsWindow }"
                                class="surface-side-sheet-window__form"
                                @submit.prevent
                            >
                                <div class="surface-side-sheet-window__field">
                                    <M3TextField
                                        v-model:value="form.project"
                                        :label="text.project"
                                        placeholder="Q3 Design Refresh"
                                        outlined
                                    />
                                </div>

                                <div class="surface-side-sheet-window__field">
                                    <M3TextField
                                        v-model:value="form.ownerEmail"
                                        :label="text.owner"
                                        type="email"
                                        placeholder="owner@example.com"
                                        outlined
                                    />
                                </div>

                                <div class="surface-side-sheet-window__field">
                                    <M3TextField
                                        v-model:value="form.startDate"
                                        :label="text.startDate"
                                        placeholder="YYYY-MM-DD"
                                        outlined
                                    />
                                </div>

                                <div class="surface-side-sheet-window__field">
                                    <M3Select
                                        v-model:value="form.priority"
                                        :options="priorityOptions"
                                        :label="text.priority"
                                        outlined
                                    />
                                </div>

                                <div
                                    :class="{ 'surface-side-sheet-window__field_wide': panelAsWindow }"
                                    class="surface-side-sheet-window__field"
                                >
                                    <M3TextField
                                        v-model:value="form.notes"
                                        :label="text.notes"
                                        :placeholder="text.notesPlaceholder"
                                        multiline
                                        outlined
                                    />
                                </div>

                                <div
                                    :class="{ 'surface-side-sheet-window__form-actions_window': panelAsWindow }"
                                    class="surface-side-sheet-window__form-actions"
                                >
                                    <M3Button
                                        type="button"
                                        appearance="text"
                                        @click="resetForm"
                                    >
                                        {{ text.reset }}
                                    </M3Button>
                                    <M3Button type="button" appearance="filled">
                                        {{ text.save }}
                                    </M3Button>
                                </div>
                            </form>
                        </div>
                    </M3Surface>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { StorybookLocale } from '../../i18n'

import { clamp } from '@modulify/m3-foundation/lib/surface/orchestration'
import { computed } from 'vue'
import { getSurfaceStateDescriptor } from '@modulify/m3-foundation/lib/surface/descriptor'
import { nextTick, onBeforeUnmount, onMounted } from 'vue'
import { raf } from '@modulify/m3-foundation/lib/surface/orchestration'
import { reactive, ref } from 'vue'
import { wait } from '@modulify/m3-foundation/lib/surface/orchestration'

import { durations, easing } from '@modulify/m3-foundation/lib/motion'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'
import { M3Navigation, M3NavigationTab } from '@/components/navigation'
import { M3Select } from '@/components/select'
import { M3Surface, M3SurfacePanel } from '@/components/surface'
import { M3TextField } from '@/components/text-field'

import { localize } from '../../i18n'

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
const PANEL_TRANSITION_MS = durations.medium4
const PANEL_TRANSITION_EASING = easing.standard
const SCRIM_FADE_MS = durations.long2
const DIALOG_HIDE_MS = durations.long2
const HIDDEN_SURFACE_DESCRIPTOR = getSurfaceStateDescriptor('hidden')
const MODAL_SIDE_SHEET_DESCRIPTOR = getSurfaceStateDescriptor('modal_side_sheet')
const MODAL_DIALOG_DESCRIPTOR = getSurfaceStateDescriptor('modal_dialog_window')

const navExpanded = ref(false)
const activeNavTab = ref<'inbox' | 'boards' | 'archive' | 'lab'>('inbox')
const sideSheetWidth = ref(320)
const windowWidth = ref(720)

const modalInsetRight = ref(-(sideSheetWidth.value + 12))
const modalRadiusLeft = ref<number>(HIDDEN_SURFACE_DESCRIPTOR.rounding.topLeft)
const modalElevationBase = ref<number>(HIDDEN_SURFACE_DESCRIPTOR.elevation)

const modalMounted = ref(false)
const modalVisible = ref(false)
const panelAsWindow = ref(false)
const windowClosing = ref(false)
const transitioning = ref(false)
const layoutRoot = ref<HTMLElement | null>(null)

type Priority = 'low' | 'normal' | 'high'

type FormState = {
  project: string,
  ownerEmail: string,
  startDate: string,
  priority: Priority,
  notes: string,
}

const props = defineProps<{ locale: StorybookLocale }>()
const text = localize(props.locale, {
  'en-US': { archive: 'Archive', boards: 'Boards', close: 'Close modal panel', contextual: 'Contextual utility content.', description: 'Use the action inside the panel to morph a modal side sheet into a modal window.', dim: 'Low-brightness complementary content.', dock: 'Dock panel to side sheet mode', formDescription: 'Form layout adapts when switching from side-sheet to window mode.', heading: 'Surface orchestration: modal side sheet to window', inbox: 'Inbox', lab: 'Lab', modal: 'Modal side sheet', notes: 'Notes', notesPlaceholder: 'Describe constraints, risks, and acceptance criteria.', open: 'Show modal side sheet', opened: 'Modal panel is open', openNavigation: 'Open navigation', openWindow: 'Open panel in window mode', owner: 'Owner email', priorities: ['Low', 'Normal', 'High'], priority: 'Priority', project: 'Project name', read: 'Read-heavy content block in the page flow.', reset: 'Reset', save: 'Save', secondary: 'Secondary block with mild emphasis.', startDate: 'Start date', window: 'Window mode', workspace: 'Workspace surfaces', workspaceDescription: 'Background layout stays in flow while the modal panel morphs between side-sheet and window geometries.' },
  'ru-RU': { archive: 'Архив', boards: 'Доски', close: 'Закрыть модальную панель', contextual: 'Контекстное вспомогательное содержимое.', description: 'Действие внутри панели преобразует модальную боковую панель в модальное окно.', dim: 'Дополнительное содержимое с пониженной яркостью.', dock: 'Вернуть режим боковой панели', formDescription: 'Компоновка формы адаптируется при переходе между боковой панелью и окном.', heading: 'Управление поверхностью: боковая панель в окно', inbox: 'Входящие', lab: 'Лаборатория', modal: 'Модальная боковая панель', notes: 'Заметки', notesPlaceholder: 'Опишите ограничения, риски и критерии приёмки.', open: 'Показать модальную панель', opened: 'Модальная панель открыта', openNavigation: 'Открыть навигацию', openWindow: 'Открыть панель в режиме окна', owner: 'Почта владельца', priorities: ['Низкий', 'Обычный', 'Высокий'], priority: 'Приоритет', project: 'Название проекта', read: 'Блок для чтения в потоке страницы.', reset: 'Сбросить', save: 'Сохранить', secondary: 'Вторичный блок с умеренным акцентом.', startDate: 'Дата начала', window: 'Режим окна', workspace: 'Поверхности рабочего пространства', workspaceDescription: 'Фоновая компоновка остаётся в потоке, пока панель преобразуется между геометрией side sheet и окна.' },
})

const DEFAULT_FORM: FormState = {
  project: 'Q3 Design Refresh',
  ownerEmail: 'owner@example.com',
  startDate: '2026-03-01',
  priority: 'normal',
  notes: localize(props.locale, { 'en-US': 'Move supplemental workflows into a reusable surface with predictable transitions.', 'ru-RU': 'Перенести вспомогательные процессы в переиспользуемую поверхность с предсказуемыми переходами.' }),
}

const form = reactive<FormState>({ ...DEFAULT_FORM })

const priorityOptions = [{
  label: text.priorities[0],
  value: 'low',
}, {
  label: text.priorities[1],
  value: 'normal',
}, {
  label: text.priorities[2],
  value: 'high',
}]

const panelAnchor = computed(() => panelAsWindow.value ? MODAL_DIALOG_DESCRIPTOR.anchor : MODAL_SIDE_SHEET_DESCRIPTOR.anchor)
const panelWidth = computed(() => panelAsWindow.value ? windowWidth.value : sideSheetWidth.value)
const panelInsetRight = computed(() => panelAsWindow.value ? 0 : modalInsetRight.value)
const panelRoundingTopLeft = computed(() => panelAsWindow.value ? MODAL_DIALOG_DESCRIPTOR.rounding.topLeft : modalRadiusLeft.value)
const panelRoundingBottomLeft = computed(() => panelAsWindow.value ? MODAL_DIALOG_DESCRIPTOR.rounding.bottomLeft : modalRadiusLeft.value)
const panelRoundingTopRight = computed(() => panelAsWindow.value
  ? MODAL_DIALOG_DESCRIPTOR.rounding.topRight
  : MODAL_SIDE_SHEET_DESCRIPTOR.rounding.topRight)
const panelRoundingBottomRight = computed(() => panelAsWindow.value
  ? MODAL_DIALOG_DESCRIPTOR.rounding.bottomRight
  : MODAL_SIDE_SHEET_DESCRIPTOR.rounding.bottomRight)
const panelSurfaceRole = computed(() => panelAsWindow.value ? MODAL_DIALOG_DESCRIPTOR.variant : MODAL_SIDE_SHEET_DESCRIPTOR.variant)
const panelElevation = computed(() => panelAsWindow.value
  ? Math.max(MODAL_DIALOG_DESCRIPTOR.elevation, modalElevationBase.value)
  : modalElevationBase.value)
const panelTransitionMs = computed(() => {
  if (panelAsWindow.value && windowClosing.value) {
    return DIALOG_HIDE_MS
  }

  return PANEL_TRANSITION_MS
})
const panelTransitionTiming = computed(() => PANEL_TRANSITION_EASING)
const panelInlineStyle = computed(() => {
  if (!(panelAsWindow.value && windowClosing.value)) {
    return {}
  }

  return {
    opacity: 0,
    transform: 'translate(-50%, calc(-50% - 24px))',
  }
})

function hiddenInsetRight() {
  return -(sideSheetWidth.value + 12)
}

function resolveSheetWidthFromLayout() {
  const layoutWidth = Math.round(layoutRoot.value?.getBoundingClientRect().width ?? window.innerWidth)
  const estimated = Math.round((layoutWidth * SIDE_SHEET_WIDTH_RATIO) / SIDE_SHEET_WIDTH_STEP) * SIDE_SHEET_WIDTH_STEP

  return clamp(estimated, SIDE_SHEET_WIDTH_MIN, SIDE_SHEET_WIDTH_MAX)
}

function resolveWindowWidth() {
  const estimated = Math.round((window.innerWidth * WINDOW_WIDTH_RATIO) / WINDOW_WIDTH_STEP) * WINDOW_WIDTH_STEP

  return clamp(estimated, WINDOW_WIDTH_MIN, WINDOW_WIDTH_MAX)
}

function syncDimensions() {
  sideSheetWidth.value = resolveSheetWidthFromLayout()
  windowWidth.value = resolveWindowWidth()

  if (!modalMounted.value) {
    modalInsetRight.value = hiddenInsetRight()
  }
}

async function openModal() {
  if (transitioning.value || modalMounted.value) {
    return
  }

  transitioning.value = true
  panelAsWindow.value = false
  windowClosing.value = false
  syncDimensions()

  modalRadiusLeft.value = HIDDEN_SURFACE_DESCRIPTOR.rounding.topLeft
  modalElevationBase.value = HIDDEN_SURFACE_DESCRIPTOR.elevation
  modalInsetRight.value = hiddenInsetRight()
  modalMounted.value = true

  // Let modal layer mount before showing scrim and panel enter animation.
  await nextTick()
  await raf()

  modalVisible.value = true
  await nextTick()
  await raf()

  modalInsetRight.value = MODAL_INSET_END
  modalRadiusLeft.value = MODAL_SIDE_SHEET_DESCRIPTOR.rounding.topLeft
  modalElevationBase.value = MODAL_SIDE_SHEET_DESCRIPTOR.elevation
  await wait(PANEL_TRANSITION_MS)
  transitioning.value = false
}

async function toggleWindowMode() {
  if (transitioning.value || !modalMounted.value) {
    return
  }

  transitioning.value = true

  if (!panelAsWindow.value) {
    panelAsWindow.value = true
    await wait(PANEL_TRANSITION_MS)
    transitioning.value = false
    return
  }

  panelAsWindow.value = false
  await wait(PANEL_TRANSITION_MS)
  transitioning.value = false
}

async function closeModal() {
  if (transitioning.value || !modalMounted.value) {
    return
  }

  transitioning.value = true

  if (panelAsWindow.value) {
    await closeWindowModal()
    transitioning.value = false
    return
  }

  await closeSideSheetModal()
  transitioning.value = false
}

function resetForm() {
  Object.assign(form, DEFAULT_FORM)
}

async function closeWindowModal() {
  windowClosing.value = true
  await wait(DIALOG_HIDE_MS)

  modalVisible.value = false
  await wait(SCRIM_FADE_MS)
  modalMounted.value = false

  modalInsetRight.value = hiddenInsetRight()
  modalRadiusLeft.value = HIDDEN_SURFACE_DESCRIPTOR.rounding.topLeft
  modalElevationBase.value = HIDDEN_SURFACE_DESCRIPTOR.elevation
  windowClosing.value = false
  panelAsWindow.value = false
}

async function closeSideSheetModal() {
  modalInsetRight.value = hiddenInsetRight()
  modalRadiusLeft.value = HIDDEN_SURFACE_DESCRIPTOR.rounding.topLeft
  modalElevationBase.value = HIDDEN_SURFACE_DESCRIPTOR.elevation
  await wait(PANEL_TRANSITION_MS)

  modalVisible.value = false
  await wait(SCRIM_FADE_MS)
  modalMounted.value = false
}

function onResize() {
  syncDimensions()
}

onMounted(() => {
  syncDimensions()
  window.addEventListener('resize', onResize, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<style lang="scss" scoped>
.surface-side-sheet-window {
    --surface-scene-bg-0: var(--m3-sys-surface, var(--md-sys-color-surface, #fef7ff));
    --surface-scene-bg-1: var(--m3-sys-surface-container-low, var(--md-sys-color-surface-container-low, #f7f2fa));
    --surface-accent-a: color-mix(in srgb, var(--m3-sys-primary, var(--md-sys-color-primary, #6750a4)) 18%, transparent);
    --surface-accent-b: color-mix(in srgb, var(--m3-sys-secondary, var(--md-sys-color-secondary, #625b71)) 16%, transparent);
    --surface-shadow-color: color-mix(in srgb, var(--m3-sys-shadow, #000000) 22%, transparent);
    --surface-layout-bg: var(--m3-sys-surface-container, var(--md-sys-color-surface-container, #f3edf7));
    --surface-grid-bg: var(--m3-sys-surface-container-low, var(--md-sys-color-surface-container-low, #f7f2fa));
    min-block-size: 100vh;
    background:
        radial-gradient(circle at 8% 0%, var(--surface-accent-a), transparent 42%),
        radial-gradient(circle at 92% 0%, var(--surface-accent-b), transparent 44%),
        linear-gradient(180deg, var(--surface-scene-bg-0) 0%, var(--surface-scene-bg-1) 100%);
    color: var(--m3-sys-on-surface, var(--md-sys-color-on-surface, #1d1b20));
}

.surface-side-sheet-window__topbar-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.surface-side-sheet-window__topbar-content strong {
    display: block;
    font: 700 15px/1.3 'Trebuchet MS', 'Segoe UI', sans-serif;
}

.surface-side-sheet-window__topbar-content p {
    margin-block: 4px 0;
    margin-inline: 0;
    font: 400 12px/1.35 'Trebuchet MS', 'Segoe UI', sans-serif;
    opacity: 0.82;
}

.surface-side-sheet-window__body {
    display: flex;
    block-size: calc(100vh - 72px);
    padding-inline-start: var(--m3-navigation-rail-width, 80px);
}

@media (min-width: 1200px) {
    .surface-side-sheet-window__body {
        padding-inline-start: var(--m3-navigation-drawer-width, 360px);
    }
}

:global(.surface-side-sheet-window__nav.m3-navigation) {
    inset-block-start: 72px;
    block-size: calc(100vh - 72px);
}

.surface-side-sheet-window__workspace {
    flex: 1 1 auto;
    min-inline-size: 0;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.surface-side-sheet-window__topbar {
    padding: 16px;
}

.surface-side-sheet-window__header-card {
    padding: 18px;
}

.surface-side-sheet-window__header-card h3 {
    margin-block: 0 8px;
    margin-inline: 0;
    font: 700 17px/1.3 'Trebuchet MS', 'Segoe UI', sans-serif;
}

.surface-side-sheet-window__header-card p {
    margin: 0;
    font: 400 12px/1.35 'Trebuchet MS', 'Segoe UI', sans-serif;
}

.surface-side-sheet-window__layout {
    min-block-size: 440px;
    display: flex;
    overflow: hidden;
    border-radius: 20px;
    background: var(--surface-layout-bg);
    box-shadow: 0 14px 28px var(--surface-shadow-color);
}

.surface-side-sheet-window__content-grid {
    flex: 1 1 auto;
    min-inline-size: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: min-content;
    gap: 12px;
    padding: 14px;
    align-content: flex-start;
    align-items: start;
    background: var(--surface-grid-bg);
}

.surface-side-sheet-window__content-grid > .surface-side-sheet-window__grid-surface {
    padding: 18px;
}

.surface-side-sheet-window__content-grid p {
    margin-block: 6px 0;
    margin-inline: 0;
    font: 400 12px/1.35 'Trebuchet MS', 'Segoe UI', sans-serif;
}

:global(.surface-side-sheet-window__modal-header) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

:global(.surface-side-sheet-window__sheet_sheet) {
    padding: 24px;
}

:global(.surface-side-sheet-window__sheet_window) {
    padding: 20px;
}

:global(.surface-side-sheet-window__modal-header h3) {
    margin: 0;
    font: 700 17px/1.3 'Trebuchet MS', 'Segoe UI', sans-serif;
}

:global(.surface-side-sheet-window__modal-actions) {
    display: flex;
    align-items: center;
    gap: 6px;
}

:global(.surface-side-sheet-window__modal-action) {
    flex: 0 0 auto;
}

:global(.surface-side-sheet-window__sheet p) {
    margin-block: 8px 0;
    margin-inline: 0;
    font: 400 13px/1.4 'Trebuchet MS', 'Segoe UI', sans-serif;
}

:global(.surface-side-sheet-window__panel-content) {
    min-block-size: 0;
}

.surface-side-sheet-window__form {
    margin-block-start: 14px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
}

.surface-side-sheet-window__form_window {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
}

.surface-side-sheet-window__field {
    display: grid;
    gap: 6px;
}

.surface-side-sheet-window__field_wide {
    grid-column: 1 / -1;
}

.surface-side-sheet-window__field :deep(.m3-text-field),
.surface-side-sheet-window__field :deep(.m3-select) {
    inline-size: 100%;
}

.surface-side-sheet-window__field_wide :deep(.m3-text-field textarea) {
    min-block-size: 120px;
}

.surface-side-sheet-window__form-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-start;
}

.surface-side-sheet-window__form-actions_window {
    grid-column: 1 / -1;
    justify-content: flex-end;
}
</style>
