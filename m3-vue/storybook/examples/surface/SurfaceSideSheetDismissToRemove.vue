<template>
    <div class="surface-side-sheet">
        <M3Surface
            :fill-height="false"
            :height="72"
            :elevation="0"
            class="surface-side-sheet__topbar"
            variant="surface-container"
        >
            <div class="surface-side-sheet__topbar-content">
                <div>
                    <strong>{{ text.heading }}</strong><p>{{ text.description }}</p>
                </div>

                <M3Button
                    :disabled="transitioning || sheetRemoved"
                    appearance="tonal"
                    @click="handleTopbarAction"
                >
                    {{
                        sheetRemoved
                            ? text.removed
                            : (sideSheetModal ? text.closeRemove : text.switchModal)
                    }}
                </M3Button>
            </div>
        </M3Surface>

        <M3Navigation
            v-model:expanded="navExpanded"
            alignment="top"
            appearance="auto"
            class="surface-side-sheet__nav"
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

        <div class="surface-side-sheet__body">
            <div class="surface-side-sheet__workspace">
                <M3Surface
                    :fill-height="false"
                    :height="120"
                    :rounding="20"
                    :elevation="0"
                    class="surface-side-sheet__header-card"
                    variant="surface-container-lowest"
                >
                    <h3>{{ text.workspace }}</h3><p>{{ text.workspaceDescription }}</p>
                </M3Surface>

                <div
                    ref="layoutRoot"
                    class="surface-side-sheet__layout"
                >
                    <main class="surface-side-sheet__content-grid">
                        <M3Surface
                            :fill-height="false"
                            :height="136"
                            :rounding="18"
                            :elevation="0"
                            class="surface-side-sheet__grid-surface"
                            variant="surface-container-lowest"
                        >
                            <strong>surface-container-lowest</strong>
                            <p>{{ text.read }}</p>
                        </M3Surface>

                        <M3Surface
                            :fill-height="false"
                            :height="136"
                            :rounding="18"
                            :elevation="1"
                            class="surface-side-sheet__grid-surface"
                            variant="surface-container-low"
                        >
                            <strong>surface-container-low</strong>
                            <p>{{ text.secondary }}</p>
                        </M3Surface>

                        <M3Surface
                            :fill-height="false"
                            :height="136"
                            :rounding="18"
                            :elevation="3"
                            class="surface-side-sheet__grid-surface"
                            variant="surface-container-high"
                        >
                            <strong>surface-container-high</strong>
                            <p>{{ text.contextual }}</p>
                        </M3Surface>

                        <M3Surface
                            :fill-height="false"
                            :height="136"
                            :rounding="18"
                            :elevation="0"
                            class="surface-side-sheet__grid-surface"
                            variant="surface-dim"
                        >
                            <strong>surface-dim</strong>
                            <p>{{ text.dim }}</p>
                        </M3Surface>
                    </main>

                    <div
                        v-if="!sheetRemoved"
                        ref="dockedHost"
                        :style="{ width: `${sideSheetDockedWidth}px` }"
                        class="surface-side-sheet__docked-host"
                    >
                        <M3Surface
                            v-if="!sideSheetModal && !sheetRemoved"
                            :fill-width="true"
                            :fill-height="true"
                            :rounding="0"
                            :elevation="0"
                            overflow="auto"
                            class="surface-side-sheet__sheet"
                            variant="surface-container-low"
                        >
                            <h3>{{ text.docked }}</h3><p>{{ text.dockedDescription }}</p><p>{{ text.interactive }}</p>
                            <p class="surface-side-sheet__meta">
                                Fixed width: {{ sideSheetWidth }}px
                            </p>
                        </M3Surface>
                    </div>

                    <M3Surface
                        v-if="modalShown"
                        :shown="modalVisible"
                        :transition-ms="PANEL_TRANSITION_MS"
                        :transition-timing="PANEL_TRANSITION_EASING"
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
                        :z-index="520"
                        :elevation="modalElevation"
                        :variant="modalRole"
                        mode="modal"
                        anchor="end"
                        overflow="auto"
                        class="surface-side-sheet__sheet surface-side-sheet__sheet_modal"
                        @dismiss="closeModalFromPanel"
                    >
                        <div class="surface-side-sheet__modal-header">
                            <h3>{{ text.modal }}</h3>

                            <M3IconButton
                                v-if="sideSheetModal"
                                :disabled="transitioning"
                                :aria-label="text.close"
                                appearance="standard"
                                class="surface-side-sheet__modal-close"
                                @click="closeModalFromPanel"
                            >
                                <M3Icon name="close" />
                            </M3IconButton>
                        </div>

                        <p>{{ text.layer }}</p><p>{{ text.modalDescription }}</p><p>{{ text.removeDescription }}</p>
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
import type { StorybookLocale } from '../../i18n'

