<template>
    <div class="m3-local-theme-showcase">
        <div class="sb-container-fluid px-6 py-6">
            <div class="m3-local-theme-showcase__intro mb-6">
                <div class="m3-local-theme-showcase__eyebrow">
                    Pattern
                </div>
                <h1 class="m3-local-theme-showcase__headline">
                    Local token scopes
                </h1>
                <p class="m3-local-theme-showcase__copy">
                    Local theming works by attaching a wrapper class that overrides a subset of the Material sys-tokens for descendants only.
                </p>
            </div>

            <div v-if="variant === 'danger'" class="sb-row sb-g-5">
                <div v-for="card in dangerCards" :key="card.eyebrow" class="sb-col-12 sb-col-lg-6 d-flex">
                    <M3SurfacePanel
                        :class="['m3-local-theme-showcase__card', 'h-100', card.scopeClassName]"
                        :fill-height="false"
                        :rounding="28"
                        variant="surface-container-high"
                        :elevation="1"
                    >
                        <div class="m3-local-theme-showcase__eyebrow">
                            {{ card.eyebrow }}
                        </div>
                        <h3 class="m3-local-theme-showcase__title">
                            {{ card.title }}
                        </h3>
                        <p class="m3-local-theme-showcase__copy">
                            {{ card.copy }}
                        </p>

                        <div class="m3-local-theme-showcase__swatches">
                            <div class="m3-local-theme-showcase__swatch">
                                <span class="m3-local-theme-showcase__swatch-chip m3-local-theme-showcase__swatch-chip_surface" />
                                <span>Surface</span>
                            </div>

                            <div class="m3-local-theme-showcase__swatch">
                                <span class="m3-local-theme-showcase__swatch-chip m3-local-theme-showcase__swatch-chip_container" />
                                <span>Container</span>
                            </div>

                            <div class="m3-local-theme-showcase__swatch">
                                <span class="m3-local-theme-showcase__swatch-chip m3-local-theme-showcase__swatch-chip_accent" />
                                <span>Accent</span>
                            </div>
                        </div>

                        <div class="m3-local-theme-showcase__actions">
                            <span v-if="card.tertiaryAction && card.tertiaryScopeClassName" :class="card.tertiaryScopeClassName">
                                <M3Button appearance="text">
                                    {{ card.tertiaryAction }}
                                </M3Button>
                            </span>

                            <M3Button v-else-if="card.tertiaryAction" appearance="text">
                                {{ card.tertiaryAction }}
                            </M3Button>

                            <M3Button v-if="card.secondaryAction" appearance="tonal">
                                {{ card.secondaryAction }}
                            </M3Button>

                            <M3Button appearance="filled">
                                {{ card.primaryAction }}
                            </M3Button>
                        </div>
                    </M3SurfacePanel>
                </div>
            </div>

            <div v-if="variant === 'danger'" class="sb-row sb-g-5 mt-5">
                <div v-for="card in dangerResetCards" :key="card.eyebrow" class="sb-col-12 sb-col-lg-6 d-flex">
                    <M3SurfacePanel
                        :class="['m3-local-theme-showcase__card', 'h-100', card.scopeClassName]"
                        :fill-height="false"
                        :rounding="28"
                        variant="surface-container-high"
                        :elevation="1"
                    >
                        <div class="m3-local-theme-showcase__eyebrow">
                            {{ card.eyebrow }}
                        </div>
                        <h3 class="m3-local-theme-showcase__title">
                            {{ card.title }}
                        </h3>
                        <p class="m3-local-theme-showcase__copy">
                            {{ card.copy }}
                        </p>

                        <div class="m3-local-theme-showcase__swatches">
                            <div class="m3-local-theme-showcase__swatch">
                                <span class="m3-local-theme-showcase__swatch-chip m3-local-theme-showcase__swatch-chip_surface" />
                                <span>Surface</span>
                            </div>

                            <div class="m3-local-theme-showcase__swatch">
                                <span class="m3-local-theme-showcase__swatch-chip m3-local-theme-showcase__swatch-chip_container" />
                                <span>Container</span>
                            </div>

                            <div class="m3-local-theme-showcase__swatch">
                                <span class="m3-local-theme-showcase__swatch-chip m3-local-theme-showcase__swatch-chip_accent" />
                                <span>Accent</span>
                            </div>
                        </div>

                        <div class="m3-local-theme-showcase__actions">
                            <span v-if="card.tertiaryAction && card.tertiaryScopeClassName" :class="card.tertiaryScopeClassName">
                                <M3Button appearance="text">
                                    {{ card.tertiaryAction }}
                                </M3Button>
                            </span>

                            <M3Button v-else-if="card.tertiaryAction" appearance="text">
                                {{ card.tertiaryAction }}
                            </M3Button>

                            <M3Button v-if="card.secondaryAction" appearance="tonal">
                                {{ card.secondaryAction }}
                            </M3Button>

                            <M3Button appearance="filled">
                                {{ card.primaryAction }}
                            </M3Button>
                        </div>
                    </M3SurfacePanel>
                </div>
            </div>

            <div v-else-if="variant === 'warm-alert'" class="sb-row sb-g-5">
                <div v-for="card in warmCards" :key="card.eyebrow" class="sb-col-12 sb-col-lg-6 d-flex">
                    <M3SurfacePanel
                        :class="['m3-local-theme-showcase__card', 'h-100', card.scopeClassName]"
                        :fill-height="false"
                        :rounding="28"
                        variant="surface-container-high"
                        :elevation="1"
                    >
                        <div class="m3-local-theme-showcase__eyebrow">
                            {{ card.eyebrow }}
                        </div>
                        <h3 class="m3-local-theme-showcase__title">
                            {{ card.title }}
                        </h3>
                        <p class="m3-local-theme-showcase__copy">
                            {{ card.copy }}
                        </p>

                        <div class="m3-local-theme-showcase__swatches">
                            <div class="m3-local-theme-showcase__swatch">
                                <span class="m3-local-theme-showcase__swatch-chip m3-local-theme-showcase__swatch-chip_surface" />
                                <span>Surface</span>
                            </div>

                            <div class="m3-local-theme-showcase__swatch">
                                <span class="m3-local-theme-showcase__swatch-chip m3-local-theme-showcase__swatch-chip_container" />
                                <span>Container</span>
                            </div>

                            <div class="m3-local-theme-showcase__swatch">
                                <span class="m3-local-theme-showcase__swatch-chip m3-local-theme-showcase__swatch-chip_accent" />
                                <span>Accent</span>
                            </div>
                        </div>

                        <div class="m3-local-theme-showcase__actions">
                            <span v-if="card.tertiaryAction && card.tertiaryScopeClassName" :class="card.tertiaryScopeClassName">
                                <M3Button appearance="text">
                                    {{ card.tertiaryAction }}
                                </M3Button>
                            </span>

                            <M3Button v-else-if="card.tertiaryAction" appearance="text">
                                {{ card.tertiaryAction }}
                            </M3Button>

                            <M3Button v-if="card.secondaryAction" appearance="tonal">
                                {{ card.secondaryAction }}
                            </M3Button>

                            <M3Button appearance="filled">
                                {{ card.primaryAction }}
                            </M3Button>
                        </div>
                    </M3SurfacePanel>
                </div>
            </div>

            <div v-else-if="variant === 'success'" class="sb-row sb-g-5">
                <div v-for="card in successCards" :key="card.eyebrow" class="sb-col-12 sb-col-lg-6 d-flex">
                    <M3SurfacePanel
                        :class="['m3-local-theme-showcase__card', 'h-100', card.scopeClassName]"
                        :fill-height="false"
                        :rounding="28"
                        variant="surface-container-high"
                        :elevation="1"
                    >
                        <div class="m3-local-theme-showcase__eyebrow">
                            {{ card.eyebrow }}
                        </div>
                        <h3 class="m3-local-theme-showcase__title">
                            {{ card.title }}
                        </h3>
                        <p class="m3-local-theme-showcase__copy">
                            {{ card.copy }}
                        </p>

                        <div class="m3-local-theme-showcase__swatches">
                            <div class="m3-local-theme-showcase__swatch">
                                <span class="m3-local-theme-showcase__swatch-chip m3-local-theme-showcase__swatch-chip_surface" />
                                <span>Surface</span>
                            </div>

                            <div class="m3-local-theme-showcase__swatch">
                                <span class="m3-local-theme-showcase__swatch-chip m3-local-theme-showcase__swatch-chip_container" />
                                <span>Container</span>
                            </div>

                            <div class="m3-local-theme-showcase__swatch">
                                <span class="m3-local-theme-showcase__swatch-chip m3-local-theme-showcase__swatch-chip_accent" />
                                <span>Accent</span>
                            </div>
                        </div>

                        <div class="m3-local-theme-showcase__actions">
                            <span v-if="card.tertiaryAction && card.tertiaryScopeClassName" :class="card.tertiaryScopeClassName">
                                <M3Button appearance="text">
                                    {{ card.tertiaryAction }}
                                </M3Button>
                            </span>

                            <M3Button v-else-if="card.tertiaryAction" appearance="text">
                                {{ card.tertiaryAction }}
                            </M3Button>

                            <M3Button v-if="card.secondaryAction" appearance="tonal">
                                {{ card.secondaryAction }}
                            </M3Button>

                            <M3Button appearance="filled">
                                {{ card.primaryAction }}
                            </M3Button>
                        </div>
                    </M3SurfacePanel>
                </div>
            </div>

            <div v-else-if="variant === 'brand-muted'" class="sb-row sb-g-5">
                <div v-for="card in brandMutedCards" :key="card.eyebrow" class="sb-col-12 sb-col-lg-6 d-flex">
                    <M3SurfacePanel
                        :class="['m3-local-theme-showcase__card', 'h-100', card.scopeClassName]"
                        :fill-height="false"
                        :rounding="28"
                        variant="surface-container-high"
                        :elevation="1"
                    >
                        <div class="m3-local-theme-showcase__eyebrow">
                            {{ card.eyebrow }}
                        </div>
                        <h3 class="m3-local-theme-showcase__title">
                            {{ card.title }}
                        </h3>
                        <p class="m3-local-theme-showcase__copy">
                            {{ card.copy }}
                        </p>

                        <div class="m3-local-theme-showcase__swatches">
                            <div class="m3-local-theme-showcase__swatch">
                                <span class="m3-local-theme-showcase__swatch-chip m3-local-theme-showcase__swatch-chip_surface" />
                                <span>Surface</span>
                            </div>

                            <div class="m3-local-theme-showcase__swatch">
                                <span class="m3-local-theme-showcase__swatch-chip m3-local-theme-showcase__swatch-chip_container" />
                                <span>Container</span>
                            </div>

                            <div class="m3-local-theme-showcase__swatch">
                                <span class="m3-local-theme-showcase__swatch-chip m3-local-theme-showcase__swatch-chip_accent" />
                                <span>Accent</span>
                            </div>
                        </div>

                        <div class="m3-local-theme-showcase__actions">
                            <span v-if="card.tertiaryAction && card.tertiaryScopeClassName" :class="card.tertiaryScopeClassName">
                                <M3Button appearance="text">
                                    {{ card.tertiaryAction }}
                                </M3Button>
                            </span>

                            <M3Button v-else-if="card.tertiaryAction" appearance="text">
                                {{ card.tertiaryAction }}
                            </M3Button>

                            <M3Button v-if="card.secondaryAction" appearance="tonal">
                                {{ card.secondaryAction }}
                            </M3Button>

                            <M3Button appearance="filled">
                                {{ card.primaryAction }}
                            </M3Button>
                        </div>
                    </M3SurfacePanel>
                </div>
            </div>

            <M3SurfacePanel
                v-else
                class="m3-local-theme-showcase__workspace"
                :fill-height="false"
                :rounding="32"
                variant="surface-container-low"
                :elevation="0"
            >
                <div class="m3-local-theme-showcase__workspace-header">
                    <div>
                        <div class="m3-local-theme-showcase__eyebrow">
                            Nested local scopes
                        </div>
                        <h2 class="m3-local-theme-showcase__workspace-title">
                            One page, multiple local accents
                        </h2>
                        <p class="m3-local-theme-showcase__copy">
                            The surrounding workspace stays on the global theme while specific modules opt into local token overrides.
                        </p>
                    </div>

                    <M3Button appearance="outlined">
                        Publish overview
                    </M3Button>
                </div>

                <div class="sb-row sb-g-5">
                    <div v-for="card in nestedCards" :key="card.eyebrow" class="sb-col-12 sb-col-lg-6 d-flex">
                        <M3SurfacePanel
                            :class="['m3-local-theme-showcase__card', 'h-100', card.scopeClassName]"
                            :fill-height="false"
                            :rounding="28"
                            variant="surface-container-high"
                            :elevation="1"
                        >
                            <div class="m3-local-theme-showcase__eyebrow">
                                {{ card.eyebrow }}
                            </div>
                            <h3 class="m3-local-theme-showcase__title">
                                {{ card.title }}
                            </h3>
                            <p class="m3-local-theme-showcase__copy">
                                {{ card.copy }}
                            </p>

                            <div class="m3-local-theme-showcase__swatches">
                                <div class="m3-local-theme-showcase__swatch">
                                    <span class="m3-local-theme-showcase__swatch-chip m3-local-theme-showcase__swatch-chip_surface" />
                                    <span>Surface</span>
                                </div>

                                <div class="m3-local-theme-showcase__swatch">
                                    <span class="m3-local-theme-showcase__swatch-chip m3-local-theme-showcase__swatch-chip_container" />
                                    <span>Container</span>
                                </div>

                                <div class="m3-local-theme-showcase__swatch">
                                    <span class="m3-local-theme-showcase__swatch-chip m3-local-theme-showcase__swatch-chip_accent" />
                                    <span>Accent</span>
                                </div>
                            </div>

                            <div class="m3-local-theme-showcase__actions">
                                <span v-if="card.tertiaryAction && card.tertiaryScopeClassName" :class="card.tertiaryScopeClassName">
                                    <M3Button appearance="text">
                                        {{ card.tertiaryAction }}
                                    </M3Button>
                                </span>

                                <M3Button v-else-if="card.tertiaryAction" appearance="text">
                                    {{ card.tertiaryAction }}
                                </M3Button>

                                <M3Button v-if="card.secondaryAction" appearance="tonal">
                                    {{ card.secondaryAction }}
                                </M3Button>

                                <M3Button appearance="filled">
                                    {{ card.primaryAction }}
                                </M3Button>
                            </div>
                        </M3SurfacePanel>
                    </div>
                </div>
            </M3SurfacePanel>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { M3Button } from '@/components/button'
