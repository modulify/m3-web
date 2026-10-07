<template>
    <div
        :data-top-level="`${topDialogLevel}`"
        class="surface-dialog-chain"
    >
        <M3Surface
            :fill-height="false"
            :height="72"
            :elevation="0"
            class="surface-dialog-chain__topbar"
            variant="surface-container"
        >
            <div class="surface-dialog-chain__topbar-content">
                <div>
                    <strong>{{ text.heading }}</strong><p>{{ text.summary }}</p>
                </div>

                <M3Button
                    :disabled="chainOpened"
                    data-testid="surface-dialog-chain-open-root"
                    appearance="filled"
                    @click="openDialog(0)"
                >
                    {{ chainOpened ? text.chainOpen : text.open }}
                </M3Button>
            </div>
        </M3Surface>

        <M3Navigation
            alignment="top"
            appearance="rail"
            class="surface-dialog-chain__nav"
        >
            <M3NavigationTab
                :active="activeNavTab === 'inbox'"
                :label="text.inbox"
                @navigate="activeNavTab = 'inbox'"
            >
                <M3Icon name="inbox" />
            </M3NavigationTab>

            <M3NavigationTab
                :active="activeNavTab === 'boards'"
                :label="text.boards"
                @navigate="activeNavTab = 'boards'"
            >
                <M3Icon name="dashboard" />
            </M3NavigationTab>

            <M3NavigationTab
                :active="activeNavTab === 'archive'"
                :label="text.archive"
                @navigate="activeNavTab = 'archive'"
            >
                <M3Icon name="archive" />
            </M3NavigationTab>

            <M3NavigationTab
                :active="activeNavTab === 'lab'"
                :label="text.lab"
                @navigate="activeNavTab = 'lab'"
            >
                <M3Icon name="science" />
            </M3NavigationTab>
        </M3Navigation>

        <div class="surface-dialog-chain__body">
            <div class="surface-dialog-chain__workspace">
                <M3Surface
                    :fill-height="false"
                    :height="124"
                    :rounding="20"
                    :elevation="0"
                    class="surface-dialog-chain__workspace-intro"
                    variant="surface-container-lowest"
                >
                    <h3>{{ text.workspace }}</h3><p>{{ text.workspaceDescription }}</p>
                </M3Surface>

                <M3Surface
                    :rounding="20"
                    :elevation="0"
                    class="surface-dialog-chain__canvas"
                    variant="surface-container-low"
                >
                    <h4>{{ text.background }}</h4><p>{{ text.backgroundDescription }}</p>
                </M3Surface>
            </div>
        </div>

        <template
            v-for="(dialog, level) in dialogChain"
            :key="dialog.id"
        >
            <M3Surface
                v-if="dialogMounted[level]"
                :data-testid="`surface-dialog-chain-level-${level + 1}`"
                :mode="dialogMode(level)"
                :shown="dialogMounted[level]"
                :transition-ms="DIALOG_TRANSITION_MS"
                :transition-timing="DIALOG_TRANSITION_EASING"
                :fill-width="false"
                :fill-height="false"
                :width="dialog.width"
                :inset-top="24"
                :inset-bottom="24"
                :rounding="dialog.rounding"
                :z-index="dialogZIndex(level)"
                :elevation="dialogElevation(level)"
                :style="dialogInlineStyle(level)"
                :class="[
                    'surface-dialog-chain__dialog',
                    `surface-dialog-chain__dialog_level-${level + 1}`,
                ]"
                anchor="center"
                overflow="visible"
                variant="surface-container-highest"
                @dismiss="closeFrom(level)"
            >
                <div class="surface-dialog-chain__dialog-head">
                    <h3>{{ text.dialog }} {{ level + 1 }} {{ text.of }} {{ dialogChain.length }}</h3>

                    <M3IconButton
                        :aria-label="`${text.closeDialog} ${level + 1}`"
                        appearance="standard"
                        @click="closeFrom(level)"
                    >
                        <M3Icon name="close" />
                    </M3IconButton>
                </div>

                <p>{{ text.descriptions[level] }}</p>

                <div class="surface-dialog-chain__dialog-actions">
                    <M3Button
                        :data-testid="`surface-dialog-chain-close-${level + 1}`"
                        appearance="text"
                        @click="closeFrom(level)"
                    >
                        {{ text.close }}
                    </M3Button>

                    <M3Button
                        v-if="hasNextDialog(level)"
                        :data-testid="`surface-dialog-chain-open-next-${level + 1}`"
                        :disabled="dialogMounted[level + 1]"
                        appearance="filled"
                        @click="openDialog(level + 1)"
                    >
                        {{ text.openDialog }} {{ level + 2 }}
                    </M3Button>
                </div>
            </M3Surface>
        </template>
    </div>
</template>

<script lang="ts" setup>
import type { StorybookLocale } from '../../i18n'

