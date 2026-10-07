<template>
    <div
        :data-modal-mounted="modalMounted ? 'true' : 'false'"
        data-testid="surface-always-root"
        class="surface-side-sheet"
    >
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
                    :disabled="transitioning || modalMounted"
                    data-testid="surface-always-open"
                    appearance="tonal"
                    @click="openModal"
                >
                    {{ modalMounted ? text.opened : text.open }}
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
                    data-testid="surface-always-layout"
                    class="surface-side-sheet__layout"
                >
                    <main
                        data-testid="surface-always-content-grid"
                        class="surface-side-sheet__content-grid"
                    >
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

                    <M3Surface
                        v-if="modalMounted"
                        :shown="modalVisible"
                        :transition-ms="PANEL_TRANSITION_MS"
                        :transition-timing="PANEL_TRANSITION_EASING"
                        :fill-width="false"
                        :fill-height="false"
                        :width="sideSheetWidth"
                        :inset-top="MODAL_INSET_TOP"
                        :inset-right="modalInsetRight"
                        :inset-bottom="MODAL_INSET_BOTTOM"
                        :rounding-top-left="modalRadiusLeft"
                        :rounding-bottom-left="modalRadiusLeft"
                        :rounding-top-right="0"
                        :rounding-bottom-right="0"
                        :z-index="520"
                        :elevation="modalElevation"
                        data-testid="surface-always-panel"
                        mode="modal"
                        anchor="end"
                        overflow="auto"
                        class="surface-side-sheet__sheet surface-side-sheet__sheet_modal"
                        variant="surface-container-high"
                        @dismiss="closeModal"
                    >
                        <div class="surface-side-sheet__modal-header">
                            <h3>{{ text.modal }}</h3>

                            <M3IconButton
                                :disabled="transitioning"
                                :aria-label="text.close"
                                data-testid="surface-always-close"
                                appearance="standard"
                                class="surface-side-sheet__modal-close"
                                @click="closeModal"
                            >
                                <M3Icon name="close" />
                            </M3IconButton>
                        </div>

                        <p>{{ text.modalDescription }}</p><p>{{ text.closeActions }}</p>
                        <p class="surface-side-sheet__meta">
                            Fixed width: {{ sideSheetWidth }}px
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
import M3Surface from '@/components/surface/M3Surface.vue'

import { localize } from '../../i18n'

const props = defineProps<{ locale: StorybookLocale }>()
const text = localize(props.locale, {
  'en-US': { archive: 'Archive', boards: 'Boards', close: 'Close modal side sheet', closeActions: 'Close actions: scrim click or close button inside the panel.', contextual: 'Contextual utility content.', description: 'The side sheet exists only in modal mode and can be shown repeatedly from the page header.', dim: 'Low-brightness complementary content.', heading: 'Surface orchestration: always-modal side sheet', inbox: 'Inbox', lab: 'Lab', modal: 'Modal side sheet', modalDescription: 'This side sheet is always modal and never returns to a docked state.', open: 'Show modal side sheet', opened: 'Modal side sheet is open', openNavigation: 'Open navigation', read: 'Read-heavy content block in the page flow.', secondary: 'Secondary block with mild emphasis.', workspace: 'Workspace surfaces', workspaceDescription: 'Background layout stays in flow while the side sheet appears as a modal overlay.' },
  'ru-RU': { archive: 'Архив', boards: 'Доски', close: 'Закрыть модальную панель', closeActions: 'Способы закрытия: нажатие на scrim или кнопка внутри панели.', contextual: 'Контекстное вспомогательное содержимое.', description: 'Боковая панель существует только в модальном режиме и может открываться повторно из заголовка страницы.', dim: 'Дополнительное содержимое с пониженной яркостью.', heading: 'Управление поверхностью: всегда модальная панель', inbox: 'Входящие', lab: 'Лаборатория', modal: 'Модальная боковая панель', modalDescription: 'Эта панель всегда модальная и не возвращается в закреплённое состояние.', open: 'Показать модальную панель', opened: 'Модальная панель открыта', openNavigation: 'Открыть навигацию', read: 'Блок для чтения в потоке страницы.', secondary: 'Вторичный блок с умеренным акцентом.', workspace: 'Поверхности рабочего пространства', workspaceDescription: 'Фоновая компоновка остаётся в потоке, пока панель показана как модальный overlay.' },
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
const sideSheetWidth = ref(320)
const modalInsetRight = ref(-(sideSheetWidth.value + 12))
const modalRadiusLeft = ref(0)
const modalElevation = ref(0)
const modalMounted = ref(false)
const modalVisible = ref(false)
const transitioning = ref(false)
const layoutRoot = ref<HTMLElement | null>(null)

function hiddenInsetRight() {
  return -(sideSheetWidth.value + 12)
}

function resolveSheetWidthFromLayout() {
  const layoutWidth = Math.round(layoutRoot.value?.getBoundingClientRect().width ?? window.innerWidth)
  const estimated = Math.round((layoutWidth * SIDE_SHEET_WIDTH_RATIO) / SIDE_SHEET_WIDTH_STEP) * SIDE_SHEET_WIDTH_STEP

  return clamp(estimated, SIDE_SHEET_WIDTH_MIN, SIDE_SHEET_WIDTH_MAX)
}

function syncFixedWidth() {
  sideSheetWidth.value = resolveSheetWidthFromLayout()

  if (!modalMounted.value) {
    modalInsetRight.value = hiddenInsetRight()
  }
}

async function openModal() {
  if (transitioning.value || modalMounted.value) {
    return
  }

  transitioning.value = true
  syncFixedWidth()

  modalRadiusLeft.value = 0
  modalElevation.value = 0
  modalInsetRight.value = hiddenInsetRight()
  modalMounted.value = true

  await nextTick()
  await raf()

  modalVisible.value = true
  await nextTick()
  await raf()

  modalInsetRight.value = MODAL_INSET_END
  modalRadiusLeft.value = 28
  modalElevation.value = 1
  await wait(PANEL_TRANSITION_MS)
  transitioning.value = false
}

async function closeModal() {
  if (transitioning.value || !modalMounted.value) {
    return
  }

  transitioning.value = true
  modalInsetRight.value = hiddenInsetRight()
  modalRadiusLeft.value = 0
  modalElevation.value = 0
  await wait(PANEL_TRANSITION_MS)

  modalVisible.value = false
  await wait(SCRIM_FADE_MS)
  modalMounted.value = false
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

:global(.surface-side-sheet__sheet h3) {
    margin-block: 0 8px;
    margin-inline: 0;
    font: 700 17px/1.3 'Trebuchet MS', 'Segoe UI', sans-serif;
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
