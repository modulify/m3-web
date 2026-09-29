import type { Meta, StoryObj } from '@storybook/vue3'

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

export const ActionConsequence: Story = {
  render: (_args, { globals }) => ({
    components: {
      DeleteTooltip,
    },

    setup: () => ({ locale: resolveStorybookLocale(globals.locale) }),
    template: '<DeleteTooltip :locale="locale" />',
  }),
}

export const BulkSelection: Story = {
  render: (_args, { globals }) => ({
    components: {
      SelectionTooltip,
    },

    setup: () => ({ locale: resolveStorybookLocale(globals.locale) }),
    template: '<SelectionTooltip :locale="locale" />',
  }),
}

export const ShortcutHint: Story = {
  render: (_args, { globals }) => ({
    components: {
      ShortcutTooltip,
    },

    setup: () => ({ locale: resolveStorybookLocale(globals.locale) }),
    template: '<ShortcutTooltip :locale="locale" />',
  }),
}
