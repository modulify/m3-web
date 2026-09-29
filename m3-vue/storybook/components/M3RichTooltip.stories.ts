import type { Meta, StoryObj } from '@storybook/vue3'

import { expect, userEvent, within } from 'storybook/test'

import { M3RichTooltip } from '@/components/rich-tooltip'

import DeleteTooltip from '../examples/rich-tooltip/DeleteTooltip.vue'
import { resolveStorybookLocale } from '../i18n'
import SelectionTooltip from '../examples/rich-tooltip/SelectionTooltip.vue'
import ShortcutTooltip from '../examples/rich-tooltip/ShortcutTooltip.vue'

const meta = {
  title: 'Components/M3RichTooltip',

  component: M3RichTooltip,

  args: {
    target: () => null,
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
  render: (_args, { globals }) => ({
    components: {
      DeleteTooltip,
    },

    setup: () => ({ locale: resolveStorybookLocale(globals.locale) }),
    template: '<DeleteTooltip :locale="locale" />',
  }),
  play: ({ canvasElement }) => openPopup(canvasElement, 'dialog', /Delete item|Удалить элемент/),
}

export const BulkSelection: Story = {
  render: (_args, { globals }) => ({
    components: {
      SelectionTooltip,
    },

    setup: () => ({ locale: resolveStorybookLocale(globals.locale) }),
    template: '<SelectionTooltip :locale="locale" />',
  }),
  play: ({ canvasElement }) => openPopup(canvasElement, 'dialog', /3 items selected|Выбрано 3 элемента/),
}

export const ShortcutHint: Story = {
  render: (_args, { globals }) => ({
    components: {
      ShortcutTooltip,
    },

    setup: () => ({ locale: resolveStorybookLocale(globals.locale) }),
    template: '<ShortcutTooltip :locale="locale" />',
  }),
  play: ({ canvasElement }) => openPopup(canvasElement, 'tooltip'),
}