import { clamp } from '@modulify/m3-foundation/lib/surface/orchestration'
import { nextTick, onBeforeUnmount, onMounted } from 'vue'
import { raf } from '@modulify/m3-foundation/lib/surface/orchestration'
import { ref } from 'vue'
import { wait } from '@modulify/m3-foundation/lib/surface/orchestration'

import { durations, easing } from '@modulify/m3-foundation/lib/motion'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'
import { M3Navigation, M3NavigationTab } from '@/components/navigation'
import { M3Surface } from '@/components/surface'

import { localize } from '../../i18n'

const props = defineProps<{ locale: StorybookLocale }>()
const text = localize(props.locale, {
  'en-US': { archive: 'Archive', boards: 'Boards', close: 'Close modal side sheet', closeRemove: 'Close modal and remove sheet', contextual: 'Contextual utility content.', description: 'After modal close, the side sheet is removed from the page instead of returning to docked mode.', dim: 'Low-brightness complementary content.', docked: 'Docked side sheet', dockedDescription: 'Coplanar layout participant with fixed width per layout region.', heading: 'Surface orchestration: side sheet remove flow', inbox: 'Inbox', interactive: 'Main content remains interactive.', lab: 'Lab', layer: 'Layer rebind: docked layer to modal layer.', modal: 'Modal side sheet', modalDescription: 'Anchored to end/right edge with full-height modal surface.', openNavigation: 'Open navigation', read: 'Read-heavy content block in the page flow.', removed: 'Side sheet removed', removeDescription: 'Closing this modal removes the side sheet from the scene.', secondary: 'Secondary block with mild emphasis.', switchModal: 'Switch to modal sheet', workspace: 'Workspace surfaces', workspaceDescription: 'Static blocks keep flow while side-sheet changes modality.' },
  'ru-RU': { archive: 'Архив', boards: 'Доски', close: 'Закрыть модальную панель', closeRemove: 'Закрыть и удалить панель', contextual: 'Контекстное вспомогательное содержимое.', description: 'После закрытия модальной панели она удаляется со страницы, а не возвращается в закреплённый режим.', dim: 'Дополнительное содержимое с пониженной яркостью.', docked: 'Закреплённая боковая панель', dockedDescription: 'Участник общей компоновки с фиксированной шириной для области.', heading: 'Управление поверхностью: удаление боковой панели', inbox: 'Входящие', interactive: 'Основное содержимое остаётся интерактивным.', lab: 'Лаборатория', layer: 'Переназначение слоя: из закреплённого в модальный.', modal: 'Модальная боковая панель', modalDescription: 'Полноразмерная модальная поверхность закреплена у правого края.', openNavigation: 'Открыть навигацию', read: 'Блок для чтения в потоке страницы.', removed: 'Боковая панель удалена', removeDescription: 'Закрытие модального режима удаляет панель из сцены.', secondary: 'Вторичный блок с умеренным акцентом.', switchModal: 'Переключить в модальный режим', workspace: 'Поверхности рабочего пространства', workspaceDescription: 'Статичные блоки остаются в потоке при смене режима панели.' },
})

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

const navExpanded = ref(false)
const activeNavTab = ref<'inbox' | 'boards' | 'archive' | 'lab'>('inbox')
const sideSheetModal = ref(false)
const sheetRemoved = ref(false)
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

  if (sheetRemoved.value) {
    sideSheetDockedWidth.value = 0
    modalInsetRight.value = hiddenInsetRight()

    return
  }

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
  if (sheetRemoved.value) {
    return
  }

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

async function dismissModalAndRemove() {
  if (!sideSheetModal.value) {
    return
  }

  modalInsetTop.value = MODAL_INSET_TOP
  modalInsetBottom.value = MODAL_INSET_BOTTOM
  modalInsetRight.value = hiddenInsetRight()
  modalElevation.value = 0
  modalRole.value = 'surface-container-low'
  modalRadiusLeft.value = 0
  await wait(PANEL_TRANSITION_MS)
  modalVisible.value = false
  await wait(SCRIM_FADE_MS)
  modalShown.value = false
  sideSheetModal.value = false
  sideSheetDockedWidth.value = 0
  sheetRemoved.value = true
}

