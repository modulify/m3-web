import type { Meta, StoryObj } from '@storybook/vue3'

import { M3RichTooltip } from '@/components/rich-tooltip'

import DeleteTooltip from '../examples/rich-tooltip/DeleteTooltip.vue'
import SelectionTooltip from '../examples/rich-tooltip/SelectionTooltip.vue'
import ShortcutTooltip from '../examples/rich-tooltip/ShortcutTooltip.vue'

const meta = {
  title: 'Components/M3RichTooltip',

  component: M3RichTooltip,

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3RichTooltip>

export default meta

type Story = StoryObj<typeof meta>

export const DestructiveAction: Story = {
  render: () => ({
    components: {
      DeleteTooltip,
    },

    template: '<DeleteTooltip />',
  }),
}

export const BulkSelection: Story = {
  render: () => ({
    components: {
      SelectionTooltip,
    },

    template: '<SelectionTooltip />',
  }),
}

export const ShortcutHint: Story = {
  render: () => ({
    components: {
      ShortcutTooltip,
    },

    template: '<ShortcutTooltip />',
  }),
}
