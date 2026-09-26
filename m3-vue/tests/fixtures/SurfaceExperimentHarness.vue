<template>
    <div data-testid="surface-exp-root" class="surface-exp">
        <M3Surface
            :fill-height="false"
            :height="64"
            :elevation="2"
            data-testid="surface-topbar"
            class="surface-exp__topbar"
            variant="surface-container"
        >
            <div class="surface-exp__topbar-content">
                <strong>Surface Experiment</strong>
                <div class="surface-exp__controls">
                    <button
                        data-testid="sheet-to-modal"
                        type="button"
                        @click="morphSheetToModal"
                    >
                        Sheet: Docked -> Modal
                    </button>
                    <button
                        data-testid="card-to-page"
                        type="button"
                        @click="morphCardToPage"
                    >
                        Card -> Full Page
                    </button>
                </div>
            </div>
        </M3Surface>

        <div class="surface-exp__frame">
            <M3Surface
                :fill-width="false"
                :width="88"
                :elevation="1"
                data-testid="surface-nav-rail"
                class="surface-exp__rail"
                variant="surface-container-low"
            >
                <div class="surface-exp__rail-stack">
                    <span>Nav</span>
                    <span>Home</span>
                    <span>Docs</span>
                    <span>Lab</span>
                </div>
            </M3Surface>

            <div class="surface-exp__workspace">
                <section data-testid="scenario-side-sheet" class="surface-exp__scenario">
                    <header class="surface-exp__scenario-head">
                        <h2>Scenario A: Multi-surface + Docked Sheet -> Modal</h2>
                    </header>

                    <div class="sheet-layout">
                        <main data-testid="sheet-layout-content" class="sheet-layout__content">
                            <M3Surface
                                :fill-height="false"
                                :height="112"
                                :rounding="20"
                                :elevation="0"
                                data-testid="static-role-surface-container-lowest"
                                class="sheet-layout__card"
                                variant="surface-container-lowest"
                            >
                                <strong>Static block: surface-container-lowest</strong>
                                <p>Neutral content block anchored in page flow.</p>
                            </M3Surface>

                            <M3Surface
                                :fill-height="false"
                                :height="112"
                                :rounding="20"
                                :elevation="1"
                                data-testid="static-role-surface-container-low"
                                class="sheet-layout__card"
                                variant="surface-container-low"
                            >
                                <strong>Static block: surface-container-low</strong>
                                <p>Secondary panel with increased emphasis.</p>
                            </M3Surface>

                            <M3Surface
                                :fill-height="false"
                                :height="112"
                                :rounding="20"
                                :elevation="3"
                                data-testid="static-role-surface-container-high"
                                class="sheet-layout__card"
                                variant="surface-container-high"
                            >
                                <strong>Static block: surface-container-high</strong>
                                <p>Read-only section with stronger elevation.</p>
                            </M3Surface>

                            <M3Surface
                                :fill-height="false"
                                :height="112"
                                :rounding="20"
                                :elevation="0"
                                data-testid="static-role-surface-dim"
                                class="sheet-layout__card"
                                variant="surface-dim"
                            >
                                <strong>Static block: surface-dim</strong>
                                <p>Low-brightness background container.</p>
                            </M3Surface>
                        </main>

                        <div
                            v-if="!sheetIsModal"
                            :style="{ width: `${sheetDockedWidth}px` }"
                            data-testid="sheet-docked-host"
                            class="sheet-layout__docked-host"
                        >
                            <M3Surface
                                :fill-width="true"
                                :fill-height="true"
                                :rounding="0"
                                :elevation="1"
                                data-testid="orchestrated-side-sheet"
                                overflow="auto"
                                class="sheet-layout__sheet"
                                variant="surface-container-low"
                            >
                                <h3>Docked side sheet</h3>
                                <p>Initial state: coplanar with the main content.</p>
                                <p>It can coexist with interactions in page content.</p>
                            </M3Surface>
                        </div>

                        <M3Surface
                            v-else
                            :transition-ms="320"
                            :fill-width="false"
                            :fill-height="false"
                            :width="420"
                            :inset-top="72"
                            :inset-right="24"
                            :inset-bottom="24"
                            :rounding-top-left="28"
                            :rounding-bottom-left="28"
                            :rounding-top-right="0"
                            :rounding-bottom-right="0"
                            :z-index="520"
                            :elevation="4"
                            data-testid="orchestrated-side-sheet"
                            mode="modal"
                            anchor="end"
                            height="calc(100vh - 96px)"
                            overflow="auto"
                            class="sheet-layout__sheet sheet-layout__sheet_modal"
                            variant="surface-container-high"
                        >
                            <h3>Modal side sheet</h3>
                            <p>Layer switched from docked flow to modal surface stack.</p>
                            <p>Main content expands while sheet is detached to modal layer.</p>
                        </M3Surface>
                    </div>
                </section>

                <section data-testid="scenario-card-page" class="surface-exp__scenario">
                    <header class="surface-exp__scenario-head">
                        <h2>Scenario B: Card -> Full Page</h2>
                    </header>

                    <div
                        ref="cardCanvas"
                        data-testid="card-canvas"
                        class="card-morph-layout"
                    >
                        <div class="card-morph-layout__grid">
                            <div
                                ref="cardOrigin"
                                :style="{ minHeight: `${cardPlaceholderHeight}px` }"
                                data-testid="card-origin-slot"
                                class="card-morph-layout__origin"
                            />
                            <M3Surface
                                :fill-height="false"
                                :height="176"
                                :rounding="16"
                                :elevation="1"
                                data-testid="card-static-a"
                                class="card-morph-layout__card"
                                variant="surface-container-low"
                            >
                                <strong>Static card A</strong>
                                <p>Background card in feed.</p>
                            </M3Surface>
                            <M3Surface
                                :fill-height="false"
                                :height="176"
                                :rounding="16"
                                :elevation="2"
                                data-testid="card-static-b"
                                class="card-morph-layout__card"
                                variant="surface-container"
                            >
                                <strong>Static card B</strong>
                                <p>Background card in feed.</p>
                            </M3Surface>
                        </div>

                        <div data-testid="card-overlay-layer" class="card-morph-layout__overlay">
                            <div
                                :style="cardOverlayStyle"
                                data-testid="card-overlay-wrap"
                                class="card-morph-layout__overlay-wrap"
                            >
                                <M3Surface
                                    :transition-ms="320"
                                    :fill-width="true"
                                    :fill-height="true"
                                    :rounding="cardExpanded ? 0 : 24"
                                    :elevation="cardExpanded ? 0 : 1"
                                    :variant="cardExpanded ? 'surface' : 'surface-container-low'"
                                    :class="[
                                        'card-morph-layout__overlay-surface',
                                        cardExpanded
                                            ? 'card-morph-layout__overlay-surface_expanded'
                                            : 'card-morph-layout__overlay-surface_compact',
                                    ]"
                                    data-testid="orchestrated-card-surface"
                                    transition-timing="cubic-bezier(0.2, 0, 0, 1)"
                                    overflow="auto"
                                >
                                    <h3>Surface morph target</h3>
                                    <p>Initial card geometry transitions into a page-like container.</p>
                                    <p>Reserved zones are kept by top app bar and nav rail layout.</p>
                                </M3Surface>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
  computed,
  nextTick,
  onMounted,
  ref,
} from 'vue'

