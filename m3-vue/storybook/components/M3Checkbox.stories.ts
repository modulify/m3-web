import type { M3CheckboxProps } from '@/components/checkbox'
import type { Meta, StoryObj } from '@storybook/vue3'

import { ref } from 'vue'

import { M3Checkbox } from '@/components/checkbox'

import { useId } from '@/composables/id'

import CheckboxList from '../examples/checkbox/CheckboxList.vue'

const meta = {
  title: 'Components/M3Checkbox',

  component: M3Checkbox as unknown as NonNullable<Meta<M3CheckboxProps<boolean>>['component']>,

  args: {
    disabled: false,
  },

  render: (args: M3CheckboxProps<boolean>) => ({
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
} satisfies Meta<M3CheckboxProps<boolean>>

export default meta

type Story = StoryObj<typeof meta>

export const Standard: Story = {}

export const NestedSelection: Story = {
  render: () => ({
    components: {
      CheckboxList,
    },

    template: `
      <CheckboxList
          :options="[{
              label: 'Notifications',
              value: 'notifications',
              subordinates: [{
                  label: 'Email',
                  value: 'email',
              }, {
                  label: 'Push',
                  value: 'push',
              }, {
                  label: 'SMS',
                  value: 'sms',
              }],
          }]"
      />
    `,
  }),
}