import { M3SurfacePanel } from '@/components/surface'

const props = defineProps<{
  variant: 'danger' | 'warm-alert' | 'success' | 'brand-muted' | 'nested'
}>()

defineOptions({
  name: 'LocalThemeShowcase',
})

type ThemeCardProps = {
  eyebrow: string
  title: string
  copy: string
  scopeClassName?: string
  primaryAction: string
  secondaryAction?: string
  tertiaryAction?: string
  tertiaryScopeClassName?: string
}

const dangerCards: ThemeCardProps[] = [{
  eyebrow: 'Default scope',
  title: 'Default destructive action',
  copy: 'Without a local theme, the same controls stay on the global primary palette and neutral surface tokens.',
  primaryAction: 'Delete release',
  secondaryAction: 'Review logs',
  tertiaryAction: 'Cancel',
}, {
  eyebrow: 'Danger scope',
  title: 'Locally themed destructive action',
  copy: 'A single wrapper class re-targets the same button and surface tokens to a red destructive palette with a warmer supporting surface.',
  scopeClassName: 'm3-local-theme m3-local-theme--danger',
  primaryAction: 'Delete release',
  secondaryAction: 'Review logs',
  tertiaryAction: 'Cancel',
}]

const warmCards: ThemeCardProps[] = [{
  eyebrow: 'Default scope',
  title: 'Billing reminder card',
  copy: 'The neutral version uses the baseline surface hierarchy from the active global theme.',
  primaryAction: 'Resolve hold',
  secondaryAction: 'View invoices',
  tertiaryAction: 'Dismiss',
}, {
  eyebrow: 'Warm alert scope',
  title: 'Billing reminder card',
  copy: 'The local alert class shifts the panel into a warmer family and retargets tonal and filled buttons without affecting the surrounding page.',
  scopeClassName: 'm3-local-theme m3-local-theme--warm-alert',
  primaryAction: 'Resolve hold',
  secondaryAction: 'View invoices',
  tertiaryAction: 'Dismiss',
}]

