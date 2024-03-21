import type { Meta, StoryObj } from '@storybook/react'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'

const meta: Meta<typeof M3Button> = {
  component: M3Button,

  argTypes: {
    appearance: {
      control: {
        control: 'select',
        options: ['elevated', 'filled', 'outlined', 'text', 'tonal'],
      },
    },

    href: { control: 'text' },

    disabled: { control: 'boolean' },
  },

  args: {
    appearance: 'filled',
    disabled: false,
  },

  render: (args) => <M3Button {...args}>Share</M3Button>,

  parameters: {
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const WithTextOnly: Story = {}
export const WithLeadingIcon: Story = {
  render: (args) => (
    <M3Button {...args}>
      <M3Icon name={'share'} />
      Share
    </M3Button>
  ),
}