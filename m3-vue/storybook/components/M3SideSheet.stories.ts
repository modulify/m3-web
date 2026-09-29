import type { Meta, StoryObj } from '@storybook/vue3'

import { ref } from 'vue'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3SideSheet } from '@/components/side-sheet'

import { localize } from '../i18n'

const sideSheetStoryTemplate = `
    <M3Button @click="shown = true">
        {{ text.open }}
    </M3Button>

    <M3SideSheet
        v-bind="args"
        :shown="shown"
        @update:shown="shown = $event"
    >
        <template #title>
            {{ text.filter }}
        </template>

        <template #close-icon>
            <M3Icon name="close" />
        </template>

        <p class="m-4">{{ text.body }}</p>

        <template #footer>
            <div class="p-4">{{ text.footer }}</div>
        </template>
    </M3SideSheet>
`

const meta = {
  title: 'Components/M3SideSheet',

  component: M3SideSheet,

  argTypes: {
    shown: {
      control: false,
    },
  },

  args: {
    docked: false,
  },

  render: (args: unknown, { globals }) => ({
    components: {
      M3Button,
      M3Icon,
      M3SideSheet,
    },

    setup () {
      const shown = ref(false)

      return {
        args,
        shown,
        text: localize(globals.locale, {
          'en-US': { body: 'Choose filters and apply changes.', filter: 'Filters', footer: 'Footer actions', open: 'Open side sheet' },
          'ru-RU': { body: 'Выберите фильтры и примените изменения.', filter: 'Фильтры', footer: 'Действия', open: 'Открыть боковую панель' },
        }),
      }
    },

    template: sideSheetStoryTemplate,
  }),

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3SideSheet>

export default meta

type Story = StoryObj<typeof meta>

export const Standard: Story = {}

export const Docked: Story = {
  args: {
    docked: true,
  },
}
