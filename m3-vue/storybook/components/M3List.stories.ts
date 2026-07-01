import type { Meta, StoryObj } from '@storybook/vue3'

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

  render: (args: unknown) => ({
    components: {
      M3Icon,
      M3List,
      M3ListItem,
    },

    setup () {
      return { args }
    },

    template: `
        <M3List v-bind="args" aria-label="Settings">
            <M3ListItem>
                <template #leading>
                    <M3Icon name="wifi" />
                </template>

                Wi-Fi

                <template #trailing>
                    On
                </template>
            </M3ListItem>

            <M3ListItem supporting-text="Connected to office network">
                <template #leading>
                    <M3Icon name="bluetooth" />
                </template>

                Bluetooth
            </M3ListItem>

            <M3ListItem href="#notifications">
                <template #leading>
                    <M3Icon name="notifications" />
                </template>

                Notifications

                <template #trailing>
                    <M3Icon name="chevron_right" />
                </template>
            </M3ListItem>
        </M3List>
    `,
  }),

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3List>

export default meta

type Story = StoryObj<typeof meta>

export const Standard: Story = {}

export const SupportingText: Story = {
  render: (args: unknown) => ({
    components: {
      M3Icon,
      M3List,
      M3ListItem,
    },

    setup () {
      return { args }
    },

    template: `
        <M3List v-bind="args" aria-label="Messages">
            <M3ListItem
                overline="Today"
                supporting-text="Design sync moved to 15:00. Review the agenda before joining."
            >
                <template #leading>
                    <M3Icon name="event" />
                </template>

                Planning meeting

                <template #trailing>
                    14:12
                </template>
            </M3ListItem>

            <M3ListItem supporting-text="Two unread comments in the component review thread.">
                <template #leading>
                    <M3Icon name="chat" />
                </template>

                Review updates

                <template #trailing>
                    09:30
                </template>
            </M3ListItem>
        </M3List>
    `,
  }),
}

export const InteractiveSelection: Story = {
  args: {
    divided: true,
  },

  render: (args: unknown) => ({
    components: {
      M3Icon,
      M3List,
      M3ListItem,
    },

    setup () {
      return { args }
    },

    template: `
        <M3List v-bind="args" aria-label="Folders">
            <M3ListItem selected interactive>
                <template #leading>
                    <M3Icon name="inbox" />
                </template>

                Inbox

                <template #trailing>
                    24
                </template>
            </M3ListItem>

            <M3ListItem interactive>
                <template #leading>
                    <M3Icon name="send" />
                </template>

                Sent
            </M3ListItem>

            <M3ListItem disabled interactive>
                <template #leading>
                    <M3Icon name="archive" />
                </template>

                Archive
            </M3ListItem>
        </M3List>
    `,
  }),
}