import { computed, nextTick } from 'vue'
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

const DIALOG_TRANSITION_MS = durations.medium2
const DIALOG_TRANSITION_EASING = easing.standard
const DIALOG_ENTRY_OFFSET_PX = 24
const DIALOG_Z_INDEX_BASE = 560
const DIALOG_Z_INDEX_STEP = 40

type DialogSpec = {
  id: string,
  width: number,
  rounding: number,
  description: string,
}

const dialogChain: DialogSpec[] = [{
  id: 'dialog-1',
  width: 720,
  rounding: 28,
  description: 'First layer in the chain. It opens dialog 2.',
}, {
  id: 'dialog-2',
  width: 620,
  rounding: 26,
  description: 'Second layer keeps the same controls and opens the next dialog.',
}, {
  id: 'dialog-3',
  width: 520,
  rounding: 24,
  description: 'Third layer opens the final nested dialog.',
}, {
  id: 'dialog-4',
  width: 440,
  rounding: 22,
  description: 'Final layer in this scenario: close only, no next dialog action.',
}]

const props = defineProps<{ locale: StorybookLocale }>()
const text = localize(props.locale, {
  'en-US': { archive: 'Archive', background: 'Background content', backgroundDescription: 'Open dialog 1 from top action, then continue through the chain.', boards: 'Boards', chainOpen: 'Dialog chain is open', close: 'Close', closeDialog: 'Close dialog', descriptions: dialogChain.map(dialog => dialog.description), dialog: 'Dialog', heading: 'Surface orchestration: nested dialogs chain', inbox: 'Inbox', lab: 'Lab', of: 'of', open: 'Open dialog chain', openDialog: 'Open dialog', summary: 'Rail layout opens a nested dialog chain with one active scrim on the topmost dialog.', workspace: 'Workspace', workspaceDescription: 'Page composition stays stable while dialogs are stacked progressively.' },
  'ru-RU': { archive: 'Архив', background: 'Фоновое содержимое', backgroundDescription: 'Откройте диалог 1 верхней кнопкой и последовательно продолжите цепочку.', boards: 'Доски', chainOpen: 'Цепочка диалогов открыта', close: 'Закрыть', closeDialog: 'Закрыть диалог', descriptions: ['Первый слой цепочки открывает диалог 2.', 'Второй слой сохраняет те же элементы управления и открывает следующий диалог.', 'Третий слой открывает последний вложенный диалог.', 'Последний слой сценария можно только закрыть.'], dialog: 'Диалог', heading: 'Управление поверхностью: цепочка вложенных диалогов', inbox: 'Входящие', lab: 'Лаборатория', of: 'из', open: 'Открыть цепочку диалогов', openDialog: 'Открыть диалог', summary: 'Компоновка с рейкой открывает цепочку вложенных диалогов; активный scrim принадлежит верхнему.', workspace: 'Рабочее пространство', workspaceDescription: 'Композиция страницы остаётся стабильной при последовательном наложении диалогов.' },
})

const activeNavTab = ref<'inbox' | 'boards' | 'archive' | 'lab'>('inbox')
const dialogMounted = ref<boolean[]>(Array.from({ length: dialogChain.length }, () => false))
const dialogVisible = ref<boolean[]>(Array.from({ length: dialogChain.length }, () => false))

const chainOpened = computed(() => dialogMounted.value.some(Boolean))

const topDialogLevel = computed(() => {
  for (let index = dialogChain.length - 1; index >= 0; index -= 1) {
    if (dialogMounted.value[index]) {
      return index
    }
  }

  return -1
})

function hasNextDialog(level: number) {
  return level < dialogChain.length - 1
}

function isTopDialog(level: number) {
  return topDialogLevel.value === level
}

function dialogMode(level: number): 'standard' | 'modal' {
  return isTopDialog(level) ? 'modal' : 'standard'
}

function dialogZIndex(level: number) {
  return DIALOG_Z_INDEX_BASE + (level * DIALOG_Z_INDEX_STEP)
}

function dialogElevation(level: number) {
  return Math.min(5, 2 + level)
}

function dialogInlineStyle(level: number) {
  const visible = dialogVisible.value[level]

  return {
    position: 'fixed',
    top: '50%',
    left: '50%',
    zIndex: dialogZIndex(level),
    opacity: visible ? 1 : 0,
    transform: visible
      ? 'translate(-50%, -50%)'
      : `translate(-50%, calc(-50% + ${DIALOG_ENTRY_OFFSET_PX}px))`,
    transition: `opacity ${DIALOG_TRANSITION_MS}ms ${DIALOG_TRANSITION_EASING}, transform ${DIALOG_TRANSITION_MS}ms ${DIALOG_TRANSITION_EASING}`,
    pointerEvents: visible ? 'auto' : 'none',
  }
}

