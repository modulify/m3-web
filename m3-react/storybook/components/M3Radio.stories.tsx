import type { Meta, StoryObj } from '@storybook/react'

import { M3Radio } from '@/components/radio'
import RadioGroup from '../examples/radio/RadioGroup'

import { useState } from 'react'
import { useId } from '@/hooks'

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

  render: (args) => {
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
          onChange={setModel}
          {...args}
        />

        <span>Choice</span>
      </label>
    )
  },

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3Radio>

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
