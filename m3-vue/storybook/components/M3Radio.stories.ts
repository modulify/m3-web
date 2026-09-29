import type { M3RadioProps } from '@/components/radio'
import type { Meta, StoryObj } from '@storybook/vue3'

import { ref } from 'vue'

import { M3Radio } from '@/components/radio'

import { useId } from '@/composables/id'

import { localize } from '../i18n'
import RadioGroup from '../examples/radio/RadioGroup.vue'

const messages = {
  'en-US': { choice: 'Choice', email: 'Email', notificationChannel: 'Notification channel', preview: 'Preview', push: 'Push', releaseCadence: 'Release cadence', sms: 'SMS', stable: 'Stable' },
  'ru-RU': { choice: 'Выбор', email: 'Электронная почта', notificationChannel: 'Канал уведомлений', preview: 'Предварительные версии', push: 'Push-уведомления', releaseCadence: 'Канал обновлений', sms: 'SMS', stable: 'Стабильные версии' },
}

const meta = {
  title: 'Components/M3Radio',

  component: M3Radio as unknown as NonNullable<Meta<M3RadioProps<string>>['component']>,

  args: {
    invalid: false,
    disabled: false,
  },

  render: (args: M3RadioProps<string>, { globals }) => ({
    components: {
      M3Radio,
    },

    setup: () => ({
      id: useId('m3-radio'),
      name: useId('m3-radio-group'),
      args,
      label: localize(globals.locale, messages).choice,
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

          <span>{{ label }}</span>
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
  render: (_args, { globals }) => ({
    components: {
      RadioGroup,
    },

    setup: () => ({ text: localize(globals.locale, messages) }),

    template: `
      <RadioGroup
          :legend="text.notificationChannel"
          :options="[{
              label: text.email,
              value: 'email',
          }, {
              label: text.push,
              value: 'push',
          }, {
              label: text.sms,
              value: 'sms',
              disabled: true,
          }]"
      />
    `,
  }),
}

export const InvalidGroup: Story = {
  render: (_args, { globals }) => ({
    components: {
      RadioGroup,
    },

    setup: () => ({ text: localize(globals.locale, messages) }),

    template: `
      <RadioGroup
          :legend="text.releaseCadence"
          invalid
          :options="[{
              label: text.stable,
              value: 'stable',
          }, {
              label: text.preview,
              value: 'preview',
          }]"
      />
    `,
  }),
}
