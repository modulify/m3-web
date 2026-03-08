<template>
    <div class="surface-inspector-sheet">
        <M3SurfacePanel
            class="surface-inspector-sheet__topbar"
            :fill-height="false"
            :height="84"
            :rounding="24"
            variant="surface-container"
            :elevation="0"
        >
            <div class="surface-inspector-sheet__topbar-content">
                <div>
                    <strong>Scenario: inspector side sheet</strong>
                    <p>A supplemental editing surface appears from the edge while the main dashboard stays visible.</p>
                </div>

                <M3Button appearance="tonal" @click="opened = true">
                    Open inspector
                </M3Button>
            </div>
        </M3SurfacePanel>

        <div class="surface-inspector-sheet__grid">
            <M3SurfacePanel
                v-for="label in ['Launch plan', 'Dependencies', 'Approvals']"
                :key="label"
                class="surface-inspector-sheet__panel"
                :fill-height="false"
                :height="188"
                :rounding="18"
                variant="surface-container-low"
                :elevation="1"
            >
                <h3>{{ label }}</h3>
                <p>Dashboard content keeps its place while the inspector surface is layered above it.</p>
            </M3SurfacePanel>
        </div>

        <M3Surface
            mode="modal"
            :shown="opened"
            anchor="end"
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
            variant="surface-container-high"
            overflow="auto"
            class="surface-inspector-sheet__sheet"
            @update:shown="opened = $event"
            @dismiss="opened = false"
        >
            <h3>Release inspector</h3>
            <p>Use the side sheet for supporting edits that should not replace the dashboard context.</p>

            <div class="surface-inspector-sheet__form">
                <M3TextField
                    v-model:value="owner"
                    label="Owner email"
                    outlined
                />

                <M3Select
                    v-model:value="priority"
                    label="Priority"
                    :options="priorityOptions"
                    outlined
                />

                <M3TextField
                    v-model:value="notes"
                    label="Notes"
                    outlined
                    multiline
                />
            </div>

            <div class="surface-inspector-sheet__actions">
                <M3Button appearance="text" @click="opened = false">
                    Dismiss
                </M3Button>

                <M3Button appearance="filled" @click="opened = false">
                    Save changes
                </M3Button>
            </div>
        </M3Surface>
    </div>
</template>

<script lang="ts" setup>
import { M3Button } from '@/components/button'
import { M3Select } from '@/components/select'
import { M3Surface, M3SurfacePanel } from '@/components/surface'
import { M3TextField } from '@/components/text-field'

import { ref } from 'vue'

const opened = ref(false)
const owner = ref('owner@example.com')
const priority = ref<'low' | 'normal' | 'high' | null>('normal')
const notes = ref('Coordinate the release notes and schedule rollout approval.')

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
</script>

<style scoped>
.surface-inspector-sheet {
    min-height: 100vh;
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
    margin-bottom: 6px;
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
    margin-top: 16px;
}

.surface-inspector-sheet__panel h3,
.surface-inspector-sheet__sheet h3 {
    margin: 0 0 8px;
}

.surface-inspector-sheet__sheet {
    padding: 20px;
}

.surface-inspector-sheet__form {
    display: grid;
    gap: 12px;
    margin-top: 16px;
}

.surface-inspector-sheet__actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 16px;
}
</style>
