import type { Meta, StoryObj } from '@storybook/vue3'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3SideSheet } from '@/components/side-sheet'

import { ref } from 'vue'

const sideSheetStoryTemplate = `
    <M3Button @click="shown = true">
        Open side sheet
    </M3Button>

    <M3SideSheet
        v-bind="args"
        :shown="shown"
        @update:shown="shown = $event"
    >
        <template #title>
            Filters
        </template>

        <template #close-icon>
            <M3Icon name="close" />
        </template>

        <p class="m-4">Choose filters and apply changes.</p>

        <template #footer>
            <div class="p-4">Footer actions</div>
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

  render: (args: unknown) => ({
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
