import type { Meta, StoryObj } from '@storybook/react'

import { expect, userEvent, within } from 'storybook/test'

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

const openPopup = async (
  canvasElement: HTMLElement,
  role: 'dialog' | 'tooltip',
  accessibleName?: RegExp
) => {
  const canvas = within(canvasElement)

  await userEvent.click(canvas.getAllByRole('button')[0])

  const popup = await within(document.body).findByRole(role, accessibleName ? { name: accessibleName } : {})

  await expect(popup).toHaveClass('m3-popper_shown')
}

export const ActionConsequence: Story = {
  render: (_args, { globals }) => <DeleteTooltip locale={globals.locale} />,
  play: ({ canvasElement }) => openPopup(canvasElement, 'dialog', /Delete item|Удалить элемент/),
}

export const BulkSelection: Story = {
  render: (_args, { globals }) => <SelectionTooltip locale={globals.locale} />,
  play: ({ canvasElement }) => openPopup(canvasElement, 'dialog', /3 items selected|Выбрано 3 элемента/),
}

export const ShortcutHint: Story = {
  render: (_args, { globals }) => <ShortcutTooltip locale={globals.locale} />,
  play: ({ canvasElement }) => openPopup(canvasElement, 'tooltip'),
}