async function handleTopbarAction() {
  if (transitioning.value) {
    return
  }

  if (sheetRemoved.value) {
    return
  }

  transitioning.value = true

  if (!sideSheetModal.value) {
    await switchDockedToModal()
    transitioning.value = false
    return
  }

  await dismissModalAndRemove()
  transitioning.value = false
}

async function closeModalFromPanel() {
  if (!sideSheetModal.value || transitioning.value) {
    return
  }

  transitioning.value = true
  await dismissModalAndRemove()
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

<style lang="scss" scoped>
@use '@modulify/m3-foundation/assets/stylesheets/basics/motion' as m3-motion;

.surface-side-sheet {
    --surface-scene-bg-0: var(--m3-sys-surface, var(--md-sys-color-surface, #fef7ff));
    --surface-scene-bg-1: var(--m3-sys-surface-container-low, var(--md-sys-color-surface-container-low, #f7f2fa));
    --surface-accent-a: color-mix(in srgb, var(--m3-sys-primary, var(--md-sys-color-primary, #6750a4)) 18%, transparent);
    --surface-accent-b: color-mix(in srgb, var(--m3-sys-secondary, var(--md-sys-color-secondary, #625b71)) 16%, transparent);
    --surface-border: var(--m3-sys-outline-variant, var(--md-sys-color-outline-variant, rgba(73, 69, 79, 0.2)));
    --surface-shadow-color: color-mix(in srgb, var(--m3-sys-shadow, #000000) 22%, transparent);
    --surface-layout-bg: var(--m3-sys-surface-container, var(--md-sys-color-surface-container, #f3edf7));
    --surface-grid-bg: var(--m3-sys-surface-container-low, var(--md-sys-color-surface-container-low, #f7f2fa));
    --surface-panel-transition-ms: #{m3-motion.duration('medium2')};
    --surface-panel-transition-easing: #{m3-motion.easing('standard')};
    min-block-size: 100vh;
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
    margin-block: 4px 0;
    margin-inline: 0;
    font: 400 12px/1.35 'Trebuchet MS', 'Segoe UI', sans-serif;
    opacity: 0.82;
}

.surface-side-sheet__body {
    display: flex;
    block-size: calc(100vh - 72px);
    padding-inline-start: var(--m3-navigation-rail-width, 80px);
}

@media (min-width: 1200px) {
    .surface-side-sheet__body {
        padding-inline-start: var(--m3-navigation-drawer-width, 360px);
    }
}

:global(.surface-side-sheet__nav.m3-navigation) {
    inset-block-start: 72px;
    block-size: calc(100vh - 72px);
}

.surface-side-sheet__workspace {
    flex: 1 1 auto;
    min-inline-size: 0;
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
    margin-block: 0 8px;
    margin-inline: 0;
    font: 700 17px/1.3 'Trebuchet MS', 'Segoe UI', sans-serif;
}

.surface-side-sheet__header-card p {
    margin: 0;
    font: 400 12px/1.35 'Trebuchet MS', 'Segoe UI', sans-serif;
}

.surface-side-sheet__layout {
    min-block-size: 440px;
    display: flex;
    overflow: hidden;
    border-radius: 20px;
    background: var(--surface-layout-bg);
    box-shadow: 0 14px 28px var(--surface-shadow-color);
}

.surface-side-sheet__content-grid {
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

.surface-side-sheet__content-grid > .surface-side-sheet__grid-surface {
    padding: 18px;
}

.surface-side-sheet__content-grid p {
    margin-block: 6px 0;
    margin-inline: 0;
    font: 400 12px/1.35 'Trebuchet MS', 'Segoe UI', sans-serif;
}

.surface-side-sheet__docked-host {
    flex: 0 0 auto;
    min-inline-size: 0;
    overflow: hidden;
    border-left: 1px solid var(--surface-border);
    transition: width var(--surface-panel-transition-ms) var(--surface-panel-transition-easing);
}

:global(.surface-side-sheet__sheet h3) {
    margin-block: 0 8px;
    margin-inline: 0;
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
    margin-block: 0 8px;
    margin-inline: 0;
    font: 400 13px/1.4 'Trebuchet MS', 'Segoe UI', sans-serif;
}

:global(.surface-side-sheet__sheet .surface-side-sheet__meta) {
    margin-block-start: 14px;
    font: 600 11px/1.2 'Trebuchet MS', 'Segoe UI', sans-serif;
    letter-spacing: 0.04em;
    opacity: 0.76;
    text-transform: uppercase;
}
</style>
