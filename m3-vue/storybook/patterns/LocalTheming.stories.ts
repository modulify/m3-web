import type { Meta, StoryObj } from '@storybook/vue3'

import LocalThemeShowcase from '../examples/local-theme/LocalThemeShowcase.vue'

const meta = {
  title: 'Patterns/Local Theming',

  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const DangerActionScope: Story = {
  render: () => ({
    components: {
      LocalThemeShowcase,
    },

    template: `
        <LocalThemeShowcase variant="danger" />
    `,
  }),
}

export const WarmAlertScope: Story = {
  render: () => ({
    components: {
      LocalThemeShowcase,
    },

    template: `
        <LocalThemeShowcase variant="warm-alert" />
    `,
  }),
}

export const SuccessScope: Story = {
  render: () => ({
    components: {
      LocalThemeShowcase,
    },

    template: `
        <LocalThemeShowcase variant="success" />
    `,
  }),
}

export const BrandMutedScope: Story = {
  render: () => ({
    components: {
      LocalThemeShowcase,
    },

    template: `
        <LocalThemeShowcase variant="brand-muted" />
    `,
  }),
}

export const NestedLocalScopes: Story = {
  render: () => ({
    components: {
      LocalThemeShowcase,
    },

    template: `
        <LocalThemeShowcase variant="nested" />
    `,
  }),
}
