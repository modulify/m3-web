<template>
    <div
        class="surface-side-sheet"
        :data-sheet-modal="sideSheetModal ? 'true' : 'false'"
        data-testid="surface-morph-root"
    >
        <M3SurfacePanel
            class="surface-side-sheet__topbar"
            :fill-height="false"
            :height="72"
            variant="surface-container"
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
        </M3SurfacePanel>

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
                <M3SurfacePanel
                    class="surface-side-sheet__header-card"
                    :fill-height="false"
                    :height="120"
                    :rounding="20"
                    variant="surface-container-lowest"
                    :elevation="0"
                >
                    <h3>Workspace surfaces</h3>
                    <p>Static blocks keep flow while side-sheet changes modality.</p>
                </M3SurfacePanel>

                <div
                    ref="layoutRoot"
                    class="surface-side-sheet__layout"
                    data-testid="surface-morph-layout"
                >
                    <main
                        class="surface-side-sheet__content-grid"
                        data-testid="surface-morph-content-grid"
                    >
                        <M3SurfacePanel
                            class="surface-side-sheet__grid-surface"
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
                            class="surface-side-sheet__grid-surface"
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
                            class="surface-side-sheet__grid-surface"
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
                            class="surface-side-sheet__grid-surface"
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

                    <div
                        ref="dockedHost"
                        class="surface-side-sheet__docked-host"
                        :style="dockedHostStyle"
                        data-testid="surface-morph-docked-host"
                    >
                        <M3SurfacePanel
                            v-if="dockedPanelShown"
                            class="surface-side-sheet__sheet surface-side-sheet__sheet_docked"
                            :fill-width="true"
                            :fill-height="true"
                            overflow="auto"
                            variant="surface-container-low"
                            :elevation="0"
                            :style="dockedPanelStyle"
                            data-testid="surface-morph-sheet"
                            data-panel-mode="docked"
                        >
                            <h3>Docked side sheet</h3>
                            <p>Coplanar layout participant with adaptive CSS width inside the layout host.</p>
                            <p>Main content remains interactive.</p>
                            <p class="surface-side-sheet__meta">
                                Adaptive width: {{ sideSheetWidth }}px
                            </p>
                        </M3SurfacePanel>
                    </div>

                    <M3Surface
                        v-if="modalShown"
                        class="surface-side-sheet__sheet surface-side-sheet__sheet_modal"
                        mode="modal"
                        v-bind="modalPanelProps"
                        :transition-timing="PANEL_TRANSITION_EASING"
                        data-testid="surface-morph-sheet"
                        data-panel-mode="modal"
                        @dismiss="closeModalFromPanel"
                    >
                        <template v-if="sideSheetModal">
                            <div class="surface-side-sheet__modal-header">
                                <h3>Modal side sheet</h3>

                                <M3IconButton
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
                            <p>Stable modal state stays in overlay, while docked state remains layout-driven.</p>
                            <p class="surface-side-sheet__meta">
                                Measured transition width: {{ modalPanelProps.width }}px
                            </p>
                        </template>
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
import {
  M3Surface,
  M3SurfacePanel,
} from '@/components/surface'
import { useSurfaceSideSheetMorph } from '@/components/surface/orchestration/useSurfaceSideSheetMorph'

import { m3MotionEasings } from '@modulify/m3-foundation/lib/motion'
import { ref } from 'vue'

const PANEL_TRANSITION_EASING = m3MotionEasings.standard

const navExpanded = ref(false)
const activeNavTab = ref<'inbox' | 'boards' | 'archive' | 'lab'>('inbox')
const {
  sideSheetModal,
  sideSheetWidth,
  modalShown,
  dockedPanelShown,
  transitioning,
  dockedHost,
  layoutRoot,
  dockedHostStyle,
  dockedPanelStyle,
  modalPanelProps,
  toggleSideSheetMode,
  closeModalFromPanel,
} = useSurfaceSideSheetMorph()
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
    display: flex;
    overflow: hidden;
    border-left: 1px solid var(--surface-border);
    transition: width var(--surface-panel-transition-ms) var(--surface-panel-transition-easing);
}

.surface-side-sheet__sheet_docked {
    flex: 1 1 auto;
    min-width: 0;
}

.surface-side-sheet__sheet h3,
:global(.surface-side-sheet__sheet h3) {
    margin: 0 0 8px;
    font: 700 17px/1.3 'Trebuchet MS', 'Segoe UI', sans-serif;
}

.surface-side-sheet__sheet,
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

.surface-side-sheet__sheet p,
:global(.surface-side-sheet__sheet p) {
    margin: 0 0 8px;
    font: 400 13px/1.4 'Trebuchet MS', 'Segoe UI', sans-serif;
}

.surface-side-sheet__sheet .surface-side-sheet__meta,
:global(.surface-side-sheet__sheet .surface-side-sheet__meta) {
    margin-top: 14px;
    font: 600 11px/1.2 'Trebuchet MS', 'Segoe UI', sans-serif;
    letter-spacing: 0.04em;
    opacity: 0.76;
    text-transform: uppercase;
}
</style>
