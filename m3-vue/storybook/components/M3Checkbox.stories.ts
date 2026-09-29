import type { M3CheckboxProps } from '@/components/checkbox'
import type { Meta, StoryObj } from '@storybook/vue3'

import { ref } from 'vue'

import { M3Checkbox } from '@/components/checkbox'

import { useId } from '@/composables/id'

import CheckboxList from '../examples/checkbox/CheckboxList.vue'
import { localize } from '../i18n'

const messages = {
  'en-US': {
    choice: 'Choice',
    email: 'Email',
    notifications: 'Notifications',
    push: 'Push',
    sms: 'SMS',
  },
  'ru-RU': {
    choice: 'Выбор',
    email: 'Электронная почта',
    notifications: 'Уведомления',
    push: 'Push-уведомления',
    sms: 'SMS',
  },
}

const meta = {
  title: 'Components/M3Checkbox',

  component: M3Checkbox as unknown as NonNullable<Meta<M3CheckboxProps<boolean>>['component']>,

  args: {
    disabled: false,
  },

  render: (args: M3CheckboxProps<boolean>, { globals }) => ({
    components: {
      M3Checkbox,
    },

    setup: () => ({
      id: useId('m3-checkbox'),
      args,
      label: localize(globals.locale, messages).choice,
      model: ref(false),
    }),

    template: `
      <div class="flex-row">
          <M3Checkbox
              :id="id"
              v-model:model="model"
              v-bind="args"
          />

          <label :for="id">{{ label }}</label>
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
  render: (_args, { globals }) => ({
    components: {
      CheckboxList,
    },

    setup: () => {
      const text = localize(globals.locale, messages)

      return {
        options: [{
          label: text.notifications,
          value: 'notifications',
          subordinates: [{
            label: text.email,
            value: 'email',
          }, {
            label: text.push,
            value: 'push',
          }, {
            label: text.sms,
            value: 'sms',
          }],
        }],
      }
    },

    template: '<CheckboxList :options="options" />',
  }),
}
