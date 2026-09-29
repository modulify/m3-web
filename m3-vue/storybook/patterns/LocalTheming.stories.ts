import type { Meta, StoryObj } from '@storybook/vue3'

import LocalThemeShowcase from '../examples/local-theme/LocalThemeShowcase.vue'
import { resolveStorybookLocale } from '../i18n'

const renderShowcase = (variant: string, locale: unknown) => ({
  components: { LocalThemeShowcase },
  setup: () => ({ locale: resolveStorybookLocale(locale), variant }),
  template: '<LocalThemeShowcase :locale="locale" :variant="variant" />',
})

const meta = {
  title: 'Guides/Theming',

  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const DangerNotification: Story = {
  render: (_args, { globals }) => renderShowcase('danger', globals.locale),
}

export const WarmAlertNotification: Story = {
  render: (_args, { globals }) => renderShowcase('warm-alert', globals.locale),
}

export const SuccessNotification: Story = {
  render: (_args, { globals }) => renderShowcase('success', globals.locale),
}

export const BrandMutedNotification: Story = {
  render: (_args, { globals }) => renderShowcase('brand-muted', globals.locale),
}

export const ListWithDangerMenu: Story = {
  render: (_args, { globals }) => renderShowcase('list-menu', globals.locale),
}