import M3Surface from '@/components/surface/M3Surface.vue'

const sheetIsModal = ref(false)
const sheetWidth = 360
const sheetDockedWidth = ref(sheetWidth)

const cardCanvas = ref<HTMLElement | null>(null)
const cardOrigin = ref<HTMLElement | null>(null)
const cardExpanded = ref(false)
const cardPlaceholderHeight = ref(220)
const cardMotion = ref({
  top: 16,
  left: 16,
  width: 320,
  height: 220,
})

const cardOverlayStyle = computed(() => ({
  top: `${cardMotion.value.top}px`,
  left: `${cardMotion.value.left}px`,
  width: `${cardMotion.value.width}px`,
  height: `${cardMotion.value.height}px`,
}))

function raf() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve())
  })
}

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}

function measureCardOrigin() {
  if (!cardCanvas.value || !cardOrigin.value) {
    return null
  }

  const canvasRect = cardCanvas.value.getBoundingClientRect()
  const originRect = cardOrigin.value.getBoundingClientRect()

  return {
    top: originRect.top - canvasRect.top,
    left: originRect.left - canvasRect.left,
    width: originRect.width,
    height: originRect.height,
  }
}

function measureCardExpanded() {
  if (!cardCanvas.value) {
    return null
  }

  const canvasRect = cardCanvas.value.getBoundingClientRect()

  return {
    top: 12,
    left: 12,
    width: Math.max(320, canvasRect.width - 24),
    height: Math.max(220, canvasRect.height - 24),
  }
}

async function initCardGeometry() {
  await nextTick()
  await raf()
  const origin = measureCardOrigin()
  if (!origin) {
    return
  }

  cardMotion.value = origin
  cardPlaceholderHeight.value = origin.height
}

