import type { Meta, StoryObj } from '@storybook/react'

import { M3RichTooltip } from '@/components/rich-tooltip'

import DeleteTooltip from '../examples/rich-tooltip/DeleteTooltip'
import SelectionTooltip from '../examples/rich-tooltip/SelectionTooltip'
import ShortcutTooltip from '../examples/rich-tooltip/ShortcutTooltip'

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
  render: () => <DeleteTooltip />,
}

export const BulkSelection: Story = {
  render: () => <SelectionTooltip />,
}

export const ShortcutHint: Story = {
  render: () => <ShortcutTooltip />,
}
