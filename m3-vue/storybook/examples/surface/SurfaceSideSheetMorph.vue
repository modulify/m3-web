<template>
    <div
        class="surface-side-sheet"
        :data-sheet-modal="sideSheetModal ? 'true' : 'false'"
        data-testid="surface-morph-root"
    >
        <M3Surface
            class="surface-side-sheet__topbar"
            :fill-height="false"
            :height="72"
            surface-role="surface-container"
            :elevation="0"
        >
            <div class="surface-side-sheet__topbar-content">
                <div>
                    <strong>Surface orchestration: side sheet morph</strong>
                    <p>Docked sheet transitions into modal sheet with fixed width, right-edge anchoring, and full-height modal target.</p>
                </div>

                <M3Button
                    appearance="tonal"
                    :disabled="transitioning"
                    data-testid="surface-morph-toggle"
                    @click="toggleSideSheetMode"
                >
                    {{ sideSheetModal ? 'Switch to docked sheet' : 'Switch to modal sheet' }}
                </M3Button>
            </div>
        </M3Surface>

        <M3Navigation
            v-model:expanded="navExpanded"
            class="surface-side-sheet__nav"
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

        <div class="surface-side-sheet__body">
            <div class="surface-side-sheet__workspace">
                <M3Surface
                    class="surface-side-sheet__header-card"
                    :fill-height="false"
                    :height="120"
                    :rounding="20"
                    surface-role="surface-container-lowest"
                    :elevation="0"
                >
                    <h3>Workspace surfaces</h3>
                    <p>Static blocks keep flow while side-sheet changes modality.</p>
                </M3Surface>

                <div
                    ref="layoutRoot"
                    class="surface-side-sheet__layout"
                    data-testid="surface-morph-layout"
                >
                    <main
                        class="surface-side-sheet__content-grid"
                        data-testid="surface-morph-content-grid"
                    >
                        <M3Surface
                            class="surface-side-sheet__grid-surface"
                            :fill-height="false"
                            :height="136"
                            :rounding="18"
                            surface-role="surface-container-lowest"
                            :elevation="0"
                        >
                            <strong>surface-container-lowest</strong>
                            <p>Read-heavy content block in the page flow.</p>
                        </M3Surface>

                        <M3Surface
                            class="surface-side-sheet__grid-surface"
                            :fill-height="false"
                            :height="136"
                            :rounding="18"
                            surface-role="surface-container-low"
                            :elevation="1"
                        >
                            <strong>surface-container-low</strong>
                            <p>Secondary block with mild emphasis.</p>
                        </M3Surface>

                        <M3Surface
                            class="surface-side-sheet__grid-surface"
                            :fill-height="false"
                            :height="136"
                            :rounding="18"
                            surface-role="surface-container-high"
                            :elevation="3"
                        >
                            <strong>surface-container-high</strong>
                            <p>Contextual utility content.</p>
                        </M3Surface>

                        <M3Surface
                            class="surface-side-sheet__grid-surface"
                            :fill-height="false"
                            :height="136"
                            :rounding="18"
                            surface-role="surface-dim"
                            :elevation="0"
                        >
                            <strong>surface-dim</strong>
                            <p>Low-brightness complementary content.</p>
                        </M3Surface>
                    </main>

                    <div
                        ref="dockedHost"
                        class="surface-side-sheet__docked-host"
                        :style="{ width: `${sideSheetDockedWidth}px` }"
                        data-testid="surface-morph-docked-host"
                    >
                        <M3Surface
                            v-if="!sideSheetModal"
                            class="surface-side-sheet__sheet"
                            :fill-width="true"
                            :fill-height="true"
                            :rounding="0"
                            surface-role="surface-container-low"
                            :elevation="0"
                            overflow="auto"
                            data-testid="surface-morph-docked-sheet"
                        >
                            <h3>Docked side sheet</h3>
                            <p>Coplanar layout participant with fixed width per layout region.</p>
                            <p>Main content remains interactive.</p>
                            <p class="surface-side-sheet__meta">
                                Fixed width: {{ sideSheetWidth }}px
                            </p>
                        </M3Surface>
                    </div>

                    <M3Surface
                        v-if="modalShown"
                        class="surface-side-sheet__sheet surface-side-sheet__sheet_modal"
                        mode="modal"
                        :shown="modalVisible"
                        anchor="end"
                        :fill-width="false"
                        :fill-height="false"
                        :width="modalWidth"
                        :inset-top="modalInsetTop"
                        :inset-right="modalInsetRight"
                        :inset-bottom="modalInsetBottom"
                        :rounding-top-left="modalRadiusLeft"
                        :rounding-bottom-left="modalRadiusLeft"
                        :rounding-top-right="0"
                        :rounding-bottom-right="0"
                        :transition-ms="PANEL_TRANSITION_MS"
                        :transition-timing="PANEL_TRANSITION_EASING"
                        :z-index="520"
                        :surface-role="modalRole"
                        :elevation="modalElevation"
                        overflow="auto"
                        data-testid="surface-morph-modal-sheet"
                        @dismiss="closeModalFromPanel"
                    >
                        <div class="surface-side-sheet__modal-header">
                            <h3>Modal side sheet</h3>

                            <M3IconButton
                                v-if="sideSheetModal"
                                class="surface-side-sheet__modal-close"
                                appearance="standard"
                                aria-label="Close modal side sheet"
                                :disabled="transitioning"
                                data-testid="surface-morph-close"
                                @click="closeModalFromPanel"
                            >
                                <M3Icon name="close" />
                            </M3IconButton>
                        </div>

                        <p>Layer rebind: docked layer to modal layer.</p>
                        <p>Anchored to end/right edge with full-height modal surface.</p>
                        <p class="surface-side-sheet__meta">
                            Fixed width: {{ modalWidth }}px
                        </p>
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
import M3Surface from '@/experimental/M3Surface.vue'

