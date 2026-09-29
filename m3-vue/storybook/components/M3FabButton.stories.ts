import type { Meta, StoryObj } from '@storybook/vue3'

import { M3FabButton } from '@/components/fab-button'
import { M3Icon } from '@/components/icon'

import { sizes, variants } from '@/components/fab-button/values'

import { localize } from '../i18n'

const messages = {
  'en-US': { edit: 'Edit', newTask: 'New task' },
  'ru-RU': { edit: 'Редактировать', newTask: 'Новая задача' },
}

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

  render: (args: unknown, { globals }) => ({
    components: {
      M3FabButton,
      M3Icon,
    },

    setup () {
      return {
        args,
        label: localize(globals.locale, messages).edit,
      }
    },

    template: `
        <M3FabButton v-bind="args" :aria-label="label">
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
  render: (args: unknown, { globals }) => ({
    components: {
      M3FabButton,
      M3Icon,
    },

    setup () {
      return {
        args,
        label: localize(globals.locale, messages).edit,
      }
    },

    template: `
        <M3FabButton v-bind="args">
            <M3Icon name="edit" aria-hidden="true" /> {{ label }}
        </M3FabButton>
    `,
  }),
}

export const VariantMatrix: Story = {
  render: (_args, { globals }) => ({
    components: {
      M3FabButton,
      M3Icon,
    },

    setup () {
      return {
        variants,
        label: localize(globals.locale, messages).newTask,
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
                    <M3Icon name="edit" /> {{ label }}
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