const dangerResetCards: ThemeCardProps[] = [{
  eyebrow: 'Danger scope + reset action',
  title: 'Locally themed destructive action',
  copy: 'Nested reset scope restores the baseline global theme inside a danger module, so a single supporting action can fall back to the default button language.',
  scopeClassName: 'm3-local-theme m3-local-theme--danger',
  primaryAction: 'Delete release',
  secondaryAction: 'Review logs',
  tertiaryAction: 'Cancel',
  tertiaryScopeClassName: 'm3-local-theme m3-local-theme--reset',
}]

const successCards: ThemeCardProps[] = [{
  eyebrow: 'Default scope',
  title: 'Post-release success state',
  copy: 'The neutral version keeps the message on the global theme and does not distinguish celebratory follow-up actions.',
  primaryAction: 'Share update',
  secondaryAction: 'Review rollout',
  tertiaryAction: 'Close',
}, {
  eyebrow: 'Success scope',
  title: 'Post-release success state',
  copy: 'The success class shifts the local module toward a green palette while keeping the same component API and surface hierarchy.',
  scopeClassName: 'm3-local-theme m3-local-theme--success',
  primaryAction: 'Share update',
  secondaryAction: 'Review rollout',
  tertiaryAction: 'Close',
}]

const brandMutedCards: ThemeCardProps[] = [{
  eyebrow: 'Default scope',
  title: 'Brand guidance callout',
  copy: 'By default, the card inherits the main theme accent and reads as just another primary action area.',
  primaryAction: 'Open guidelines',
  secondaryAction: 'Download assets',
  tertiaryAction: 'Later',
}, {
  eyebrow: 'Brand-muted scope',
  title: 'Brand guidance callout',
  copy: 'The muted brand class keeps a product-colored accent, but softens both controls and surfaces for secondary editorial emphasis.',
  scopeClassName: 'm3-local-theme m3-local-theme--brand-muted',
  primaryAction: 'Open guidelines',
  secondaryAction: 'Download assets',
  tertiaryAction: 'Later',
}]

