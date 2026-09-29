import type { M3RadioProps } from '@/components/radio'
import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { M3Radio } from '@/components/radio'

import { useId } from '@/hooks'

import { localize } from '../i18n'
import RadioGroup from '../examples/radio/RadioGroup'

const messages = {
  'en-US': { choice: 'Choice', email: 'Email', notificationChannel: 'Notification channel', preview: 'Preview', push: 'Push', releaseCadence: 'Release cadence', sms: 'SMS', stable: 'Stable' },
  'ru-RU': { choice: 'Выбор', email: 'Электронная почта', notificationChannel: 'Канал уведомлений', preview: 'Предварительные версии', push: 'Push-уведомления', releaseCadence: 'Канал обновлений', sms: 'SMS', stable: 'Стабильные версии' },
}

const meta = {
  title: 'Components/M3Radio',

  component: M3Radio,

  argTypes: {
    invalid: {
      control: 'boolean',
    },

    disabled: {
      control: 'boolean',
    },
  },

  args: {
    invalid: false,
    disabled: false,
  },

  render: ({
    id: _id,
    name: _name,
    model: _model,
    value: _value,
    onChange: _onChange,
    ...args
  }, { globals }) => {
    const name = useId(null, 'm3-radio-group')
    const id = useId(null, 'm3-radio')
    const [model, setModel] = useState('choice')
    const text = localize(globals.locale, messages)

    return (
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
      >
        <M3Radio
          id={id}
          name={name}
          model={model}
          value="choice"
          {...args}
          onChange={setModel}
        />

        <span>{text.choice}</span>
      </label>
    )
  },

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<M3RadioProps<string>>

export default meta

type Story = StoryObj<typeof meta>

export const Standard: Story = {}

export const PreferenceGroup: Story = {
  render: (_args, { globals }) => {
    const text = localize(globals.locale, messages)

    return (
      <RadioGroup
        legend={text.notificationChannel}
        options={[{
          label: text.email,
          value: 'email',
        }, {
          label: text.push,
          value: 'push',
        }, {
          label: text.sms,
          value: 'sms',
          disabled: true,
        }]}
      />
    )
  },
}

export const InvalidGroup: Story = {
  render: (_args, { globals }) => {
    const text = localize(globals.locale, messages)

    return (
      <RadioGroup
        legend={text.releaseCadence}
        invalid={true}
        options={[{
          label: text.stable,
          value: 'stable',
        }, {
          label: text.preview,
          value: 'preview',
        }]}
      />
    )
  },
}
