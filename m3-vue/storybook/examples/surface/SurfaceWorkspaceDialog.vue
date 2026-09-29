<template>
    <div class="surface-workspace-dialog">
        <M3SurfacePanel
            :fill-height="false"
            :height="84"
            :rounding="24"
            :elevation="0"
            class="surface-workspace-dialog__topbar"
            variant="surface-container"
        >
            <div class="surface-workspace-dialog__topbar-content">
                <div>
                    <strong>{{ text.heading }}</strong><p>{{ text.description }}</p>
                </div>

                <M3Button @click="opened = true">
                    {{ text.archiveProject }}
                </M3Button>
            </div>
        </M3SurfacePanel>

        <div class="surface-workspace-dialog__summary">
            <M3SurfacePanel
                :rounding="20"
                :elevation="0"
                class="surface-workspace-dialog__panel"
                variant="surface-container-lowest"
            >
                <h3>{{ text.overview }}</h3><p>{{ text.overviewText }}</p>
            </M3SurfacePanel>

            <M3SurfacePanel
                :rounding="20"
                :elevation="1"
                class="surface-workspace-dialog__panel"
                variant="surface-container-low"
            >
                <h3>{{ text.activity }}</h3><p>{{ text.tasks }}</p>
            </M3SurfacePanel>
        </div>

        <div class="surface-workspace-dialog__grid">
            <M3SurfacePanel
                v-for="label in text.cards"
                :key="label"
                :fill-height="false"
                :height="180"
                :rounding="18"
                :elevation="1"
                class="surface-workspace-dialog__panel"
                variant="surface-container-low"
            >
                <h3>{{ label }}</h3>
                <p>{{ text.cardText }}</p>
            </M3SurfacePanel>
        </div>

        <M3Surface
            :shown="opened"
            :fill-width="false"
            :fill-height="false"
            :width="520"
            :inset-top="24"
            :inset-bottom="24"
            :rounding="28"
            :elevation="3"
            mode="modal"
            anchor="center"
            class="surface-workspace-dialog__dialog"
            variant="surface-container-high"
            @update:shown="opened = $event"
            @dismiss="opened = false"
        >
            <h3>{{ text.decision }}</h3><p>{{ text.decisionText }}</p>

            <M3SurfacePanel
                :fill-height="false"
                :height="92"
                :rounding="18"
                :elevation="0"
                class="surface-workspace-dialog__notice"
                variant="surface-container"
            >
                {{ text.retention }}
            </M3SurfacePanel>

            <div class="surface-workspace-dialog__actions">
                <M3Button appearance="text" @click="opened = false">
                    {{ text.cancel }}
                </M3Button>

                <M3Button appearance="filled" @click="opened = false">
                    {{ text.archive }}
                </M3Button>
            </div>
        </M3Surface>
    </div>
</template>

<script lang="ts" setup>
import type { StorybookLocale } from '../../i18n'

import { ref } from 'vue'

import { M3Button } from '@/components/button'
import { M3Surface, M3SurfacePanel } from '@/components/surface'

import { localize } from '../../i18n'

const props = defineProps<{ locale: StorybookLocale }>()
const text = localize(props.locale, {
  'en-US': { activity: 'Activity', archive: 'Archive', archiveProject: 'Archive project', cancel: 'Cancel', cards: ['Roadmap', 'Assets', 'Owners'], cardText: 'Supporting surface inside the same workspace scene.', decision: 'Archive this workspace?', decisionText: 'Archiving hides the project from active planning views but keeps its history available for reporting.', description: 'A blocking decision interrupts the current workspace without replacing the layout beneath it.', heading: 'Scenario: workspace confirmation dialog', overview: 'Workspace overview', overviewText: 'Main content remains visible under the dialog, so the user keeps the surrounding context while confirming the action.', retention: 'Team members will retain read access until the workspace is restored.', tasks: '12 tasks updated today' },
  'ru-RU': { activity: 'Активность', archive: 'Архивировать', archiveProject: 'Архивировать проект', cancel: 'Отмена', cards: ['План', 'Материалы', 'Владельцы'], cardText: 'Вспомогательная поверхность в том же рабочем пространстве.', decision: 'Архивировать рабочее пространство?', decisionText: 'Архивация скроет проект из активного планирования, но сохранит историю для отчётов.', description: 'Блокирующее решение прерывает текущую работу, не заменяя расположенный ниже интерфейс.', heading: 'Сценарий: диалог подтверждения', overview: 'Обзор рабочего пространства', overviewText: 'Основное содержимое остаётся видимым под диалогом, сохраняя контекст во время подтверждения.', retention: 'Участники сохранят доступ на чтение до восстановления рабочего пространства.', tasks: 'Сегодня обновлено 12 задач' },
})

const opened = ref(false)
</script>

<style scoped>
.surface-workspace-dialog {
    min-height: 100vh;
    padding: 24px;
    box-sizing: border-box;
    color: var(--m3-sys-on-surface);
    background: linear-gradient(180deg, var(--m3-sys-surface) 0%, var(--m3-sys-surface-container-low) 100%);
}

.surface-workspace-dialog__topbar,
.surface-workspace-dialog__panel,
.surface-workspace-dialog__notice {
    padding: 18px;
}

.surface-workspace-dialog__topbar-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.surface-workspace-dialog__topbar-content strong {
    display: block;
    margin-bottom: 6px;
}

.surface-workspace-dialog__topbar-content p,
.surface-workspace-dialog__panel p,
.surface-workspace-dialog__dialog p {
    margin: 0;
    font-size: 13px;
    line-height: 1.45;
    opacity: 0.82;
}

.surface-workspace-dialog__summary {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 16px;
    margin-top: 16px;
}

.surface-workspace-dialog__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    margin-top: 16px;
}

.surface-workspace-dialog__panel h3,
.surface-workspace-dialog__dialog h3 {
    margin: 0 0 8px;
}

.surface-workspace-dialog__dialog {
    padding: 24px;
}

.surface-workspace-dialog__notice {
    margin-top: 16px;
}

.surface-workspace-dialog__actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 16px;
}
</style>