const nestedCards: ThemeCardProps[] = [{
  eyebrow: 'Warm alert scope',
  title: 'Escalated billing hold',
  copy: 'This card uses warmer surface tokens to feel urgent without collapsing into an all-red panel.',
  scopeClassName: 'm3-local-theme m3-local-theme--warm-alert',
  primaryAction: 'Resolve hold',
  secondaryAction: 'Notify finance',
}, {
  eyebrow: 'Danger scope',
  title: 'Delete workspace access',
  copy: 'A narrower local scope can still switch buttons, supporting copy, and surface tones for destructive actions.',
  scopeClassName: 'm3-local-theme m3-local-theme--danger',
  primaryAction: 'Remove access',
  secondaryAction: 'Review members',
  tertiaryAction: 'Cancel',
}]

void props.variant
</script>

<style>
.m3-local-theme-showcase {
    min-height: 100vh;
    box-sizing: border-box;
    background:
        radial-gradient(circle at top left, color-mix(in srgb, var(--m3-sys-primary) 10%, transparent), transparent 32%),
        linear-gradient(180deg, var(--m3-sys-surface) 0%, var(--m3-sys-surface-container-low) 100%);
    color: var(--m3-sys-on-surface);
}

.m3-local-theme-showcase__intro {
    max-width: 720px;
}

