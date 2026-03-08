<template>
    <div
        class="surface-side-sheet-window"
        :data-panel-mode="panelAsWindow ? 'window' : 'sheet'"
        :data-panel-mounted="modalMounted ? 'true' : 'false'"
        data-testid="surface-window-root"
    >
        <M3SurfacePanel
            class="surface-side-sheet-window__topbar"
            :fill-height="false"
            :height="72"
            variant="surface-container"
            :elevation="0"
        >
            <div class="surface-side-sheet-window__topbar-content">
                <div>
                    <strong>Surface orchestration: modal side sheet to window</strong>
                    <p>Use the action inside the panel to morph a modal side sheet into a modal window.</p>
                </div>

                <M3Button
                    appearance="tonal"
                    :disabled="transitioning || modalMounted"
                    data-testid="surface-window-open"
                    @click="openModal"
                >
                    {{ modalMounted ? 'Modal panel is open' : 'Show modal side sheet' }}
                </M3Button>
            </div>
        </M3SurfacePanel>

        <M3Navigation
            v-model:expanded="navExpanded"
            class="surface-side-sheet-window__nav"
            appearance="auto"
            alignment="top"
        >
            <template #top>
                <M3IconButton
                    aria-label="Open navigation"
                    @click="navExpanded = true"
                >
                    <M3Icon name="menu" />
                </M3IconButton>
            </template>

            <M3NavigationTab
                label="Inbox"
                :active="activeNavTab === 'inbox'"
                @navigate="activeNavTab = 'inbox'; navExpanded = false"
            >
                <M3Icon name="inbox" />
            </M3NavigationTab>

            <M3NavigationTab
                label="Boards"
                :active="activeNavTab === 'boards'"
                @navigate="activeNavTab = 'boards'; navExpanded = false"
            >
                <M3Icon name="dashboard" />
            </M3NavigationTab>

            <M3NavigationTab
                label="Archive"
                :active="activeNavTab === 'archive'"
                @navigate="activeNavTab = 'archive'; navExpanded = false"
            >
                <M3Icon name="archive" />
            </M3NavigationTab>

            <M3NavigationTab
                label="Lab"
                :active="activeNavTab === 'lab'"
                @navigate="activeNavTab = 'lab'; navExpanded = false"
            >
                <M3Icon name="science" />
            </M3NavigationTab>
        </M3Navigation>

        <div class="surface-side-sheet-window__body">
            <div class="surface-side-sheet-window__workspace">
                <M3SurfacePanel
                    class="surface-side-sheet-window__header-card"
                    :fill-height="false"
                    :height="120"
                    :rounding="20"
                    variant="surface-container-lowest"
                    :elevation="0"
                >
                    <h3>Workspace surfaces</h3>
                    <p>Background layout stays in flow while the modal panel morphs between side-sheet and window geometries.</p>
                </M3SurfacePanel>

                <div
                    ref="layoutRoot"
                    class="surface-side-sheet-window__layout"
                    data-testid="surface-window-layout"
                >
                    <main
                        class="surface-side-sheet-window__content-grid"
                        data-testid="surface-window-content-grid"
                    >
                        <M3SurfacePanel
                            class="surface-side-sheet-window__grid-surface"
                            :fill-height="false"
                            :height="136"
                            :rounding="18"
                            variant="surface-container-lowest"
                            :elevation="0"
                        >
                            <strong>surface-container-lowest</strong>
                            <p>Read-heavy content block in the page flow.</p>
                        </M3SurfacePanel>

                        <M3SurfacePanel
                            class="surface-side-sheet-window__grid-surface"
                            :fill-height="false"
                            :height="136"
                            :rounding="18"
                            variant="surface-container-low"
                            :elevation="1"
                        >
                            <strong>surface-container-low</strong>
                            <p>Secondary block with mild emphasis.</p>
                        </M3SurfacePanel>

                        <M3SurfacePanel
                            class="surface-side-sheet-window__grid-surface"
                            :fill-height="false"
                            :height="136"
                            :rounding="18"
                            variant="surface-container-high"
                            :elevation="3"
                        >
                            <strong>surface-container-high</strong>
                            <p>Contextual utility content.</p>
                        </M3SurfacePanel>

                        <M3SurfacePanel
                            class="surface-side-sheet-window__grid-surface"
                            :fill-height="false"
                            :height="136"
                            :rounding="18"
                            variant="surface-dim"
                            :elevation="0"
                        >
                            <strong>surface-dim</strong>
                            <p>Low-brightness complementary content.</p>
                        </M3SurfacePanel>
                    </main>

                    <M3Surface
                        v-if="modalMounted"
                        :class="[
                            'surface-side-sheet-window__sheet',
                            panelAsWindow ? 'surface-side-sheet-window__sheet_window' : 'surface-side-sheet-window__sheet_sheet',
                        ]"
                        mode="modal"
                        :shown="modalVisible"
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
                        :transition-ms="panelTransitionMs"
                        :transition-timing="panelTransitionTiming"
                        :z-index="520"
                        :variant="panelSurfaceRole"
                        :elevation="panelElevation"
                        :style="panelInlineStyle"
                        overflow="auto"
                        :data-panel-mode="panelAsWindow ? 'window' : 'sheet'"
                        :data-window-closing="windowClosing ? 'true' : 'false'"
                        data-testid="surface-window-panel"
                        @dismiss="closeModal"
                    >
                        <div
                            class="surface-side-sheet-window__panel-content"
                            data-testid="surface-window-panel-content"
                        >
                            <div class="surface-side-sheet-window__modal-header">
                                <h3>{{ panelAsWindow ? 'Window mode' : 'Modal side sheet' }}</h3>

                                <div class="surface-side-sheet-window__modal-actions">
                                    <M3IconButton
                                        class="surface-side-sheet-window__modal-action"
                                        appearance="standard"
                                        :aria-label="panelAsWindow ? 'Dock panel to side sheet mode' : 'Open panel in window mode'"
                                        :disabled="transitioning"
                                        data-testid="surface-window-toggle-mode"
                                        @click="toggleWindowMode"
                                    >
                                        <M3Icon :name="panelAsWindow ? 'close_fullscreen' : 'open_in_new'" />
                                    </M3IconButton>

                                    <M3IconButton
                                        class="surface-side-sheet-window__modal-action"
                                        appearance="standard"
                                        aria-label="Close modal panel"
                                        :disabled="transitioning"
                                        data-testid="surface-window-close"
                                        @click="closeModal"
                                    >
                                        <M3Icon name="close" />
                                    </M3IconButton>
                                </div>
                            </div>

                            <p>Form layout adapts when switching from side-sheet to window mode.</p>

                            <form
                                class="surface-side-sheet-window__form"
                                :class="{ 'surface-side-sheet-window__form_window': panelAsWindow }"
                                @submit.prevent
                            >
                                <div class="surface-side-sheet-window__field">
                                    <M3TextField
                                        v-model:value="form.project"
                                        label="Project name"
                                        placeholder="Q3 Design Refresh"
                                        outlined
                                    />
                                </div>

                                <div class="surface-side-sheet-window__field">
                                    <M3TextField
                                        v-model:value="form.ownerEmail"
                                        type="email"
                                        label="Owner email"
                                        placeholder="owner@example.com"
                                        outlined
                                    />
                                </div>

                                <div class="surface-side-sheet-window__field">
                                    <M3TextField
                                        v-model:value="form.startDate"
                                        label="Start date"
                                        placeholder="YYYY-MM-DD"
                                        outlined
                                    />
                                </div>

                                <div class="surface-side-sheet-window__field">
                                    <M3Select
                                        v-model:value="form.priority"
                                        :options="priorityOptions"
                                        label="Priority"
                                        outlined
                                    />
                                </div>

                                <div
                                    class="surface-side-sheet-window__field"
                                    :class="{ 'surface-side-sheet-window__field_wide': panelAsWindow }"
                                >
                                    <M3TextField
                                        v-model:value="form.notes"
                                        multiline
                                        label="Notes"
                                        placeholder="Describe constraints, risks, and acceptance criteria."
                                        outlined
                                    />
                                </div>

                                <div
                                    class="surface-side-sheet-window__form-actions"
                                    :class="{ 'surface-side-sheet-window__form-actions_window': panelAsWindow }"
                                >
                                    <M3Button
                                        appearance="text"
                                        type="button"
                                        @click="resetForm"
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
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'
import {
  M3Navigation,
  M3NavigationTab,
} from '@/components/navigation'
import { M3Select } from '@/components/select'
import { M3TextField } from '@/components/text-field'
import {
  M3Surface,
  M3SurfacePanel,
} from '@/components/surface'
import {
  clamp,
  raf,
  wait,
} from '@modulify/m3-foundation/lib/surface/orchestration'

