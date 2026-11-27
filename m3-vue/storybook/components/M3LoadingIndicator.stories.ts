import type { Meta, StoryObj } from '@storybook/vue3'

import { onBeforeUnmount, ref } from 'vue'

import { M3Button } from '@/components/button'
import { M3LoadingIndicator } from '@/components/loading-indicator'

import { localize } from '../i18n'

const meta = {
  title: 'Components/M3LoadingIndicator',
  component: M3LoadingIndicator,

  argTypes: {
    size: { control: { type: 'range', min: 24, max: 240, step: 4 } },
  },

  args: {
    contained: false,
    size: 48,
  },

  render: (args, { globals }) => ({
    components: { M3LoadingIndicator },
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
        <M3LoadingIndicator v-bind="args" :aria-label="label" />
    `,
  }),

  parameters: { layout: 'centered' },
} satisfies Meta<typeof M3LoadingIndicator>

export default meta

type Story = StoryObj<typeof meta>

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const Default: Story = {}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const Contained: Story = { args: { contained: true } }

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const Sizes: Story = {
  render: (_args, { globals }) => ({
    components: { M3LoadingIndicator },
    setup () {
      return {
        sizes: [24, 48, 96, 160],
        label: localize(globals.locale, {
          'en-US': 'Loading article',
          'ru-RU': 'Загрузка статьи',
        }),
      }
    },
    template: `
        <div class="d-flex gap-8 align-items-center">
            <M3LoadingIndicator
                v-for="size in sizes"
                :key="size"
                :size="size"
                :aria-label="label + ' (' + size + 'px)'"
            />
        </div>
    `,
  }),
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const InButton: Story = {
  render: (_args, { globals }) => ({
    components: { M3Button, M3LoadingIndicator },
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
          'en-US': 'Save changes',
          'ru-RU': 'Сохранить изменения',
        }),
        busyLabel: localize(globals.locale, {
          'en-US': 'Saving changes',
          'ru-RU': 'Сохранение изменений',
        }),
      }
    },
    template: `
        <M3Button
            appearance="tonal"
            style="min-inline-size: 200px;"
            :aria-busy="loading"
            :aria-disabled="loading"
            :aria-label="loading ? busyLabel : undefined"
            @click="start"
        >
            <M3LoadingIndicator
                v-if="loading"
                :size="24"
                style="color: currentColor;"
                aria-hidden="true"
            />
            <template v-else>{{ buttonLabel }}</template>
        </M3Button>
    `,
  }),
}
