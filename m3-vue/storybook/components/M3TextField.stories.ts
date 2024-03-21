import type { Meta, StoryObj } from '@storybook/vue3'

import { M3TextField } from '@/components/text-field'

import { ref } from 'vue'

const meta = {
  title: 'Components/M3TextField',

  component: M3TextField,

  argTypes: {
    type: {
      control: 'select',
      options: [
        'email',
        'number',
        'password',
        'search',
        'tel',
        'text',
        'url',
      ],
    },
  },

  args: {
    type: 'text',
  },

  render: (args: unknown) => ({
    components: { M3TextField },

    setup () {
      return {
        args,
        value: ref(''),
      }
    },

    template: `
        <M3TextField
            v-model:value="value"
            v-bind="args"
        />
    `,
  }),

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3TextField>

export default meta

type Story = StoryObj<typeof meta>

export const TextField: Story = {
  args: {
    type: 'text',
    label: 'Text field',
  },
}

export const PasswordField: Story = {
  args: {
    type: 'password',
    label: 'Password field',
  },
}
