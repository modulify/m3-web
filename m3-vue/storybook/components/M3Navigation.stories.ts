import type { Meta, StoryObj } from '@storybook/vue3'

import { M3FabButton } from '@/components/fab-button'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'

import {
  M3Navigation,
  M3NavigationSection,
  M3NavigationTab,
} from '@/components/navigation'

import { ref } from 'vue'

const meta = {
  title: 'Components/M3Navigation',

  component: M3Navigation,

  argTypes: {
    appearance: {
      control: 'select',
      options: ['auto', 'bar', 'drawer', 'rail'],
    },

    alignment: {
      control: 'select',
      options: ['top', 'middle', 'bottom'],
    },
  },

  args: {
    appearance: 'auto',
    alignment: 'top',
  },

  // eslint-disable-next-line max-lines-per-function
  render: (args: unknown) => ({
    name: 'M3NavigationStory',

    components: {
      M3FabButton,
      M3Icon,
      M3IconButton,
      M3Navigation,
      M3NavigationSection,
      M3NavigationTab,
    },

    setup () {
      return {
        args,
        expanded: ref(false),
      }
    },

    template: `
        <M3Navigation
            v-model:expanded="expanded"
            v-bind="args"
        >
            <template #top>
                <M3IconButton
                    aria-label="Open menu"
                    @click="expanded = true"
                >
                    <M3Icon name="menu" />
                </M3IconButton>

                <M3FabButton variant="tertiary">
                    <M3Icon name="edit" />
                </M3FabButton>
            </template>

            <template #header>
                Mail
            </template>

            <M3NavigationTab label="Inbox" active>
                <M3Icon name="inbox" />

                <template #badge>
                    24
                </template>
            </M3NavigationTab>

            <M3NavigationTab label="Outbox">
                <M3Icon name="send" />
            </M3NavigationTab>

            <M3NavigationTab label="Favorites">
                <M3Icon name="favorite" />
            </M3NavigationTab>

            <M3NavigationTab label="Trash">
                <M3Icon name="delete" />
            </M3NavigationTab>

            <template #sections>
                <M3NavigationSection>
                    <template #header>
                        Personal folders
                    </template>

                    <M3NavigationTab label="Family">
                        <M3Icon name="folder" />
                    </M3NavigationTab>

                    <M3NavigationTab label="Wedding">
                        <M3Icon name="folder" />
                    </M3NavigationTab>
                </M3NavigationSection>
            </template>
        </M3Navigation>
    `,
  }),

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3Navigation>

export default meta

type Story = StoryObj<typeof meta>

export const NavigationDrawer: Story = {
  args: {
    appearance: 'drawer',
  },
}

export const NavigationRail: Story = {
  args: {
    appearance: 'rail',
  },
}