.m3-local-theme-showcase__workspace {
    padding: 24px;
}

.m3-local-theme-showcase__workspace > * + * {
    margin-top: 24px;
}

.m3-local-theme-showcase__workspace-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 16px;
}

.m3-local-theme-showcase__workspace-header > :first-child {
    min-width: 0;
}

.m3-local-theme-showcase__workspace-header > :first-child > * + * {
    margin-top: 8px;
}

.m3-local-theme-showcase__headline,
.m3-local-theme-showcase__workspace-title,
.m3-local-theme-showcase__title {
    margin: 0;
}

.m3-local-theme-showcase__headline {
    margin: 20px 0 8px;
    font-size: 32px;
    line-height: 40px;
    font-weight: 400;
}

.m3-local-theme-showcase__workspace-title {
    font-size: 24px;
    line-height: 32px;
    font-weight: 400;
}

.m3-local-theme-showcase__title {
    font-size: 22px;
    line-height: 28px;
    font-weight: 400;
}

.m3-local-theme-showcase__eyebrow {
    width: fit-content;
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-weight: 500;
    background: var(--m3-sys-primary-container);
    color: var(--m3-sys-on-primary-container);
}

.m3-local-theme-showcase__copy {
    margin: 0;
    max-width: 58ch;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.5px;
    color: var(--m3-sys-on-surface-variant);
}

