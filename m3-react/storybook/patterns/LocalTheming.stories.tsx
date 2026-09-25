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
  render: () => <LocalThemeShowcase variant="danger" />,
}

export const WarmAlertNotification: Story = {
  render: () => <LocalThemeShowcase variant="warm-alert" />,
}

export const SuccessNotification: Story = {
  render: () => <LocalThemeShowcase variant="success" />,
}

export const BrandMutedNotification: Story = {
  render: () => <LocalThemeShowcase variant="brand-muted" />,
}

export const ListWithDangerMenu: Story = {
  render: () => <LocalThemeShowcase variant="list-menu" />,
}
