<template>
    <div
        class="surface-card-page"
        :data-card-expanded="expanded ? 'true' : 'false'"
        data-testid="surface-card-page-root"
    >
        <M3SurfacePanel
            class="surface-card-page__topbar"
            :fill-height="false"
            :height="72"
            variant="surface-container"
            :elevation="0"
        >
            <div class="surface-card-page__topbar-content">
                <div>
                    <strong>Surface orchestration: card replacing page</strong>
                    <p>The same surface morphs between compact card and page-like container.</p>
                </div>

                <M3Button
                    appearance="filled"
                    :disabled="busy"
                    data-testid="surface-card-toggle"
                    @click="toggleCardMode"
                >
                    {{ expanded ? 'Return to card state' : 'Expand card to page state' }}
                </M3Button>
            </div>
        </M3SurfacePanel>

        <M3Navigation
            v-model:expanded="navExpanded"
            class="surface-card-page__nav"
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
                label="Files"
                :active="activeNavTab === 'files'"
                @navigate="activeNavTab = 'files'; navExpanded = false"
            >
                <M3Icon name="folder" />
            </M3NavigationTab>

            <M3NavigationTab
                label="Timeline"
                :active="activeNavTab === 'timeline'"
                @navigate="activeNavTab = 'timeline'; navExpanded = false"
            >
                <M3Icon name="schedule" />
            </M3NavigationTab>

            <M3NavigationTab
                label="Tasks"
                :active="activeNavTab === 'tasks'"
                @navigate="activeNavTab = 'tasks'; navExpanded = false"
            >
                <M3Icon name="check_circle" />
            </M3NavigationTab>

            <M3NavigationTab
                label="Analytics"
                :active="activeNavTab === 'analytics'"
                @navigate="activeNavTab = 'analytics'; navExpanded = false"
            >
                <M3Icon name="insights" />
            </M3NavigationTab>
        </M3Navigation>

        <div class="surface-card-page__body">
            <div class="surface-card-page__workspace">
                <M3SurfacePanel
                    class="surface-card-page__header-card"
                    :fill-height="false"
                    :height="120"
                    :rounding="20"
                    variant="surface-container-lowest"
                    :elevation="0"
                >
                    <h3>Card-to-page transition playground</h3>
                    <p>Original slot remains reserved while the morphing surface overlays the page area.</p>
                </M3SurfacePanel>

                <div
                    ref="canvas"
                    class="surface-card-page__canvas"
                    data-testid="surface-card-canvas"
                >
                    <div
                        v-if="!backgroundCollapsed"
                        class="surface-card-page__grid"
                        data-testid="surface-card-grid"
                    >
                        <div
                            ref="originSlot"
                            class="surface-card-page__origin-slot"
                            :class="{ 'surface-card-page__origin-slot_filled': !overlayActive }"
                            :style="overlayActive ? { minHeight: `${originHeight}px` } : undefined"
                            data-testid="surface-card-origin"
                        >
                            <div
                                v-if="!overlayActive"
                                class="surface-card-page__overlay-wrap surface-card-page__overlay-wrap_inline"
                                :style="compactWrapStyle"
                                data-testid="surface-card-overlay-wrap"
                            >
                                <M3SurfacePanel
                                    :class="[
                                        'surface-card-page__morph-surface',
                                        expanded
                                            ? 'surface-card-page__morph-surface_expanded'
                                            : 'surface-card-page__morph-surface_compact',
                                    ]"
                                    :fill-width="true"
                                    :fill-height="overlayActive"
                                    :rounding="expanded ? 0 : 24"
                                    :transition-ms="TRANSITION_MS"
                                    :transition-timing="TRANSITION_EASING"
                                    :variant="expanded ? 'surface' : 'surface-container-low'"
                                    :elevation="expanded ? 0 : 1"
                                    overflow="auto"
                                    data-testid="surface-card-morph"
                                >
                                    <h3>Morph target surface</h3>
                                    <p>
                                        In compact mode this surface behaves like a card. In expanded mode it replaces the
                                        page work area while keeping top bar and rail reserved.
                                    </p>

                                    <M3SurfacePanel
                                        class="surface-card-page__morph-nested"
                                        :fill-height="false"
                                        :height="120"
                                        :rounding="14"
                                        :variant="expanded ? 'surface-container-low' : 'surface-container-high'"
                                        :elevation="expanded ? 1 : 3"
                                    >
                                        Nested surface demonstrates composability in both states.
                                    </M3SurfacePanel>
                                </M3SurfacePanel>
                            </div>
                        </div>

                        <M3SurfacePanel
                            class="surface-card-page__grid-card"
                            :fill-height="false"
                            :height="184"
                            :rounding="16"
                            variant="surface-container-low"
                            :elevation="1"
                        >
                            <strong>Static card A</strong>
                            <p>Background content remains in flow.</p>
                        </M3SurfacePanel>

                        <M3SurfacePanel
                            class="surface-card-page__grid-card"
                            :fill-height="false"
                            :height="184"
                            :rounding="16"
                            variant="surface-container"
                            :elevation="2"
                        >
                            <strong>Static card B</strong>
                            <p>Independent surface in the same scene.</p>
                        </M3SurfacePanel>
                    </div>

                    <div
                        v-if="overlayActive"
                        class="surface-card-page__overlay"
                    >
                        <div
                            class="surface-card-page__overlay-wrap"
                            :style="overlayStyle"
                            data-testid="surface-card-overlay-wrap"
                        >
                            <M3SurfacePanel
                                :class="[
                                    'surface-card-page__morph-surface',
                                    expanded
                                        ? 'surface-card-page__morph-surface_expanded'
                                        : 'surface-card-page__morph-surface_compact',
                                ]"
                                :fill-width="true"
                                :fill-height="overlayActive"
                                :rounding="expanded ? 0 : 24"
                                :transition-ms="TRANSITION_MS"
                                :transition-timing="TRANSITION_EASING"
                                :variant="expanded ? 'surface' : 'surface-container-low'"
                                :elevation="expanded ? 0 : 1"
                                overflow="auto"
                                data-testid="surface-card-morph"
                            >
                                <h3>Morph target surface</h3>
                                <p>
                                    In compact mode this surface behaves like a card. In expanded mode it replaces the
                                    page work area while keeping top bar and rail reserved.
                                </p>

                                <M3SurfacePanel
                                    class="surface-card-page__morph-nested"
                                    :fill-height="false"
                                    :height="120"
                                    :rounding="14"
                                    :variant="expanded ? 'surface-container-low' : 'surface-container-high'"
                                    :elevation="expanded ? 1 : 3"
                                >
                                    Nested surface demonstrates composability in both states.
                                </M3SurfacePanel>
                            </M3SurfacePanel>
                        </div>
                    </div>
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
  M3SurfacePanel,
} from '@/components/surface'
import { useSurfaceCardPageMorph } from '@/components/surface/orchestration/useSurfaceCardPageMorph'