import {
  onBeforeUnmount,
  onMounted,
  nextTick,
  ref,
} from 'vue'

const SIDE_SHEET_WIDTH_MIN = 280
const SIDE_SHEET_WIDTH_MAX = 360
const SIDE_SHEET_WIDTH_RATIO = 0.32
const SIDE_SHEET_WIDTH_STEP = 4

const MODAL_INSET_TOP = 0
const MODAL_INSET_BOTTOM = 0
const MODAL_INSET_END = 0
const PANEL_TRANSITION_MS = 300
const PANEL_TRANSITION_EASING = 'cubic-bezier(0.2, 0, 0, 1)'
const SCRIM_FADE_MS = 500

const navExpanded = ref(false)
const activeNavTab = ref<'inbox' | 'boards' | 'archive' | 'lab'>('inbox')
const sideSheetModal = ref(false)
const sideSheetWidth = ref(320)
const sideSheetDockedWidth = ref(sideSheetWidth.value)
const modalShown = ref(false)
const modalVisible = ref(false)
const modalWidth = ref(sideSheetWidth.value)
const modalInsetTop = ref(MODAL_INSET_TOP)
const modalInsetRight = ref(-(sideSheetWidth.value + 12))
const modalInsetBottom = ref(MODAL_INSET_BOTTOM)
const modalRadiusLeft = ref(0)
const modalElevation = ref(0)
const modalRole = ref<'surface-container-low' | 'surface-container-high'>('surface-container-low')
const transitioning = ref(false)
const dockedHost = ref<HTMLElement | null>(null)
const layoutRoot = ref<HTMLElement | null>(null)

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}

function raf() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve())
  })
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function hiddenInsetRight() {
  return -(modalWidth.value + 12)
}

function resolveSheetWidthFromLayout() {
  const layoutWidth = Math.round(layoutRoot.value?.getBoundingClientRect().width ?? window.innerWidth)
  const estimated = Math.round((layoutWidth * SIDE_SHEET_WIDTH_RATIO) / SIDE_SHEET_WIDTH_STEP) * SIDE_SHEET_WIDTH_STEP

  return clamp(estimated, SIDE_SHEET_WIDTH_MIN, SIDE_SHEET_WIDTH_MAX)
}

