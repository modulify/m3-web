import type { Meta, StoryObj } from '@storybook/react'
import type { M3TextFieldProps } from '@/components/text-field'

import {
  M3TextField,
} from '@/components/text-field'

import { useState } from 'react'

const M3TextFieldStory = (args: M3TextFieldProps) => {
  const [value, setValue] = useState('')

  return (
    <div style={{ width: '320px' }}>
      <M3TextField
        value={value}
        onUpdate={setValue}
        {...args}
      />
    </div>
  )
}

const meta = {
  title: 'Components/M3TextField',

  component: M3TextField,

  argTypes: {
    type: {
      control: 'select',
      options: [
        'email',
        'number',
        'password',
        'search',
        'tel',
        'text',
        'url',
      ],
    },

    onInput: { control: false },
    onChange: { control: false },
    onUpdate: { control: false },
  },

  args: {
    type: 'text',
    label: 'Text field',
  },

  render: (args) => <M3TextFieldStory {...args} />,

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3TextField>

export default meta

type Story = StoryObj<typeof meta>

export const TextField: Story = {
  args: {
    type: 'text',
    label: 'Text field',
  },
}

export const PasswordField: Story = {
  args: {
    type: 'password',
    label: 'Password field',
  },
}