.m3-local-theme-showcase__card {
    min-height: 320px;
    width: 100%;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
}

.m3-local-theme-showcase__card > * + * {
    margin-top: 16px;
}

.m3-local-theme.m3-local-theme-showcase__card {
    outline: 1px solid color-mix(in srgb, var(--m3-sys-primary) 32%, transparent);
    outline-offset: -1px;
}

.m3-local-theme-showcase__swatches {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.m3-local-theme-showcase__swatch {
    min-width: 88px;
    border-radius: 16px;
    padding: 10px 12px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--m3-sys-surface-container-low);
    color: var(--m3-sys-on-surface-variant);
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.5px;
}

.m3-local-theme-showcase__swatch-chip {
    width: 12px;
    height: 12px;
    border-radius: 999px;
    flex: 0 0 auto;
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--m3-sys-on-surface) 12%, transparent);
}

.m3-local-theme-showcase__swatch-chip_surface {
    background: var(--m3-sys-surface-container);
}

.m3-local-theme-showcase__swatch-chip_container {
    background: var(--m3-sys-secondary-container);
}

.m3-local-theme-showcase__swatch-chip_accent {
    background: var(--m3-sys-primary);
}

.m3-local-theme-showcase__actions {
    margin-top: auto;
    padding-top: 24px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
    row-gap: 8px;
    gap: 12px;
}

.m3-local-theme {
    --m3-sys-primary: var(--m3-local-primary);
    --m3-sys-primary-container: var(--m3-local-primary-container);
    --m3-sys-on-primary: var(--m3-local-on-primary);
    --m3-sys-on-primary-container: var(--m3-local-on-primary-container);
    --m3-sys-secondary-container: var(--m3-local-secondary-container);
    --m3-sys-on-secondary-container: var(--m3-local-on-secondary-container);
    --m3-sys-surface: var(--m3-local-surface);
    --m3-sys-surface-container-low: var(--m3-local-surface-low);
    --m3-sys-surface-container: var(--m3-local-surface);
    --m3-sys-surface-container-high: var(--m3-local-surface-high);
    --m3-sys-surface-container-highest: var(--m3-local-surface-highest);
    --m3-sys-on-surface: var(--m3-local-on-surface);
    --m3-sys-on-surface-variant: var(--m3-local-on-surface-variant);
    --m3-sys-outline: var(--m3-local-outline);
    --m3-sys-outline-variant: var(--m3-local-outline-variant);
    --m3-state-layers-on-surface-opacity-008: color-mix(in srgb, var(--m3-local-on-surface) 8%, transparent);
    --m3-state-layers-on-surface-opacity-012: color-mix(in srgb, var(--m3-local-on-surface) 12%, transparent);
    --m3-state-layers-on-surface-opacity-020: color-mix(in srgb, var(--m3-local-on-surface) 20%, transparent);
    --m3-state-layers-on-secondary-container-opacity-008: color-mix(in srgb, var(--m3-local-on-secondary-container) 8%, transparent);
    --m3-state-layers-on-secondary-container-opacity-012: color-mix(in srgb, var(--m3-local-on-secondary-container) 12%, transparent);
    --m3-state-layers-on-secondary-container-opacity-020: color-mix(in srgb, var(--m3-local-on-secondary-container) 20%, transparent);
    color: var(--m3-sys-on-surface);
}

