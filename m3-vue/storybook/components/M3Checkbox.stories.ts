import type { Meta, StoryObj } from '@storybook/vue3'

import { M3Checkbox } from '@/components/checkbox'
import { ref } from 'vue'

import useId from '@/composables/id'

const meta = {
  title: 'Components/M3Checkbox',

  component: M3Checkbox,

  args: {
    disabled: false,
  },

  render: (args: unknown) => ({
    components: {
      M3Checkbox,
    },

    setup: () => ({
      id: useId('m3-checkbox'),
      args,
      model: ref(false),
    }),

    template: `
      <div class="flex-row">
          <M3Checkbox
              :id="id"
              v-model:model="model"
              v-bind="args"
          />

          <label :for="id">Choice</label>
      </div>
    `,
  }),

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Standard: Story = {}
