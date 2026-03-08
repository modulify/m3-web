import type { Meta, StoryObj } from '@storybook/react'
import type { M3TextFieldProps } from '@/components/text-field'

import { M3Icon } from '@/components/icon'
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

export const OutlinedWithLeadingIcon: Story = {
  render: (args) => (
    <div style={{ width: '320px' }}>
      <M3TextFieldStoryWithLeadingIcon {...args} />
    </div>
  ),

  args: {
    type: 'email',
    label: 'Email',
    outlined: true,
    placeholder: 'name@example.com',
  },
}

export const MultilineOutlined: Story = {
  args: {
    label: 'About',
    outlined: true,
    multiline: true,
    placeholder: 'Add a short summary',
  },
}

const M3TextFieldStoryWithLeadingIcon = (args: M3TextFieldProps) => {
  const [value, setValue] = useState('')

  return (
    <M3TextField value={value} onUpdate={setValue} {...args}>
      <M3TextField.LeadingIcon>
        <M3Icon name="mail" />
      </M3TextField.LeadingIcon>
    </M3TextField>
  )
}
