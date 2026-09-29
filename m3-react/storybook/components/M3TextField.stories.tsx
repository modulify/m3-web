import type { M3TextFieldProps } from '@/components/text-field'
import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { M3Icon } from '@/components/icon'
import { M3TextField } from '@/components/text-field'

import { localize } from '../i18n'

const labels = {
  'en-US': { about: 'About', email: 'Email', password: 'Password field', summary: 'Add a short summary', text: 'Text field' },
  'ru-RU': { about: 'О себе', email: 'Электронная почта', password: 'Пароль', summary: 'Добавьте краткое описание', text: 'Текстовое поле' },
}

const M3TextFieldStory = ({
  value: _value,
  onUpdate: _onUpdate,
  ...args
}: M3TextFieldProps) => {
  const [value, setValue] = useState('')

  return (
    <div style={{ width: '320px' }}>
      <M3TextField
        value={value}
        {...args}
        onUpdate={setValue}
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

  render: (args, { globals }) => <M3TextFieldStory {...{ ...args, label: localize(globals.locale, labels).text }} />,

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

PasswordField.render = (args, { globals }) => <M3TextFieldStory {...{ ...args, label: localize(globals.locale, labels).password }} />

export const OutlinedWithLeadingIcon: Story = {
  render: (args, { globals }) => (
    <div style={{ width: '320px' }}>
      <M3TextFieldStoryWithLeadingIcon {...{ ...args, label: localize(globals.locale, labels).email }} />
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

MultilineOutlined.render = (args, { globals }) => {
  const text = localize(globals.locale, labels)
  return <M3TextFieldStory {...{ ...args, label: text.about, placeholder: text.summary }} />
}

const M3TextFieldStoryWithLeadingIcon = ({
  value: _value,
  onUpdate: _onUpdate,
  ...args
}: M3TextFieldProps) => {
  const [value, setValue] = useState('')

  return (
    <M3TextField value={value} {...args} onUpdate={setValue}>
      <M3TextField.LeadingIcon>
        <M3Icon name="mail" />
      </M3TextField.LeadingIcon>
    </M3TextField>
  )
}