async function openDialog(level: number) {
  if (level < 0 || level >= dialogChain.length || dialogMounted.value[level]) {
    return
  }

  if (level > 0 && !dialogMounted.value[level - 1]) {
    return
  }

  dialogMounted.value[level] = true
  dialogVisible.value[level] = false

  await nextTick()
  await raf()

  dialogVisible.value[level] = true
}

async function closeFrom(level: number) {
  if (level < 0 || level >= dialogChain.length) {
    return
  }

  let hasMountedDialog = false
  for (let index = level; index < dialogChain.length; index += 1) {
    if (dialogMounted.value[index]) {
      hasMountedDialog = true
      break
    }
  }

  if (!hasMountedDialog) {
    return
  }

  for (let index = dialogChain.length - 1; index >= level; index -= 1) {
    if (dialogMounted.value[index]) {
      dialogVisible.value[index] = false
    }
  }

  await wait(DIALOG_TRANSITION_MS)

  for (let index = level; index < dialogChain.length; index += 1) {
    dialogMounted.value[index] = false
    dialogVisible.value[index] = false
  }
}
</script>

<style scoped>
.surface-dialog-chain {
    --surface-scene-bg-0: var(--m3-sys-surface, var(--md-sys-color-surface, #fef7ff));
    --surface-scene-bg-1: var(--m3-sys-surface-container-low, var(--md-sys-color-surface-container-low, #f7f2fa));
    --surface-accent-a: color-mix(in srgb, var(--m3-sys-primary, var(--md-sys-color-primary, #6750a4)) 18%, transparent);
    --surface-accent-b: color-mix(in srgb, var(--m3-sys-secondary, var(--md-sys-color-secondary, #625b71)) 16%, transparent);
    --surface-layout-bg: var(--m3-sys-surface-container, var(--md-sys-color-surface-container, #f3edf7));
    min-block-size: 100vh;
    background:
        radial-gradient(circle at 8% 0%, var(--surface-accent-a), transparent 42%),
        radial-gradient(circle at 92% 0%, var(--surface-accent-b), transparent 44%),
        linear-gradient(180deg, var(--surface-scene-bg-0) 0%, var(--surface-scene-bg-1) 100%);
    color: var(--m3-sys-on-surface, var(--md-sys-color-on-surface, #1d1b20));
}

.surface-dialog-chain__topbar-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.surface-dialog-chain__topbar-content strong {
    display: block;
    font: 700 15px/1.3 'Trebuchet MS', 'Segoe UI', sans-serif;
}

.surface-dialog-chain__topbar-content p {
    margin-block: 4px 0;
    margin-inline: 0;
    font: 400 12px/1.35 'Trebuchet MS', 'Segoe UI', sans-serif;
    opacity: 0.82;
}

.surface-dialog-chain__body {
    display: flex;
    block-size: calc(100vh - 72px);
    padding-inline-start: var(--m3-navigation-rail-width, 80px);
}

:global(.surface-dialog-chain__nav.m3-navigation) {
    inset-block-start: 72px;
    block-size: calc(100vh - 72px);
}

.surface-dialog-chain__workspace {
    flex: 1 1 auto;
    min-inline-size: 0;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.surface-dialog-chain__topbar {
    padding: 16px;
}

.surface-dialog-chain__workspace-intro {
    padding: 20px;
}

.surface-dialog-chain__workspace h3,
.surface-dialog-chain__workspace h4 {
    margin-block: 0 8px;
    margin-inline: 0;
    font: 700 17px/1.3 'Trebuchet MS', 'Segoe UI', sans-serif;
}

.surface-dialog-chain__workspace p {
    margin: 0;
    font: 400 12px/1.35 'Trebuchet MS', 'Segoe UI', sans-serif;
}

.surface-dialog-chain__canvas {
    flex: 1 1 auto;
    min-block-size: 220px;
    padding: 18px;
    background: var(--surface-layout-bg);
}

:global(.surface-dialog-chain__dialog) {
    overflow: visible;
}

:global(.surface-dialog-chain__dialog_level-1) {
    padding: 24px;
}

:global(.surface-dialog-chain__dialog_level-2) {
    padding: 22px;
}

:global(.surface-dialog-chain__dialog_level-3) {
    padding: 20px;
}

:global(.surface-dialog-chain__dialog_level-4) {
    padding: 18px;
}

:global(.surface-dialog-chain__dialog-head) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

:global(.surface-dialog-chain__dialog-head h3) {
    margin: 0;
    font: 700 18px/1.3 'Trebuchet MS', 'Segoe UI', sans-serif;
}

:global(.surface-dialog-chain__dialog p) {
    margin-block: 8px 0;
    margin-inline: 0;
    font: 400 13px/1.4 'Trebuchet MS', 'Segoe UI', sans-serif;
}

:global(.surface-dialog-chain__dialog-actions) {
    margin-block-start: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
}
</style>
