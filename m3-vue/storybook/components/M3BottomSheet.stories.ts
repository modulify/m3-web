import type { Meta, StoryObj } from '@storybook/vue3'

import { ref } from 'vue'

import { M3BottomSheet } from '@/components/bottom-sheet'
import { M3Button } from '@/components/button'

import { localize } from '../i18n'

const meta = {
  title: 'Components/M3BottomSheet',
  component: M3BottomSheet,
  argTypes: { shown: { control: false }, expanded: { control: false } },
  args: { variant: 'standard', peek: 280 },
  render: (args, { globals }) => ({
    components: { M3BottomSheet, M3Button },
    setup () {
      const shown = ref(false)
      const expanded = ref(false)
      const text = localize(globals.locale, {
        'en-US': { open: 'Open bottom sheet', close: 'Close', expand: 'Expand', collapse: 'Collapse', resize: 'Resize bottom sheet', title: 'Choose a destination', item: 'Destination' },
        'ru-RU': { open: 'Открыть нижнюю панель', close: 'Закрыть', expand: 'Развернуть', collapse: 'Свернуть', resize: 'Изменить высоту панели', title: 'Выберите место', item: 'Место' },
      })

      return { args, shown, expanded, text, items: Array.from({ length: 12 }, (_, index) => index + 1) }
    },
    template: `
        <div class="p-6">
            <M3Button @click="shown = true">{{ text.open }}</M3Button>
            <M3BottomSheet
                v-bind="args"
                v-model:shown="shown"
                v-model:expanded="expanded"
                :label="text.resize"
                :aria-label="text.title"
            >
                <div class="p-6">
                    <h2 class="m-0">{{ text.title }}</h2>
                    <M3Button v-if="args.handle === false" @click="expanded = !expanded">
                        {{ expanded ? text.collapse : text.expand }}
                    </M3Button>
                    <p v-for="item in items" :key="item">{{ text.item }} {{ item }}</p>
                    <M3Button @click="shown = false">{{ text.close }}</M3Button>
                </div>
            </M3BottomSheet>
        </div>
    `,
  }),
} satisfies Meta<typeof M3BottomSheet>

export default meta
type Story = StoryObj<typeof meta>

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const Standard: Story = {}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const Modal: Story = { args: { variant: 'modal', peek: undefined } }

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const WithoutHandle: Story = { args: { handle: false } }