html.m3-theme-light .m3-local-theme--reset {
    --m3-local-primary: #6750a4;
    --m3-local-primary-container: #e9ddff;
    --m3-local-on-primary: #ffffff;
    --m3-local-on-primary-container: #22005d;
    --m3-local-secondary-container: #e8def8;
    --m3-local-on-secondary-container: #1e192b;
    --m3-local-surface: #fdf8fd;
    --m3-local-surface-low: #fef7ff;
    --m3-local-surface-high: #ece6f0;
    --m3-local-surface-highest: #e6e0e9;
    --m3-local-on-surface: #1d1b20;
    --m3-local-on-surface-variant: #49454f;
    --m3-local-outline: #79747e;
    --m3-local-outline-variant: #cac4d0;
}

html.m3-theme-dark .m3-local-theme--reset {
    --m3-local-primary: #cfbcff;
    --m3-local-primary-container: #4f378a;
    --m3-local-on-primary: #381e72;
    --m3-local-on-primary-container: #e9ddff;
    --m3-local-secondary-container: #4a4458;
    --m3-local-on-secondary-container: #e8def8;
    --m3-local-surface: #141218;
    --m3-local-surface-low: #1d1b20;
    --m3-local-surface-high: #2b2930;
    --m3-local-surface-highest: #36343b;
    --m3-local-on-surface: #e6e0e9;
    --m3-local-on-surface-variant: #cac4d0;
    --m3-local-outline: #938f99;
    --m3-local-outline-variant: #49454f;
}

html.m3-theme-light .m3-local-theme--danger {
    --m3-local-primary: #b42346;
    --m3-local-primary-container: #ffd9e2;
    --m3-local-on-primary: #ffffff;
    --m3-local-on-primary-container: #400011;
    --m3-local-secondary-container: #f7dce4;
    --m3-local-on-secondary-container: #5b1024;
    --m3-local-surface: #fdf0f4;
    --m3-local-surface-low: #fff8fa;
    --m3-local-surface-high: #f8dfe7;
    --m3-local-surface-highest: #efc9d4;
    --m3-local-on-surface: #34111a;
    --m3-local-on-surface-variant: #71414e;
    --m3-local-outline: #a37883;
    --m3-local-outline-variant: #dfb8c2;
}

html.m3-theme-dark .m3-local-theme--danger {
    --m3-local-primary: #ff9db8;
    --m3-local-primary-container: #7e263f;
    --m3-local-on-primary: #491323;
    --m3-local-on-primary-container: #ffdbe3;
    --m3-local-secondary-container: #653745;
    --m3-local-on-secondary-container: #f7dbe3;
    --m3-local-surface: #312129;
    --m3-local-surface-low: #2a1b22;
    --m3-local-surface-high: #38252d;
    --m3-local-surface-highest: #46303a;
    --m3-local-on-surface: #f2dfe4;
    --m3-local-on-surface-variant: #d6c2c8;
    --m3-local-outline: #ae8c97;
    --m3-local-outline-variant: #62424d;
}

html.m3-theme-light .m3-local-theme--warm-alert {
    --m3-local-primary: #8a4f00;
    --m3-local-primary-container: #ffddb8;
    --m3-local-on-primary: #ffffff;
    --m3-local-on-primary-container: #2c1600;
    --m3-local-secondary-container: #f3dfcf;
    --m3-local-on-secondary-container: #37281b;
    --m3-local-surface: #fef1e5;
    --m3-local-surface-low: #fff8f1;
    --m3-local-surface-high: #f8e1cc;
    --m3-local-surface-highest: #efd0b2;
    --m3-local-on-surface: #2f1b0d;
    --m3-local-on-surface-variant: #6c5647;
    --m3-local-outline: #9a7e69;
    --m3-local-outline-variant: #dbc1ab;
}

