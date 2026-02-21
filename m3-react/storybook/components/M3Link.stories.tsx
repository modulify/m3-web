import type { Meta, StoryObj } from '@storybook/react'

import { M3Link } from '@/components/link'

const meta = {
  title: 'Components/M3Link',

  component: M3Link,

  argTypes: {
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
    },

    href: {
      control: 'text',
    },
  },

  args: {
    type: 'button',
    href: '',
  },

  render: (args) => (
    <M3Link {...args} className="m3-button m3-button_filled">
      Open
    </M3Link>
  ),

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3Link>

export default meta

type Story = StoryObj<typeof meta>

export const AsButton: Story = {
  args: {
    href: '',
  },
}

export const AsAnchor: Story = {
  args: {
    href: '//example.com',
  },
}
