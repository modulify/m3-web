import type {
  Meta,
  StoryObj,
} from '@storybook/react'

import LocalThemeShowcase from '../examples/local-theme/LocalThemeShowcase'

import '../examples/local-theme/styles.scss'

const meta = {
  title: 'Patterns/Local Theming',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const DangerActionScope: Story = {
  render: () => <LocalThemeShowcase variant="danger" />,
}

export const WarmAlertScope: Story = {
  render: () => <LocalThemeShowcase variant="warm-alert" />,
}

export const SuccessScope: Story = {
  render: () => <LocalThemeShowcase variant="success" />,
}

export const BrandMutedScope: Story = {
  render: () => <LocalThemeShowcase variant="brand-muted" />,
}

export const NestedLocalScopes: Story = {
  render: () => <LocalThemeShowcase variant="nested" />,
}
