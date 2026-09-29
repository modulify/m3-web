import type { Meta, StoryObj } from '@storybook/react'

import { M3RichTooltip } from '@/components/rich-tooltip'

import DeleteTooltip from '../examples/rich-tooltip/DeleteTooltip'
import SelectionTooltip from '../examples/rich-tooltip/SelectionTooltip'
import ShortcutTooltip from '../examples/rich-tooltip/ShortcutTooltip'

const meta = {
  title: 'Components/M3RichTooltip',

  component: M3RichTooltip,

  args: {
    target: null,
  },

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3RichTooltip>

export default meta

type Story = StoryObj<typeof meta>

export const ActionConsequence: Story = {
  render: (_args, { globals }) => <DeleteTooltip locale={globals.locale} />,
}

export const BulkSelection: Story = {
  render: (_args, { globals }) => <SelectionTooltip locale={globals.locale} />,
}

export const ShortcutHint: Story = {
  render: (_args, { globals }) => <ShortcutTooltip locale={globals.locale} />,
}
