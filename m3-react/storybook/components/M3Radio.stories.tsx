import type { M3RadioProps } from '@/components/radio'
import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { M3Radio } from '@/components/radio'

import { useId } from '@/hooks'

import RadioGroup from '../examples/radio/RadioGroup'

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
  }) => {
    const name = useId(null, 'm3-radio-group')
    const id = useId(null, 'm3-radio')
    const [model, setModel] = useState('choice')

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

        <span>Choice</span>
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
  render: () => (
    <RadioGroup
      legend="Notification channel"
      options={[{
        label: 'Email',
        value: 'email',
      }, {
        label: 'Push',
        value: 'push',
      }, {
        label: 'SMS',
        value: 'sms',
        disabled: true,
      }]}
    />
  ),
}

export const InvalidGroup: Story = {
  render: () => (
    <RadioGroup
      legend="Release cadence"
      invalid={true}
      options={[{
        label: 'Stable',
        value: 'stable',
      }, {
        label: 'Preview',
        value: 'preview',
      }]}
    />
  ),
}
