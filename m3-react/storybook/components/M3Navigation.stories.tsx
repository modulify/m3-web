import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { M3FabButton } from '@/components/fab-button'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'

import {
  M3Navigation,
  M3NavigationSection,
  M3NavigationTab,
} from '@/components/navigation'

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

  render: (args) => {
    const [expanded, setExpanded] = useState(false)

    return (
      <M3Navigation
        expanded={expanded}
        onToggle={setExpanded}
        {...args}
      >
        <M3Navigation.Top>
          <M3IconButton aria-label="Open menu" onClick={() => setExpanded(true)}>
            <M3Icon name="menu" />
          </M3IconButton>

          <M3FabButton variant="tertiary">
            <M3Icon name="edit" />
          </M3FabButton>
        </M3Navigation.Top>

        <M3Navigation.Header children={'Mail'} />

        <M3NavigationTab label="Inbox" active>
          <M3Icon name="inbox" />
          <M3NavigationTab.Badge children={24} />
        </M3NavigationTab>

        <M3NavigationTab label="Outbox" children={<M3Icon name="send" />} />
        <M3NavigationTab label="Favorites" children={<M3Icon name="favorite" />} />
        <M3NavigationTab label="Trash" children={<M3Icon name="delete" />} />

        <M3NavigationSection>
          <M3NavigationSection.Header children={'Personal folders'} />

          <M3NavigationTab label="Family" children={<M3Icon name="folder" />} />
          <M3NavigationTab label="Wedding" children={<M3Icon name="folder" />} />
        </M3NavigationSection>
      </M3Navigation>
    )
  },

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
