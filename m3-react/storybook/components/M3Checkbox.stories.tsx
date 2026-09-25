import type { M3CheckboxProps } from '@/components/checkbox'
import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { M3Checkbox } from '@/components/checkbox'

import { useId } from '@/hooks'

import CheckboxList from '../examples/checkbox/CheckboxList'

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

  render: (args) => {
    const id = useId(null, 'm3-checkbox')
    const [model, setModel] = useState(false)

    return (
      <div className="flex-row">
        <M3Checkbox
          {...args}
          id={id}
          model={model}
          onChange={setModel}
        />

        <label htmlFor={id}>Choice</label>
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
  render: () => (
    <CheckboxList
      options={[{
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
      }]}
    />
  ),
}
