import type { Appearance } from '@modulify/m3-foundation/types/components/navigation'
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
import { useBreakpoint } from '@/hooks'

import { localize } from '../i18n'
import NavigationStoryContent from '../examples/navigation/NavigationStoryContent'

const messages = {
  'en-US': { close: 'Close menu', compose: 'Compose', drafts: 'Drafts', family: 'Family', favorites: 'Favorites', inbox: 'Inbox', mail: 'Mail', open: 'Open menu', outbox: 'Outbox', personalFolders: 'Personal folders', trash: 'Trash', wedding: 'Wedding', work: 'Work' },
  'ru-RU': { close: 'Закрыть меню', compose: 'Написать', drafts: 'Черновики', family: 'Семья', favorites: 'Избранное', inbox: 'Входящие', mail: 'Почта', open: 'Открыть меню', outbox: 'Исходящие', personalFolders: 'Личные папки', trash: 'Корзина', wedding: 'Свадьба', work: 'Работа' },
}

const renderDestinations = (text: typeof messages['en-US']) => (
  <>
    <M3NavigationTab label={text.inbox} active>
      <M3Icon name="inbox" />
      <M3NavigationTab.Badge>24</M3NavigationTab.Badge>
    </M3NavigationTab>
    <M3NavigationTab label={text.drafts}><M3Icon name="drafts" /></M3NavigationTab>
    <M3NavigationTab label={text.outbox} badged><M3Icon name="send" /></M3NavigationTab>
    <M3NavigationTab label={text.favorites}><M3Icon name="favorite" /></M3NavigationTab>
    <M3NavigationTab label={text.trash}><M3Icon name="delete" /></M3NavigationTab>

    <M3NavigationSection>
      <M3NavigationSection.Header>{text.personalFolders}</M3NavigationSection.Header>
      <M3NavigationTab label={text.family}><M3Icon name="folder" /></M3NavigationTab>
      <M3NavigationTab label={text.wedding}><M3Icon name="folder" /></M3NavigationTab>
      <M3NavigationTab label={text.work}><M3Icon name="folder" /></M3NavigationTab>
    </M3NavigationSection>
  </>
)