async function morphSheetToModal() {
  if (sheetIsModal.value) {
    return
  }

  sheetDockedWidth.value = sheetWidth
  await nextTick()
  await raf()
  sheetDockedWidth.value = 0
  await delay(440)
  sheetIsModal.value = true
}

async function morphCardToPage() {
  if (cardExpanded.value) {
    return
  }

  const origin = measureCardOrigin()
  if (origin) {
    cardMotion.value = origin
    cardPlaceholderHeight.value = origin.height
  }

  cardExpanded.value = true
  await nextTick()
  await raf()

  const expanded = measureCardExpanded()
  if (!expanded) {
    return
  }

  cardMotion.value = expanded
}

onMounted(() => {
  initCardGeometry()
})
</script>

<style scoped>
.surface-exp {
  min-height: 100vh;
  background: linear-gradient(135deg, #f7f2fa 0%, #efe8f7 100%);
  color: #1d1b20;
}

.surface-exp__topbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.surface-exp__topbar {
  padding: 16px;
}

.surface-exp__controls {
  display: flex;
  gap: 8px;
}

.surface-exp__controls button {
  border: 1px solid rgba(73, 69, 79, 0.3);
  border-radius: 10px;
  background: #fff;
  color: #1d1b20;
  font: 600 12px/1.1 Arial, sans-serif;
  padding: 8px 10px;
  cursor: pointer;
}

.surface-exp__frame {
  display: flex;
  min-height: calc(100vh - 64px);
}

.surface-exp__rail {
  flex: 0 0 auto;
  padding: 12px;
}

.surface-exp__rail-stack {
  display: grid;
  gap: 8px;
  align-content: start;
  font: 600 13px/1.2 Arial, sans-serif;
}

.surface-exp__workspace {
  flex: 1 1 auto;
  min-width: 0;
  padding: 20px;
  display: grid;
  gap: 18px;
}

.surface-exp__scenario {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  border: 1px solid rgba(73, 69, 79, 0.16);
  padding: 16px;
}

.surface-exp__scenario-head {
  margin-bottom: 12px;
}

.surface-exp__scenario-head h2 {
  margin: 0;
  font: 700 14px/1.3 Arial, sans-serif;
}

.sheet-layout {
  min-height: 360px;
  display: flex;
  gap: 0;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(73, 69, 79, 0.2);
  background: rgba(249, 245, 253, 0.9);
}

.sheet-layout__content {
  flex: 1 1 auto;
  min-width: 0;
  padding: 14px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  align-content: start;
}

.sheet-layout__content > .sheet-layout__card {
  padding: 18px;
}

.sheet-layout__content p,
.card-morph-layout p {
  margin: 6px 0 0;
  font: 400 12px/1.35 Arial, sans-serif;
}

.sheet-layout__docked-host {
  flex: 0 0 auto;
  width: 360px;
  min-width: 0;
  overflow: hidden;
  transition: width 420ms cubic-bezier(0.2, 0, 0, 1);
  border-left: 1px solid rgba(73, 69, 79, 0.2);
}

:global(.sheet-layout__sheet) {
  padding: 20px;
}

:global(.sheet-layout__sheet_modal) {
  padding: 24px;
}

.card-morph-layout {
  position: relative;
  min-height: 420px;
  border-radius: 16px;
  border: 1px solid rgba(73, 69, 79, 0.2);
  background: rgba(249, 245, 253, 0.9);
  overflow: hidden;
}

.card-morph-layout__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding: 14px;
}

.card-morph-layout__grid > .card-morph-layout__card {
  padding: 16px;
}

.card-morph-layout__origin {
  border-radius: 24px;
  border: 1px dashed rgba(73, 69, 79, 0.24);
  background: rgba(208, 188, 255, 0.15);
}

.card-morph-layout__overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.card-morph-layout__overlay-wrap {
  position: absolute;
  transition:
    top 320ms cubic-bezier(0.2, 0, 0, 1),
    left 320ms cubic-bezier(0.2, 0, 0, 1),
    width 320ms cubic-bezier(0.2, 0, 0, 1),
    height 320ms cubic-bezier(0.2, 0, 0, 1);
}

.card-morph-layout__overlay-wrap :deep(.m3-surface) {
  pointer-events: auto;
}

.card-morph-layout__overlay-surface_compact {
  padding: 20px;
}

.card-morph-layout__overlay-surface_expanded {
  padding: 28px;
}
</style>
