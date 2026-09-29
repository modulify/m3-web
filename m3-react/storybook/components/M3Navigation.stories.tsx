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

import { localize } from '../i18n'

const messages = {
  'en-US': { close: 'Close menu', drafts: 'Drafts', family: 'Family', favorites: 'Favorites', inbox: 'Inbox', mail: 'Mail', open: 'Open menu', outbox: 'Outbox', personalFolders: 'Personal folders', trash: 'Trash', wedding: 'Wedding' },
  'ru-RU': { close: 'Закрыть меню', drafts: 'Черновики', family: 'Семья', favorites: 'Избранное', inbox: 'Входящие', mail: 'Почта', open: 'Открыть меню', outbox: 'Исходящие', personalFolders: 'Личные папки', trash: 'Корзина', wedding: 'Свадьба' },
}

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

  render: ({
    expanded: _expanded,
    onToggle: _onToggle,
    ...args
  }, { globals }) => {
    const [expanded, setExpanded] = useState(false)
    const text = localize(globals.locale, messages)

    return (
      <M3Navigation
        expanded={expanded}
        {...args}
        onToggle={setExpanded}
      >
        <M3Navigation.Top>
          <M3IconButton aria-label={text.open} onClick={() => setExpanded(true)}>
            <M3Icon name="menu" />
          </M3IconButton>

          <M3FabButton variant="tertiary">
            <M3Icon name="edit" />
          </M3FabButton>
        </M3Navigation.Top>

        <M3Navigation.Header>
          {text.mail}
        </M3Navigation.Header>

        <M3NavigationTab label={text.inbox} active>
          <M3Icon name="inbox" />
          <M3NavigationTab.Badge>
            24
          </M3NavigationTab.Badge>
        </M3NavigationTab>

        <M3NavigationTab label={text.outbox}>
          <M3Icon name="send" />
        </M3NavigationTab>

        <M3NavigationTab label={text.favorites}>
          <M3Icon name="favorite" />
        </M3NavigationTab>

        <M3NavigationTab label={text.trash}>
          <M3Icon name="delete" />
        </M3NavigationTab>

        <M3NavigationSection>
          <M3NavigationSection.Header>
            {text.personalFolders}
          </M3NavigationSection.Header>

          <M3NavigationTab label={text.family}>
            <M3Icon name="folder" />
          </M3NavigationTab>

          <M3NavigationTab label={text.wedding}>
            <M3Icon name="folder" />
          </M3NavigationTab>
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

export const ModalNavigationDrawer: Story = {
  render: ({
    expanded: _expanded,
    onToggle: _onToggle,
    ...args
  }, { globals }) => {
    const [expanded, setExpanded] = useState(true)
    const text = localize(globals.locale, messages)

    return (
      <M3Navigation
        expanded={expanded}
        {...args}
        onToggle={setExpanded}
      >
        <M3Navigation.Top>
          <M3IconButton aria-label={text.close} onClick={() => setExpanded(false)}>
            <M3Icon name="menu" />
          </M3IconButton>
        </M3Navigation.Top>

        <M3Navigation.Header>
          {text.mail}
        </M3Navigation.Header>

        <M3NavigationTab label={text.inbox} active>
          <M3Icon name="inbox" />
        </M3NavigationTab>

        <M3NavigationTab label={text.drafts}>
          <M3Icon name="mail" />
        </M3NavigationTab>

        <M3NavigationTab label={text.trash}>
          <M3Icon name="delete" />
        </M3NavigationTab>
      </M3Navigation>
    )
  },

  args: {
    appearance: 'drawer',
  },
}