function syncFixedWidth() {
  const nextWidth = resolveSheetWidthFromLayout()

  sideSheetWidth.value = nextWidth
  modalWidth.value = nextWidth

  if (!sideSheetModal.value) {
    sideSheetDockedWidth.value = nextWidth
    modalInsetRight.value = hiddenInsetRight()
  }
}

function measureDockedGeometry() {
  const host = dockedHost.value
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

function setModalGeometryFromDocked() {
  const docked = measureDockedGeometry()

  modalWidth.value = docked?.width ?? sideSheetWidth.value
  modalInsetTop.value = docked?.insetTop ?? MODAL_INSET_TOP
  modalInsetRight.value = docked?.insetRight ?? MODAL_INSET_END
  modalInsetBottom.value = docked?.insetBottom ?? MODAL_INSET_BOTTOM
}

function setModalGeometryTarget() {
  modalWidth.value = sideSheetWidth.value
  modalInsetTop.value = MODAL_INSET_TOP
  modalInsetRight.value = MODAL_INSET_END
  modalInsetBottom.value = MODAL_INSET_BOTTOM
}

async function switchDockedToModal() {
  syncFixedWidth()
  setModalGeometryFromDocked()

  modalRadiusLeft.value = 0
  modalElevation.value = 0
  modalRole.value = 'surface-container-low'
  modalVisible.value = false
  modalShown.value = true

  await nextTick()
  await raf()

  modalVisible.value = true
  await nextTick()
  await raf()

  sideSheetModal.value = true
  sideSheetDockedWidth.value = 0
  setModalGeometryTarget()
  modalRadiusLeft.value = 28
  modalElevation.value = 1
  modalRole.value = 'surface-container-high'
  await wait(PANEL_TRANSITION_MS)
}

async function switchModalToDocked() {
  syncFixedWidth()

  modalElevation.value = 0
  modalRole.value = 'surface-container-low'
  modalRadiusLeft.value = 0
  modalInsetTop.value = MODAL_INSET_TOP
  modalInsetBottom.value = MODAL_INSET_BOTTOM
  modalInsetRight.value = hiddenInsetRight()
  await wait(PANEL_TRANSITION_MS)
  modalVisible.value = false
  await wait(SCRIM_FADE_MS)
  modalShown.value = false
  sideSheetModal.value = false
  await nextTick()
  await raf()
  sideSheetDockedWidth.value = sideSheetWidth.value
  await wait(PANEL_TRANSITION_MS)
}

async function toggleSideSheetMode() {
  if (transitioning.value) {
    return
  }

  transitioning.value = true

  if (!sideSheetModal.value) {
    await switchDockedToModal()
    transitioning.value = false
    return
  }

  await switchModalToDocked()
  transitioning.value = false
}

async function closeModalFromPanel() {
  if (!sideSheetModal.value || transitioning.value) {
    return
  }

  transitioning.value = true
  await switchModalToDocked()
  transitioning.value = false
}

function onResize() {
  syncFixedWidth()
}

onMounted(() => {
  syncFixedWidth()
  window.addEventListener('resize', onResize, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<style scoped>
.surface-side-sheet {
    --surface-scene-bg-0: var(--m3-sys-surface, var(--md-sys-color-surface, #fef7ff));
    --surface-scene-bg-1: var(--m3-sys-surface-container-low, var(--md-sys-color-surface-container-low, #f7f2fa));
    --surface-accent-a: color-mix(in srgb, var(--m3-sys-primary, var(--md-sys-color-primary, #6750a4)) 18%, transparent);
    --surface-accent-b: color-mix(in srgb, var(--m3-sys-secondary, var(--md-sys-color-secondary, #625b71)) 16%, transparent);
    --surface-border: var(--m3-sys-outline-variant, var(--md-sys-color-outline-variant, rgba(73, 69, 79, 0.2)));
    --surface-shadow-color: color-mix(in srgb, var(--m3-sys-shadow, #000000) 22%, transparent);
    --surface-layout-bg: var(--m3-sys-surface-container, var(--md-sys-color-surface-container, #f3edf7));
    --surface-grid-bg: var(--m3-sys-surface-container-low, var(--md-sys-color-surface-container-low, #f7f2fa));
    --surface-panel-transition-ms: 300ms;
    --surface-panel-transition-easing: cubic-bezier(0.2, 0, 0, 1);
    min-height: 100vh;
    background:
        radial-gradient(circle at 8% 0%, var(--surface-accent-a), transparent 42%),
        radial-gradient(circle at 92% 0%, var(--surface-accent-b), transparent 44%),
        linear-gradient(180deg, var(--surface-scene-bg-0) 0%, var(--surface-scene-bg-1) 100%);
    color: var(--m3-sys-on-surface, var(--md-sys-color-on-surface, #1d1b20));
}

.surface-side-sheet__topbar-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.surface-side-sheet__topbar-content strong {
    display: block;
    font: 700 15px/1.3 'Trebuchet MS', 'Segoe UI', sans-serif;
}

.surface-side-sheet__topbar-content p {
    margin: 4px 0 0;
    font: 400 12px/1.35 'Trebuchet MS', 'Segoe UI', sans-serif;
    opacity: 0.82;
}

.surface-side-sheet__body {
    display: flex;
    height: calc(100vh - 72px);
    padding-left: var(--m3-navigation-rail-width, 80px);
}

@media (min-width: 1200px) {
    .surface-side-sheet__body {
        padding-left: var(--m3-navigation-drawer-width, 360px);
    }
}

:global(.surface-side-sheet__nav.m3-navigation) {
    top: 72px;
    height: calc(100vh - 72px);
}

.surface-side-sheet__workspace {
    flex: 1 1 auto;
    min-width: 0;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.surface-side-sheet__topbar {
    padding: 16px;
}

.surface-side-sheet__header-card {
    padding: 18px;
}

.surface-side-sheet__header-card h3 {
    margin: 0 0 8px;
    font: 700 17px/1.3 'Trebuchet MS', 'Segoe UI', sans-serif;
}

.surface-side-sheet__header-card p {
    margin: 0;
    font: 400 12px/1.35 'Trebuchet MS', 'Segoe UI', sans-serif;
}

.surface-side-sheet__layout {
    min-height: 440px;
    display: flex;
    overflow: hidden;
    border-radius: 20px;
    background: var(--surface-layout-bg);
    box-shadow: 0 14px 28px var(--surface-shadow-color);
}

.surface-side-sheet__content-grid {
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

.surface-side-sheet__content-grid > .surface-side-sheet__grid-surface {
    padding: 18px;
}

.surface-side-sheet__content-grid p {
    margin: 6px 0 0;
    font: 400 12px/1.35 'Trebuchet MS', 'Segoe UI', sans-serif;
}

.surface-side-sheet__docked-host {
    flex: 0 0 auto;
    min-width: 0;
    overflow: hidden;
    border-left: 1px solid var(--surface-border);
    transition: width var(--surface-panel-transition-ms) var(--surface-panel-transition-easing);
}

:global(.surface-side-sheet__sheet h3) {
    margin: 0 0 8px;
    font: 700 17px/1.3 'Trebuchet MS', 'Segoe UI', sans-serif;
}

:global(.surface-side-sheet__sheet) {
    padding: 20px;
}

:global(.surface-side-sheet__sheet_modal) {
    padding: 24px;
}

:global(.surface-side-sheet__modal-header) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

:global(.surface-side-sheet__modal-close) {
    flex: 0 0 auto;
}

:global(.surface-side-sheet__sheet p) {
    margin: 0 0 8px;
    font: 400 13px/1.4 'Trebuchet MS', 'Segoe UI', sans-serif;
}

:global(.surface-side-sheet__sheet .surface-side-sheet__meta) {
    margin-top: 14px;
    font: 600 11px/1.2 'Trebuchet MS', 'Segoe UI', sans-serif;
    letter-spacing: 0.04em;
    opacity: 0.76;
    text-transform: uppercase;
}
</style>
