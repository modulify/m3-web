import type { Meta, StoryObj } from '@storybook/react'

import { M3Checkbox } from '@/components/checkbox'

import { useState } from 'react'
import { useId } from '@/hooks'

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
          id={id}
          model={model}
          onChange={setModel}
          {...args}
        />

        <label htmlFor={id}>Choice</label>
      </div>
    )
  },

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Standard: Story = {}
