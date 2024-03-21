import type { Meta, StoryObj } from '@storybook/vue3'

import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'

import { ref } from 'vue'

const meta = {
  title: 'Components/M3IconButton',

  component: M3IconButton,

  argTypes: {
    appearance: {
      control: 'select',
      options: ['filled', 'outlined', 'standard', 'tonal'],
    },

    toggleable: {
      control: false,
    },

    selected: {
      control: false,
    },

    disabled: {
      control: 'boolean',
    },
  },

  args: {
    appearance: 'standard',
    disabled: false,
  },

  render: (args: unknown) => ({
    components: {
      M3Icon,
      M3IconButton,
    },

    setup () {
      return { args }
    },

    template: `
        <M3IconButton v-bind="args">
            <M3Icon name="favorite" />
        </M3IconButton>
    `,
  }),

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3IconButton>

export default meta

type Story = StoryObj<typeof meta>

export const Standard: Story = {}

export const Toggleable: Story = {
  render: (args: unknown) => ({
    components: {
      M3Icon,
      M3IconButton,
    },

    setup () {
      const selected = ref(false)

      return {
        args,
        selected,
      }
    },

    template: `
        <M3IconButton
            :selected="selected"
            v-bind="args"
            toggleable
            @click="selected = !selected"
        >
            <M3Icon name="favorite" />
        </M3IconButton>
    `,
  }),
}