import {
  m3MotionDurations,
  m3MotionEasings,
} from '@modulify/m3-foundation/lib/motion'
import {
  computed,
  ref,
} from 'vue'

const navExpanded = ref(false)
const activeNavTab = ref<'files' | 'timeline' | 'tasks' | 'analytics'>('files')
const TRANSITION_MS = m3MotionDurations.medium3
const TRANSITION_EASING = m3MotionEasings.standard

const {
  expanded,
  busy,
  backgroundCollapsed,
  originHeight,
  overlayStyle,
  canvas,
  originSlot,
  toggleCardMode,
} = useSurfaceCardPageMorph(TRANSITION_MS)
const overlayActive = computed(() => busy.value || expanded.value)
const compactWrapStyle = computed(() => ({
  width: '100%',
}))
</script>

<style lang="scss" scoped>
@use '@modulify/m3-foundation/assets/stylesheets/basics/motion' as m3-motion;

.surface-card-page {
    --surface-scene-bg-0: var(--m3-sys-surface, var(--md-sys-color-surface, #fef7ff));
    --surface-scene-bg-1: var(--m3-sys-surface-container-low, var(--md-sys-color-surface-container-low, #f7f2fa));
    --surface-accent-a: rgba(103, 80, 164, 0.14);
    --surface-accent-b: rgba(96, 125, 139, 0.16);
    --surface-border: var(--m3-sys-outline-variant, rgba(73, 69, 79, 0.2));
    --surface-shadow: var(--m3-elevation-1, 0 2px 6px rgba(0, 0, 0, 0.14));
    --surface-canvas-bg: var(--m3-sys-surface-container-low, var(--m3-sys-surface, #fef7ff));
    --surface-origin-slot: color-mix(in srgb, var(--m3-sys-primary, #6750a4) 12%, transparent);
    min-height: 100vh;
    background:
        radial-gradient(circle at 14% 4%, var(--surface-accent-a), transparent 38%),
        radial-gradient(circle at 90% 8%, var(--surface-accent-b), transparent 38%),
        linear-gradient(180deg, var(--surface-scene-bg-0) 0%, var(--surface-scene-bg-1) 100%);
    color: var(--m3-sys-on-surface, var(--md-sys-color-on-surface, #1d1b20));
}

:global(html.m3-theme-dark) .surface-card-page {
    --surface-accent-a: rgba(208, 188, 255, 0.18);
    --surface-accent-b: rgba(128, 203, 196, 0.16);
}

.surface-card-page__topbar-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.surface-card-page__topbar-content strong {
    display: block;
    font: 700 15px/1.3 'Trebuchet MS', 'Segoe UI', sans-serif;
}

.surface-card-page__topbar-content p {
    margin: 4px 0 0;
    font: 400 12px/1.35 'Trebuchet MS', 'Segoe UI', sans-serif;
    opacity: 0.8;
}

.surface-card-page__body {
    display: flex;
    height: calc(100vh - 72px);
    padding-left: var(--m3-navigation-rail-width, 80px);
}

@media (min-width: 1200px) {
    .surface-card-page__body {
        padding-left: var(--m3-navigation-drawer-width, 360px);
    }
}

:global(.surface-card-page__nav.m3-navigation) {
    top: 72px;
    height: calc(100vh - 72px);
}

.surface-card-page__workspace {
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.surface-card-page__topbar {
    padding: 16px;
}

.surface-card-page__header-card {
    padding: 18px;
}

.surface-card-page__header-card h3 {
    margin: 0 0 8px;
    font: 700 17px/1.3 'Trebuchet MS', 'Segoe UI', sans-serif;
}

.surface-card-page__header-card p {
    margin: 0;
    font: 400 12px/1.35 'Trebuchet MS', 'Segoe UI', sans-serif;
}

.surface-card-page__canvas {
    flex: 1 1 auto;
    position: relative;
    min-height: 0;
    border-radius: 20px;
    overflow: hidden;
    background: var(--surface-canvas-bg);
    box-shadow: 0 14px 28px var(--surface-shadow);
}

.surface-card-page__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    padding: 14px;
}

.surface-card-page__grid > .surface-card-page__grid-card {
    padding: 16px;
}

.surface-card-page__grid p {
    margin: 6px 0 0;
    font: 400 12px/1.35 'Trebuchet MS', 'Segoe UI', sans-serif;
}

.surface-card-page__origin-slot {
    border-radius: 24px;
    border: 1px dashed var(--surface-border);
    background: var(--surface-origin-slot);
}

.surface-card-page__origin-slot_filled {
    border-color: transparent;
    background: transparent;
}

.surface-card-page__overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.surface-card-page__overlay-wrap {
    position: absolute;
    transition:
        top #{m3-motion.duration('medium3')} #{m3-motion.easing('standard')},
        left #{m3-motion.duration('medium3')} #{m3-motion.easing('standard')},
        width #{m3-motion.duration('medium3')} #{m3-motion.easing('standard')},
        height #{m3-motion.duration('medium3')} #{m3-motion.easing('standard')};
}

.surface-card-page__overlay-wrap_inline {
    position: relative;
    transition: none;
}

.surface-card-page__overlay-wrap_inline > .surface-card-page__morph-surface {
    box-sizing: border-box;
}

.surface-card-page__morph-surface {
    pointer-events: auto;
}

.surface-card-page__morph-surface_compact {
    padding: 20px;
}

.surface-card-page__morph-surface_expanded {
    padding: 28px;
}

.surface-card-page__morph-nested {
    padding: 14px;
}

.surface-card-page__morph-surface h3 {
    margin: 0 0 8px;
    font: 700 18px/1.3 'Trebuchet MS', 'Segoe UI', sans-serif;
}

.surface-card-page__morph-surface p {
    margin: 0 0 12px;
    font: 400 13px/1.4 'Trebuchet MS', 'Segoe UI', sans-serif;
    max-width: 70ch;
}
</style>
