import type { Meta, StoryObj } from '@storybook/react'

import React, { useState } from 'react'

import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'

const meta: Meta<typeof M3IconButton> = {
  title: 'Components/M3IconButton',

  component: M3IconButton,

  argTypes: {
    appearance: {
      control: 'select',
      options: ['filled', 'outlined', 'standard', 'tonal'],
    },

    toggleable: {
      control: false,
    },

    selected: {
      control: false,
    },

    disabled: {
      control: 'boolean',
    },
  },

  args: {
    appearance: 'standard',
    disabled: false,
  },

  render: args => (
    <M3IconButton {...args}>
      <M3Icon name="favorite" />
    </M3IconButton>
  ),

  parameters: {
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Standard: Story = {}

export const Toggleable: Story = {
  render: args => {
    const [selected, setSelected] = useState(false)

    return (
      <M3IconButton
        {...args}
        toggleable={true}
        selected={selected}
        onClick={() => setSelected(!selected)}
      >
        <M3Icon name="favorite" />
      </M3IconButton>
    )
  },
}
