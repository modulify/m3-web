import '../examples/local-theme/styles.scss'

import type { Meta, StoryObj } from '@storybook/react'

import LocalThemeShowcase from '../examples/local-theme/LocalThemeShowcase'

const meta = {
  title: 'Guides/Theming',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const DangerNotification: Story = {
  render: (_args, { globals }) => <LocalThemeShowcase locale={globals.locale} variant="danger" />,
}

export const WarmAlertNotification: Story = {
  render: (_args, { globals }) => <LocalThemeShowcase locale={globals.locale} variant="warm-alert" />,
}

export const SuccessNotification: Story = {
  render: (_args, { globals }) => <LocalThemeShowcase locale={globals.locale} variant="success" />,
}

export const BrandMutedNotification: Story = {
  render: (_args, { globals }) => <LocalThemeShowcase locale={globals.locale} variant="brand-muted" />,
}

export const ListWithDangerMenu: Story = {
  render: (_args, { globals }) => <LocalThemeShowcase locale={globals.locale} variant="list-menu" />,
}