html.m3-theme-dark .m3-local-theme--warm-alert {
    --m3-local-primary: #f1be79;
    --m3-local-primary-container: #6d4d1e;
    --m3-local-on-primary: #3f2806;
    --m3-local-on-primary-container: #ffe1c2;
    --m3-local-secondary-container: #5e4835;
    --m3-local-on-secondary-container: #f3e0d1;
    --m3-local-surface: #31261d;
    --m3-local-surface-low: #2a2018;
    --m3-local-surface-high: #382b22;
    --m3-local-surface-highest: #46362a;
    --m3-local-on-surface: #efe0d2;
    --m3-local-on-surface-variant: #d3c3b5;
    --m3-local-outline: #ac9177;
    --m3-local-outline-variant: #5f4937;
}

html.m3-theme-light .m3-local-theme--success {
    --m3-local-primary: #146c2e;
    --m3-local-primary-container: #c2efc8;
    --m3-local-on-primary: #ffffff;
    --m3-local-on-primary-container: #00210c;
    --m3-local-secondary-container: #d6ead5;
    --m3-local-on-secondary-container: #183723;
    --m3-local-surface: #eef8ee;
    --m3-local-surface-low: #f7fdf6;
    --m3-local-surface-high: #dcefdc;
    --m3-local-surface-highest: #c6dfc7;
    --m3-local-on-surface: #132017;
    --m3-local-on-surface-variant: #3f5343;
    --m3-local-outline: #6f8873;
    --m3-local-outline-variant: #bed4c0;
}

html.m3-theme-dark .m3-local-theme--success {
    --m3-local-primary: #9ad7ac;
    --m3-local-primary-container: #245b37;
    --m3-local-on-primary: #112f1c;
    --m3-local-on-primary-container: #d3f0d8;
    --m3-local-secondary-container: #334d3d;
    --m3-local-on-secondary-container: #dce9de;
    --m3-local-surface: #202924;
    --m3-local-surface-low: #1a231e;
    --m3-local-surface-high: #27312c;
    --m3-local-surface-highest: #313d37;
    --m3-local-on-surface: #dce7de;
    --m3-local-on-surface-variant: #c0cbc2;
    --m3-local-outline: #90a592;
    --m3-local-outline-variant: #45594a;
}

html.m3-theme-light .m3-local-theme--brand-muted {
    --m3-local-primary: #615b8f;
    --m3-local-primary-container: #e7e0ff;
    --m3-local-on-primary: #ffffff;
    --m3-local-on-primary-container: #1d1738;
    --m3-local-secondary-container: #e1ddf1;
    --m3-local-on-secondary-container: #302c45;
    --m3-local-surface: #f3f1fa;
    --m3-local-surface-low: #fbf8ff;
    --m3-local-surface-high: #e5e1f1;
    --m3-local-surface-highest: #d7d2e4;
    --m3-local-on-surface: #1d1b28;
    --m3-local-on-surface-variant: #555266;
    --m3-local-outline: #868098;
    --m3-local-outline-variant: #d1ccdf;
}

html.m3-theme-dark .m3-local-theme--brand-muted {
    --m3-local-primary: #b7c8e8;
    --m3-local-primary-container: #44526c;
    --m3-local-on-primary: #25324b;
    --m3-local-on-primary-container: #e4e9f6;
    --m3-local-secondary-container: #3b4558;
    --m3-local-on-secondary-container: #e0e4ee;
    --m3-local-surface: #232837;
    --m3-local-surface-low: #1d2230;
    --m3-local-surface-high: #2a3040;
    --m3-local-surface-highest: #343c4d;
    --m3-local-on-surface: #e2e6ef;
    --m3-local-on-surface-variant: #c6cdd9;
    --m3-local-outline: #909eb8;
    --m3-local-outline-variant: #485162;
}

@media (max-width: 720px) {
    .m3-local-theme-showcase__workspace-header {
        flex-direction: column;
    }
}
</style>