import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
} from 'vue'
import { getSurfaceStateDescriptor } from '@modulify/m3-foundation/lib/surface/descriptor'
import {
  m3MotionDurations,
  m3MotionEasings,
} from '@modulify/m3-foundation/lib/motion'

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

const navExpanded = ref(false)
const activeNavTab = ref<'inbox' | 'boards' | 'archive' | 'lab'>('inbox')
const sideSheetWidth = ref(320)
const windowWidth = ref(720)

const modalInsetRight = ref(-(sideSheetWidth.value + 12))
const modalRadiusLeft = ref(HIDDEN_SURFACE_DESCRIPTOR.rounding.topLeft)
const modalElevationBase = ref(HIDDEN_SURFACE_DESCRIPTOR.elevation)

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

const DEFAULT_FORM: FormState = {
  project: 'Q3 Design Refresh',
  ownerEmail: 'owner@example.com',
  startDate: '2026-03-01',
  priority: 'normal',
  notes: 'Move supplemental workflows into a reusable surface with predictable transitions.',
}

const form = reactive<FormState>({ ...DEFAULT_FORM })

const priorityOptions = [{
  label: 'Low',
  value: 'low',
}, {
  label: 'Normal',
  value: 'normal',
}, {
  label: 'High',
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
    min-height: 100vh;
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
    margin: 4px 0 0;
    font: 400 12px/1.35 'Trebuchet MS', 'Segoe UI', sans-serif;
    opacity: 0.82;
}

.surface-side-sheet-window__body {
    display: flex;
    height: calc(100vh - 72px);
    padding-left: var(--m3-navigation-rail-width, 80px);
}

@media (min-width: 1200px) {
    .surface-side-sheet-window__body {
        padding-left: var(--m3-navigation-drawer-width, 360px);
    }
}

:global(.surface-side-sheet-window__nav.m3-navigation) {
    top: 72px;
    height: calc(100vh - 72px);
}

.surface-side-sheet-window__workspace {
    flex: 1 1 auto;
    min-width: 0;
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
    margin: 0 0 8px;
    font: 700 17px/1.3 'Trebuchet MS', 'Segoe UI', sans-serif;
}

.surface-side-sheet-window__header-card p {
    margin: 0;
    font: 400 12px/1.35 'Trebuchet MS', 'Segoe UI', sans-serif;
}

.surface-side-sheet-window__layout {
    min-height: 440px;
    display: flex;
    overflow: hidden;
    border-radius: 20px;
    background: var(--surface-layout-bg);
    box-shadow: 0 14px 28px var(--surface-shadow-color);
}

.surface-side-sheet-window__content-grid {
    flex: 1 1 auto;
    min-width: 0;
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
    margin: 6px 0 0;
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
    margin: 8px 0 0;
    font: 400 13px/1.4 'Trebuchet MS', 'Segoe UI', sans-serif;
}

:global(.surface-side-sheet-window__panel-content) {
    min-height: 0;
}

.surface-side-sheet-window__form {
    margin-top: 14px;
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
    width: 100%;
}

.surface-side-sheet-window__field_wide :deep(.m3-text-field textarea) {
    min-height: 120px;
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
