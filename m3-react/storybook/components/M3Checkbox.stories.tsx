import type { M3CheckboxProps } from '@/components/checkbox'
import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { M3Checkbox } from '@/components/checkbox'

import { useId } from '@/hooks'

import CheckboxList from '../examples/checkbox/CheckboxList'
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

  component: M3Checkbox,

  argTypes: {
    indeterminate: {
      control: 'boolean',
    },

    invalid: {
      control: 'boolean',
    },

    disabled: {
      control: 'boolean',
    },
  },

  args: {
    indeterminate: false,
    invalid: false,
    disabled: false,
  },

  render: ({
    id: _id,
    model: _model,
    onChange: _onChange,
    ...args
  }, { globals }) => {
    const id = useId(null, 'm3-checkbox')
    const [model, setModel] = useState(false)
    const text = localize(globals.locale, messages)

    return (
      <div className="flex-row">
        <M3Checkbox
          id={id}
          model={model}
          {...args}
          onChange={setModel}
        />

        <label htmlFor={id}>{text.choice}</label>
      </div>
    )
  },

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<M3CheckboxProps<boolean>>

export default meta

type Story = StoryObj<typeof meta>

export const Standard: Story = {}

export const NestedSelection: Story = {
  render: (_args, { globals }) => {
    const text = localize(globals.locale, messages)

    return (
      <CheckboxList
        options={[{
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
        }]}
      />
    )
  },
}
