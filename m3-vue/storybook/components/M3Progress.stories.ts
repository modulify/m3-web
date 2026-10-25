import type { Meta, StoryObj } from '@storybook/vue3'

import { onBeforeUnmount, ref } from 'vue'

import { M3Button } from '@/components/button'
import { M3Progress, M3ProgressCircle, M3ProgressLine } from '@/components/progress'

import { localize } from '../i18n'

const meta = {
  title: 'Components/M3Progress',
  component: M3Progress,

  argTypes: {
    variant: { control: 'select', options: ['linear', 'circular'] },
    shape: { control: 'select', options: ['flat', 'wavy'] },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    thickness: { control: { type: 'range', min: 1, max: 12, step: 1 } },
    size: { control: { type: 'range', min: 24, max: 240, step: 4 } },
  },

  args: {
    variant: 'linear',
    shape: 'flat',
    value: 40,
    indeterminate: false,
    track: true,
    stop: true,
  },

  render: (args, { globals }) => ({
    components: { M3Progress },
    setup () {
      return {
        args,
        label: localize(globals.locale, {
          'en-US': 'Loading article',
          'ru-RU': 'Загрузка статьи',
        }),
      }
    },
    template: `
        <div :style="{ width: args.variant === 'linear' ? '360px' : undefined }">
            <M3Progress v-bind="args" :aria-label="label" />
        </div>
    `,
  }),

  parameters: { layout: 'centered' },
} satisfies Meta<typeof M3Progress>

export default meta

type Story = StoryObj<typeof meta>

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const Linear: Story = {}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const Circular: Story = { args: { variant: 'circular' } }

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const WavyLinear: Story = { args: { shape: 'wavy' } }

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const WavyCircular: Story = { args: { variant: 'circular', shape: 'wavy' } }

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const IndeterminateLinear: Story = { args: { indeterminate: true } }

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const WavyIndeterminateLinear: Story = { args: { shape: 'wavy', indeterminate: true } }

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const IndeterminateCircular: Story = { args: { variant: 'circular', indeterminate: true } }

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const WavyIndeterminate: Story = { args: { variant: 'circular', shape: 'wavy', indeterminate: true } }

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const WavyCircularMotion: Story = {
  args: { variant: 'circular', shape: 'wavy', indeterminate: true },
  render: (args, { globals }) => ({
    components: { M3Progress },
    setup () {
      return {
        args,
        sizes: [48, 96, 160],
        label: localize(globals.locale, {
          'en-US': 'Loading article',
          'ru-RU': 'Загрузка статьи',
        }),
      }
    },
    template: `
        <div class="d-flex gap-8 align-items-center">
            <M3Progress
                v-for="size in sizes"
                :key="size"
                v-bind="args"
                :size="size"
                :aria-label="label + ' (' + size + 'px)'"
            />
        </div>
    `,
  }),
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const ThickLinear: Story = { args: { thickness: 8, shape: 'wavy' } }

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const SmallProgress: Story = { args: { value: 1 } }

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const InButton: Story = {
  render: (_args, { globals }) => ({
    components: { M3Button, M3ProgressCircle },
    setup () {
      const loading = ref(false)
      let timer: number | undefined
      const start = () => {
        if (loading.value) return
        loading.value = true
        timer = window.setTimeout(() => { loading.value = false }, 2400)
      }

      onBeforeUnmount(() => window.clearTimeout(timer))

      return {
        loading,
        start,
        buttonLabel: localize(globals.locale, {
          'en-US': 'Download episode',
          'ru-RU': 'Скачать эпизод',
        }),
        label: localize(globals.locale, {
          'en-US': 'Downloading episode',
          'ru-RU': 'Загрузка эпизода',
        }),
      }
    },
    template: `
        <M3Button
            appearance="tonal"
            style="min-inline-size: 200px;"
            :aria-disabled="loading"
            :aria-busy="loading"
            :aria-label="loading ? label : undefined"
            @click="start"
        >
            <M3ProgressCircle
                v-if="loading"
                indeterminate
                :track="false"
                :size="24"
                aria-hidden="true"
                :style="{ '--m3-progress-color': 'currentColor' }"
            />
            <template v-else>{{ buttonLabel }}</template>
        </M3Button>
    `,
  }),
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const RightToLeft: Story = {
  render: (args, { globals }) => ({
    components: { M3Progress },
    setup () {
      return {
        args,
        label: localize(globals.locale, {
          'en-US': 'Loading article',
          'ru-RU': 'Загрузка статьи',
        }),
      }
    },
    template: `
        <div dir="rtl" style="width: 360px;">
            <M3Progress v-bind="args" :aria-label="label" />
        </div>
    `,
  }),
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const ProgressChanges: Story = {
  render: (_args, { globals }) => ({
    components: { M3ProgressLine },
    setup () {
      return {
        value: ref(30),
        label: localize(globals.locale, {
          'en-US': 'Loading article',
          'ru-RU': 'Загрузка статьи',
        }),
      }
    },
    template: `
        <div class="d-grid gap-6" style="width: 320px;">
            <M3ProgressLine :value="value" :aria-label="label" />
            <input v-model.number="value" type="range" min="0" max="100" :aria-label="label" />
        </div>
    `,
  }),
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const CircularProgressChanges: Story = {
  render: (_args, { globals }) => ({
    components: { M3ProgressCircle },
    setup () {
      return {
        value: ref(40),
        label: localize(globals.locale, {
          'en-US': 'Loading article',
          'ru-RU': 'Загрузка статьи',
        }),
      }
    },
    template: `
        <div class="d-grid gap-6" style="width: 320px;">
            <div class="d-flex gap-8 align-items-center">
                <M3ProgressCircle :value="value" :aria-label="label + ' (flat)'" />
                <M3ProgressCircle shape="wavy" :value="value" :aria-label="label + ' (wavy)'" />
            </div>
            <input v-model.number="value" type="range" min="0" max="100" :aria-label="label" />
        </div>
    `,
  }),
}