const meta = {
  title: 'Components/M3Navigation',

  component: M3Navigation,

  argTypes: {
    appearance: {
      control: 'select',
      options: ['auto', 'bar', 'rail', 'rail-expanded', 'drawer'],
    },

    alignment: {
      control: 'select',
      options: ['top', 'middle', 'bottom'],
    },

    barLayout: {
      control: 'select',
      options: ['auto', 'vertical'],
    },

    railExpandedMode: {
      control: 'select',
      options: ['auto', 'standard', 'modal'],
    },
  },

  args: {
    appearance: 'auto',
    alignment: 'top',
    barLayout: 'auto',
  },

  render: ({
    appearance: requestedAppearance,
    expanded: _expanded,
    onToggle: _onToggle,
    ...args
  }, { globals }) => {
    const [expanded, setExpanded] = useState(false)
    const [collapsed, setCollapsed] = useState(false)
    const breakpoint = useBreakpoint()
    const text = localize(globals.locale, messages)
    const expandedByAppearance = requestedAppearance === 'rail-expanded'
      || (requestedAppearance === 'auto' && breakpoint.ge('large'))
    const appearance = expandedByAppearance && collapsed ? 'rail' : requestedAppearance
    const railExpanded = expandedByAppearance && !collapsed
      || expanded && (appearance === 'rail' || (appearance === 'auto' && breakpoint.ge('expanded')))

    const toggleRail = () => {
      if (expandedByAppearance) {
        setCollapsed(!collapsed)
        setExpanded(false)
      } else {
        setExpanded(!expanded)
      }
    }

    return (
      <>
        <M3Navigation
          expanded={expanded}
          appearance={appearance}
          {...args}
          onToggle={setExpanded}
        >
          <M3Navigation.Top>
            <M3IconButton aria-label={railExpanded ? text.close : text.open} onClick={toggleRail}>
              <M3Icon name={railExpanded ? 'menu_open' : 'menu'} />
            </M3IconButton>

            <M3FabButton variant="tertiary">
              <M3Icon name="edit" />
              {text.compose}
            </M3FabButton>
          </M3Navigation.Top>

          <M3Navigation.Header>
            {text.mail}
          </M3Navigation.Header>

          {renderDestinations(text)}
        </M3Navigation>
        <NavigationStoryContent locale={globals.locale} appearance={appearance} />
      </>
    )
  },

  parameters: {
    layout: 'fullscreen',
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

export const NavigationRailExpanded: Story = {
  args: { appearance: 'rail-expanded' },
  render: (_args, { globals }) => {
    const [appearance, setAppearance] = useState<Appearance>('rail-expanded')
    const text = localize(globals.locale, messages)

    return (
      <>
        <M3Navigation appearance={appearance}>
          <M3Navigation.Top>
            <M3IconButton
              aria-label={appearance === 'rail-expanded' ? text.close : text.open}
              onClick={() => setAppearance(appearance === 'rail-expanded' ? 'rail' : 'rail-expanded')}
            >
              <M3Icon name={appearance === 'rail-expanded' ? 'menu_open' : 'menu'} />
            </M3IconButton>
            <M3FabButton variant="tertiary"><M3Icon name="edit" />{text.compose}</M3FabButton>
          </M3Navigation.Top>
          {renderDestinations(text)}
        </M3Navigation>
        <NavigationStoryContent locale={globals.locale} appearance={appearance} />
      </>
    )
  },
}

export const ModalNavigationRail: Story = {
  args: { appearance: 'rail', railExpandedMode: 'modal' },
  render: (_args, { globals }) => {
    const [expanded, setExpanded] = useState(true)
    const text = localize(globals.locale, messages)

    return (
      <>
        <M3Navigation appearance="rail" railExpandedMode="modal" expanded={expanded} onToggle={setExpanded}>
          <M3Navigation.Top>
            <M3IconButton aria-label={expanded ? text.close : text.open} onClick={() => setExpanded(!expanded)}>
              <M3Icon name={expanded ? 'menu_open' : 'menu'} />
            </M3IconButton>
          </M3Navigation.Top>
          {renderDestinations(text)}
        </M3Navigation>
        <NavigationStoryContent locale={globals.locale} appearance="rail" />
      </>
    )
  },
}

export const ImmersiveNavigationRail: Story = {
  args: { appearance: 'rail', hideWhenCollapsed: true, railExpandedMode: 'modal' },
  render: (_args, { globals }) => {
    const [expanded, setExpanded] = useState(false)
    const text = localize(globals.locale, messages)

    return (
      <>
        <M3IconButton
          aria-label={text.open}
          style={{ position: 'fixed', insetInlineStart: 28, insetBlockStart: 44 }}
          onClick={() => setExpanded(true)}
        >
          <M3Icon name="menu" />
        </M3IconButton>
        <M3Navigation appearance="rail" railExpandedMode="modal" expanded={expanded} hideWhenCollapsed onToggle={setExpanded}>
          <M3Navigation.Top>
            <M3IconButton aria-label={text.close} onClick={() => setExpanded(false)}>
              <M3Icon name="menu_open" />
            </M3IconButton>
          </M3Navigation.Top>
          {renderDestinations(text)}
        </M3Navigation>
        <NavigationStoryContent locale={globals.locale} appearance="rail" topAction />
      </>
    )
  },
}

export const NavigationBar: Story = {
  args: {
    appearance: 'bar',
  },
}

export const VerticalNavigationBar: Story = {
  args: {
    appearance: 'bar',
    barLayout: 'vertical',
  },
}

export const AdaptiveNavigation: Story = {
  args: {
    appearance: 'auto',
  },
}

export const ModalNavigationDrawer: Story = {
  render: ({
    appearance: _appearance,
    expanded: _expanded,
    onToggle: _onToggle,
    ...args
  }, { globals }) => {
    const [expanded, setExpanded] = useState(true)
    const text = localize(globals.locale, messages)

    return (
      <>
        <M3Navigation
          expanded={expanded}
          appearance={expanded ? 'drawer' : 'rail'}
          {...args}
          onToggle={setExpanded}
        >
          <M3Navigation.Top>
            <M3IconButton aria-label={expanded ? text.close : text.open} onClick={() => setExpanded(!expanded)}>
              <M3Icon name={expanded ? 'menu_open' : 'menu'} />
            </M3IconButton>
          </M3Navigation.Top>

          <M3Navigation.Header>
            {text.mail}
          </M3Navigation.Header>

          {renderDestinations(text)}
        </M3Navigation>
        <NavigationStoryContent locale={globals.locale} appearance="rail" />
      </>
    )
  },

  args: {
    appearance: 'drawer',
  },
}
