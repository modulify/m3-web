import type { M3RadioProps } from '@/components/radio'
import type { Meta, StoryObj } from '@storybook/vue3'

import { ref } from 'vue'

import { M3Radio } from '@/components/radio'

import { useId } from '@/composables/id'

import RadioGroup from '../examples/radio/RadioGroup.vue'

const meta = {
  title: 'Components/M3Radio',

  component: M3Radio as unknown as NonNullable<Meta<M3RadioProps<string>>['component']>,

  args: {
    invalid: false,
    disabled: false,
  },

  render: (args: M3RadioProps<string>) => ({
    components: {
      M3Radio,
    },

    setup: () => ({
      id: useId('m3-radio'),
      name: useId('m3-radio-group'),
      args,
      model: ref('choice'),
    }),

    template: `
      <label style="display: flex; align-items: center; gap: 12px;">
          <M3Radio
              :id="id"
              :name="name"
              :model="model"
              value="choice"
              v-bind="args"
              @update:model="model = $event"
          />

          <span>Choice</span>
      </label>
    `,
  }),

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<M3RadioProps<string>>

export default meta

type Story = StoryObj<typeof meta>

export const Standard: Story = {}

export const PreferenceGroup: Story = {
  render: () => ({
    components: {
      RadioGroup,
    },

    template: `
      <RadioGroup
          legend="Notification channel"
          :options="[{
              label: 'Email',
              value: 'email',
          }, {
              label: 'Push',
              value: 'push',
          }, {
              label: 'SMS',
              value: 'sms',
              disabled: true,
          }]"
      />
    `,
  }),
}

export const InvalidGroup: Story = {
  render: () => ({
    components: {
      RadioGroup,
    },

    template: `
      <RadioGroup
          legend="Release cadence"
          invalid
          :options="[{
              label: 'Stable',
              value: 'stable',
          }, {
              label: 'Preview',
              value: 'preview',
          }]"
      />
    `,
  }),
}
