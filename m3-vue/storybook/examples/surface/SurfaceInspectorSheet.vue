<template>
    <div class="surface-inspector-sheet">
        <M3SurfacePanel
            :fill-height="false"
            :height="84"
            :rounding="24"
            :elevation="0"
            class="surface-inspector-sheet__topbar"
            variant="surface-container"
        >
            <div class="surface-inspector-sheet__topbar-content">
                <div>
                    <strong>{{ text.heading }}</strong>
                    <p>{{ text.description }}</p>
                </div>

                <M3Button appearance="tonal" @click="opened = true">
                    {{ text.open }}
                </M3Button>
            </div>
        </M3SurfacePanel>

        <div class="surface-inspector-sheet__grid">
            <M3SurfacePanel
                v-for="label in text.cards"
                :key="label"
                :fill-height="false"
                :height="188"
                :rounding="18"
                :elevation="1"
                class="surface-inspector-sheet__panel"
                variant="surface-container-low"
            >
                <h3>{{ label }}</h3>
                <p>{{ text.cardDescription }}</p>
            </M3SurfacePanel>
        </div>

        <M3Surface
            :shown="opened"
            :fill-width="false"
            :width="360"
            :inset-top="0"
            :inset-right="0"
            :inset-bottom="0"
            :rounding-top-left="28"
            :rounding-bottom-left="28"
            :rounding-top-right="0"
            :rounding-bottom-right="0"
            :elevation="2"
            mode="modal"
            anchor="end"
            overflow="auto"
            class="m3-side-sheet surface-inspector-sheet__sheet"
            variant="surface-container-high"
            @update:shown="opened = $event"
            @dismiss="opened = false"
        >
            <header class="m3-side-sheet__header">
                <div class="m3-side-sheet__title">
                    {{ text.title }}
                </div>

                <div class="m3-side-sheet__affordance">
                    <M3IconButton appearance="standard" @click="opened = false">
                        <M3Icon name="close" />
                    </M3IconButton>
                </div>
            </header>

            <div class="m3-side-sheet__content">
                <div class="surface-inspector-sheet__form">
                    <p>{{ text.sheetDescription }}</p>

                    <M3TextField
                        v-model:value="owner"
                        :label="text.owner"
                        outlined
                    />

                    <M3Select
                        v-model:value="priority"
                        :options="priorityOptions"
                        :label="text.priority"
                        outlined
                    />

                    <M3TextField
                        v-model:value="notes"
                        :label="text.notes"
                        outlined
                        multiline
                    />
                </div>
            </div>

            <footer class="m3-side-sheet__footer surface-inspector-sheet__actions">
                <M3Button appearance="text" @click="opened = false">
                    {{ text.dismiss }}
                </M3Button>

                <M3Button appearance="filled" @click="opened = false">
                    {{ text.save }}
                </M3Button>
            </footer>
        </M3Surface>
    </div>
</template>

<script lang="ts" setup>
import type { StorybookLocale } from '../../i18n'

import { ref } from 'vue'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'
import { M3Select } from '@/components/select'
import { M3Surface, M3SurfacePanel } from '@/components/surface'
import { M3TextField } from '@/components/text-field'

import { localize } from '../../i18n'

const props = defineProps<{ locale: StorybookLocale }>()
const text = localize(props.locale, {
  'en-US': { cards: ['Launch plan', 'Dependencies', 'Approvals'], cardDescription: 'Dashboard content keeps its place while the inspector surface is layered above it.', description: 'A supplemental editing surface appears from the edge while the main dashboard stays visible.', dismiss: 'Dismiss', heading: 'Scenario: inspector side sheet', notes: 'Notes', notesValue: 'Coordinate the release notes and schedule rollout approval.', open: 'Open inspector', owner: 'Owner email', priority: 'Priority', priorities: ['Low', 'Normal', 'High'], save: 'Save changes', sheetDescription: 'Use the side sheet for supporting edits that should not replace the dashboard context.', title: 'Release inspector' },
  'ru-RU': { cards: ['План запуска', 'Зависимости', 'Согласования'], cardDescription: 'Содержимое дашборда остаётся на месте, пока панель инспектора располагается поверх него.', description: 'Вспомогательная панель редактирования появляется с края, а основной дашборд остаётся видимым.', dismiss: 'Закрыть', heading: 'Сценарий: боковая панель инспектора', notes: 'Заметки', notesValue: 'Согласовать заметки к выпуску и запланировать подтверждение запуска.', open: 'Открыть инспектор', owner: 'Почта владельца', priority: 'Приоритет', priorities: ['Низкий', 'Обычный', 'Высокий'], save: 'Сохранить изменения', sheetDescription: 'Используйте боковую панель для вспомогательных правок, которые не должны заменять контекст дашборда.', title: 'Инспектор выпуска' },
})
const priorityOptions = [
  { label: text.priorities[0], value: 'low' }, { label: text.priorities[1], value: 'normal' }, { label: text.priorities[2], value: 'high' },
]

const owner = ref('owner@example.com')
const priority = ref<'low' | 'normal' | 'high' | null>('normal')
const notes = ref(text.notesValue)
const opened = ref(false)
</script>

<style scoped>
.surface-inspector-sheet {
    min-block-size: 100vh;
    padding: 24px;
    box-sizing: border-box;
    color: var(--m3-sys-on-surface);
    background: linear-gradient(180deg, var(--m3-sys-surface) 0%, var(--m3-sys-surface-container-low) 100%);
}

.surface-inspector-sheet__topbar,
.surface-inspector-sheet__panel {
    padding: 18px;
}

.surface-inspector-sheet__topbar-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.surface-inspector-sheet__topbar-content strong {
    display: block;
    margin-block-end: 6px;
}

.surface-inspector-sheet__topbar-content p,
.surface-inspector-sheet__panel p,
.surface-inspector-sheet__sheet p {
    margin: 0;
    font-size: 13px;
    line-height: 1.45;
    opacity: 0.82;
}

.surface-inspector-sheet__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    margin-block-start: 16px;
}

.surface-inspector-sheet__panel h3,
.surface-inspector-sheet__sheet h3 {
    margin-block: 0 8px;
    margin-inline: 0;
}

.surface-inspector-sheet__form {
    display: grid;
    gap: 12px;
    inline-size: 100%;
    padding-block: 0 24px;
    padding-inline: 24px;
}

.surface-inspector-sheet__actions {
    justify-content: flex-end;
}
</style>
