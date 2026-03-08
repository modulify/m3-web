<template>
    <div class="surface-workspace-dialog">
        <M3SurfacePanel
            class="surface-workspace-dialog__topbar"
            :fill-height="false"
            :height="84"
            :rounding="24"
            variant="surface-container"
            :elevation="0"
        >
            <div class="surface-workspace-dialog__topbar-content">
                <div>
                    <strong>Scenario: workspace confirmation dialog</strong>
                    <p>A blocking decision interrupts the current workspace without replacing the layout beneath it.</p>
                </div>

                <M3Button @click="opened = true">
                    Archive project
                </M3Button>
            </div>
        </M3SurfacePanel>

        <div class="surface-workspace-dialog__summary">
            <M3SurfacePanel
                class="surface-workspace-dialog__panel"
                :rounding="20"
                variant="surface-container-lowest"
                :elevation="0"
            >
                <h3>Workspace overview</h3>
                <p>Main content remains visible under the dialog, so the user keeps the surrounding context while confirming the action.</p>
            </M3SurfacePanel>

            <M3SurfacePanel
                class="surface-workspace-dialog__panel"
                :rounding="20"
                variant="surface-container-low"
                :elevation="1"
            >
                <h3>Activity</h3>
                <p>12 tasks updated today</p>
            </M3SurfacePanel>
        </div>

        <div class="surface-workspace-dialog__grid">
            <M3SurfacePanel
                v-for="label in ['Roadmap', 'Assets', 'Owners']"
                :key="label"
                class="surface-workspace-dialog__panel"
                :fill-height="false"
                :height="180"
                :rounding="18"
                variant="surface-container-low"
                :elevation="1"
            >
                <h3>{{ label }}</h3>
                <p>Supporting surface inside the same workspace scene.</p>
            </M3SurfacePanel>
        </div>

        <M3Surface
            mode="modal"
            :shown="opened"
            anchor="center"
            :fill-width="false"
            :fill-height="false"
            :width="520"
            :inset-top="24"
            :inset-bottom="24"
            :rounding="28"
            :elevation="3"
            variant="surface-container-high"
            class="surface-workspace-dialog__dialog"
            @update:shown="opened = $event"
            @dismiss="opened = false"
        >
            <h3>Archive this workspace?</h3>
            <p>Archiving hides the project from active planning views but keeps its history available for reporting.</p>

            <M3SurfacePanel
                class="surface-workspace-dialog__notice"
                :fill-height="false"
                :height="92"
                :rounding="18"
                variant="surface-container"
                :elevation="0"
            >
                Team members will retain read access until the workspace is restored.
            </M3SurfacePanel>

            <div class="surface-workspace-dialog__actions">
                <M3Button appearance="text" @click="opened = false">
                    Cancel
                </M3Button>

                <M3Button appearance="filled" @click="opened = false">
                    Archive
                </M3Button>
            </div>
        </M3Surface>
    </div>
</template>

<script lang="ts" setup>
import { M3Button } from '@/components/button'
import { M3Surface, M3SurfacePanel } from '@/components/surface'

import { ref } from 'vue'

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
