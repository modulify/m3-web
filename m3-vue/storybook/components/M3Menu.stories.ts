import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { Meta, StoryObj } from '@storybook/vue3'

import { ref } from 'vue'

import { M3Button } from '@/components/button'
import { M3Divider } from '@/components/divider'
import { M3Icon } from '@/components/icon'
import { M3Menu, M3MenuItem } from '@/components/menu'

import { localize } from '../i18n'

const messages = {
  'en-US': { open: 'Open menu', first: 'Edit profile', second: 'Favorite', third: 'Archive', more: 'More actions' },
  'ru-RU': { open: 'Открыть меню', first: 'Изменить профиль', second: 'Избранное', third: 'Архивировать', more: 'Другие действия' },
}

const meta = {
  title: 'Components/M3Menu',

  component: M3Menu,

  args: { target: () => null },

  argTypes: {
    target: { control: false },
    shown: { control: false },
    color: { control: 'select', options: ['standard', 'vibrant'] },
    density: { control: 'select', options: [0, -1, -2, -3] },
  },

  render: (args: unknown, { globals }) => ({
    components: { M3Button, M3Menu, M3MenuItem, M3Divider },

    setup () {
      const trigger = ref<ElementReference | null>(null)

      return {
        args,
        trigger,
        open: ref(false),
        target: () => trigger.value?.el ?? null,
        text: localize(globals.locale, messages),
      }
    },

    template: `
        <div style="min-height: 260px; min-width: 360px">
            <M3Button ref="trigger" aria-haspopup="menu" :aria-expanded="open">{{ text.open }}</M3Button>
            <M3Menu v-bind="args" :target="target" v-model:shown="open">
                <M3MenuItem>{{ text.first }}</M3MenuItem>
                <M3MenuItem selection="single" selected>{{ text.second }}</M3MenuItem>
                <M3Divider role="separator" />
                <M3MenuItem disabled>{{ text.third }}</M3MenuItem>
            </M3Menu>
        </div>
    `,
  }),

  parameters: { layout: 'centered' },
} satisfies Meta<typeof M3Menu>

export default meta

type Story = StoryObj<typeof meta>

export const Standard: Story = {}

export const Vibrant: Story = {
  args: { color: 'vibrant' },
}

export const WithLeadingAndTrailingContent: Story = {
  render: (args: unknown, { globals }) => ({
    components: { M3Button, M3Icon, M3Menu, M3MenuItem },

    setup () {
      const trigger = ref<ElementReference | null>(null)

      return {
        args,
        trigger,
        open: ref(false),
        target: () => trigger.value?.el ?? null,
        text: localize(globals.locale, messages),
      }
    },

    template: `
        <div style="min-height: 260px; min-width: 360px">
            <M3Button ref="trigger" aria-haspopup="menu" :aria-expanded="open">{{ text.open }}</M3Button>
            <M3Menu v-bind="args" :target="target" v-model:shown="open">
                <M3MenuItem>
                    <template #leading><M3Icon name="edit" /></template>
                    {{ text.first }}
                    <template #trailing><M3Icon name="chevron_right" /></template>
                </M3MenuItem>
                <M3MenuItem>
                    <template #leading><M3Icon name="favorite" /></template>
                    {{ text.second }}
                </M3MenuItem>
            </M3Menu>
        </div>
    `,
  }),
}

export const Submenu: Story = {
  render: (args: unknown, { globals }) => ({
    components: { M3Button, M3Menu, M3MenuItem },

    setup () {
      const trigger = ref<ElementReference | null>(null)

      return {
        args,
        trigger,
        open: ref(false),
        target: () => trigger.value?.el ?? null,
        text: localize(globals.locale, messages),
      }
    },

    template: `
        <div style="min-height: 260px; min-width: 360px">
            <M3Button ref="trigger" aria-haspopup="menu" :aria-expanded="open">{{ text.open }}</M3Button>
            <M3Menu v-bind="args" :target="target" v-model:shown="open">
                <M3MenuItem>{{ text.first }}</M3MenuItem>
                <M3MenuItem>
                    {{ text.more }}
                    <template #submenu>
                        <M3MenuItem>{{ text.second }}</M3MenuItem>
                        <M3MenuItem>{{ text.third }}</M3MenuItem>
                    </template>
                </M3MenuItem>
            </M3Menu>
        </div>
    `,
  }),
}
