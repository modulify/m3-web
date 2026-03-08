import type { Meta, StoryObj } from '@storybook/vue3'

import { M3FabButton } from '@/components/fab-button'
import { M3Icon } from '@/components/icon'

import {
  sizes,
  variants,
} from '@/components/fab-button/values'

const meta = {
  title: 'Components/M3FabButton',

  component: M3FabButton,

  argTypes: {
    variant: {
      control: 'select',
      options: variants,
    },

    size: {
      control: 'select',
      options: sizes,
    },

    disabled: {
      control: 'boolean',
    },
  },

  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
  },

  render: (args: unknown) => ({
    components: {
      M3FabButton,
      M3Icon,
    },

    setup () {
      return { args }
    },

    template: `
        <M3FabButton v-bind="args" aria-label="Edit">
            <M3Icon name="edit" />
        </M3FabButton>
    `,
  }),

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3FabButton>

export default meta

type Story = StoryObj<typeof meta>

export const Standard: Story = {}

export const Extended: Story = {
  render: (args: unknown) => ({
    components: {
      M3FabButton,
      M3Icon,
    },

    setup () {
      return { args }
    },

    template: `
        <M3FabButton v-bind="args">
            <M3Icon name="edit" aria-hidden="true" /> Edit
        </M3FabButton>
    `,
  }),
}

export const VariantMatrix: Story = {
  // eslint-disable-next-line max-lines-per-function
  render: () => ({
    components: {
      M3FabButton,
      M3Icon,
    },

    setup () {
      return {
        variants,
      }
    },

    template: `
        <div style="display: grid; gap: 16px;">
            <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
                <M3FabButton
                    v-for="variant in variants"
                    :key="'icon-' + variant"
                    :variant="variant"
                    :aria-label="variant"
                >
                    <M3Icon name="edit" />
                </M3FabButton>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
                <M3FabButton
                    v-for="variant in variants"
                    :key="'text-' + variant"
                    :variant="variant"
                >
                    <M3Icon name="edit" /> New task
                </M3FabButton>
            </div>
        </div>
    `,
  }),
}

export const SizeMatrix: Story = {
  render: () => ({
    components: {
      M3FabButton,
      M3Icon,
    },

    setup () {
      return {
        sizes,
      }
    },

    template: `
        <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
            <M3FabButton
                v-for="size in sizes"
                :key="size"
                :size="size"
                :aria-label="size"
            >
                <M3Icon name="edit" />
            </M3FabButton>
        </div>
    `,
  }),
}
