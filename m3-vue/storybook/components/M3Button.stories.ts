import type { Meta, StoryObj } from '@storybook/vue3'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'

import * as values from '@/components/button/values'

const meta = {
  title: 'Components/M3Button',

  component: M3Button,

  argTypes: {
    appearance: {
      control: 'select',
      options: values.appearances,
    },

    disabled: {
      control: 'boolean',
    },
  },

  args: {
    appearance: 'filled',
    disabled: false,
  },

  render: (args: unknown) => ({
    components: {
      M3Button,
    },

    setup () {
      return { args }
    },

    template: '<M3Button v-bind="args">Share</M3Button>',
  }),

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3Button>

export default meta

type Story = StoryObj<typeof meta>

export const WithTextOnly: Story = {}

export const WithLeadingIcon: Story = {
  render: (args: unknown) => ({
    components: {
      M3Button,
      M3Icon,
    },

    setup () {
      return { args }
    },

    template: `
        <M3Button v-bind="args">
            <M3Icon name="share" />
            Share
        </M3Button>
    `,
  }),
}
