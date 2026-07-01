import type { Meta, StoryObj } from '@storybook/vue3'

import LocalThemeShowcase from '../examples/local-theme/LocalThemeShowcase.vue'

const meta = {
  title: 'Guides/Theming',

  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const DangerNotification: Story = {
  render: () => ({
    components: {
      LocalThemeShowcase,
    },

    template: `
        <LocalThemeShowcase variant="danger" />
    `,
  }),
}

export const WarmAlertNotification: Story = {
  render: () => ({
    components: {
      LocalThemeShowcase,
    },

    template: `
        <LocalThemeShowcase variant="warm-alert" />
    `,
  }),
}

export const SuccessNotification: Story = {
  render: () => ({
    components: {
      LocalThemeShowcase,
    },

    template: `
        <LocalThemeShowcase variant="success" />
    `,
  }),
}

export const BrandMutedNotification: Story = {
  render: () => ({
    components: {
      LocalThemeShowcase,
    },

    template: `
        <LocalThemeShowcase variant="brand-muted" />
    `,
  }),
}

export const ListWithDangerMenu: Story = {
  render: () => ({
    components: {
      LocalThemeShowcase,
    },

    template: `
        <LocalThemeShowcase variant="list-menu" />
    `,
  }),
}
