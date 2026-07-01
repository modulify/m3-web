import type { Meta, StoryObj } from '@storybook/react'

import { M3Icon } from '@/components/icon'
import {
  M3List,
  M3ListItem,
} from '@/components/list'

const meta = {
  title: 'Components/M3List',

  component: M3List,

  argTypes: {
    divided: { control: 'boolean' },
  },

  args: {
    divided: false,
  },

  render: (args) => (
    <M3List {...args} aria-label="Settings">
      <M3ListItem>
        <M3ListItem.Leading>
          <M3Icon name="wifi" />
        </M3ListItem.Leading>
        Wi-Fi
        <M3ListItem.Trailing>
          On
        </M3ListItem.Trailing>
      </M3ListItem>

      <M3ListItem supportingText="Connected to office network">
        <M3ListItem.Leading>
          <M3Icon name="bluetooth" />
        </M3ListItem.Leading>
        Bluetooth
      </M3ListItem>

      <M3ListItem href="#notifications">
        <M3ListItem.Leading>
          <M3Icon name="notifications" />
        </M3ListItem.Leading>
        Notifications
        <M3ListItem.Trailing>
          <M3Icon name="chevron_right" />
        </M3ListItem.Trailing>
      </M3ListItem>
    </M3List>
  ),

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3List>

export default meta

type Story = StoryObj<typeof meta>

export const Standard: Story = {}

export const SupportingText: Story = {
  render: (args) => (
    <M3List {...args} aria-label="Messages">
      <M3ListItem
        overline="Today"
        supportingText="Design sync moved to 15:00. Review the agenda before joining."
      >
        <M3ListItem.Leading>
          <M3Icon name="event" />
        </M3ListItem.Leading>
        Planning meeting
        <M3ListItem.Trailing>
          14:12
        </M3ListItem.Trailing>
      </M3ListItem>

      <M3ListItem supportingText="Two unread comments in the component review thread.">
        <M3ListItem.Leading>
          <M3Icon name="chat" />
        </M3ListItem.Leading>
        Review updates
        <M3ListItem.Trailing>
          09:30
        </M3ListItem.Trailing>
      </M3ListItem>
    </M3List>
  ),
}

export const InteractiveSelection: Story = {
  args: {
    divided: true,
  },

  render: (args) => (
    <M3List {...args} aria-label="Folders">
      <M3ListItem selected={true} interactive={true}>
        <M3ListItem.Leading>
          <M3Icon name="inbox" />
        </M3ListItem.Leading>
        Inbox
        <M3ListItem.Trailing>
          24
        </M3ListItem.Trailing>
      </M3ListItem>

      <M3ListItem interactive={true}>
        <M3ListItem.Leading>
          <M3Icon name="send" />
        </M3ListItem.Leading>
        Sent
      </M3ListItem>

      <M3ListItem disabled={true} interactive={true}>
        <M3ListItem.Leading>
          <M3Icon name="archive" />
        </M3ListItem.Leading>
        Archive
      </M3ListItem>
    </M3List>
  ),
}
