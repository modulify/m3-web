import type { Appearance } from '@modulify/m3-foundation/types/components/navigation'
import type { Meta, StoryObj } from '@storybook/react'

import { useEffect, useState } from 'react'

import { M3FabButton } from '@/components/fab-button'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'
import {
  M3Navigation,
  M3NavigationSection,
  M3NavigationTab,
} from '@/components/navigation'
import { useBreakpoint, useM3Adaptive } from '@/hooks'

import { localize } from '../i18n'
import NavigationStoryContent from '../examples/navigation/NavigationStoryContent'

const messages = {
  'en-US': { bar: { drafts: 'Drafts', favorites: 'Favorites', inbox: 'Inbox', outbox: 'Outbox', trash: 'Trash' }, close: 'Close menu', compose: 'Compose', drafts: 'Drafts', family: 'Family', favorites: 'Favorites', inbox: 'Inbox', mail: 'Mail', open: 'Open menu', outbox: 'Outbox', personalFolders: 'Personal folders', trash: 'Trash', wedding: 'Wedding', work: 'Work' },
  'ru-RU': { bar: { drafts: 'Черн.', favorites: 'Избр.', inbox: 'Почта', outbox: 'Исход.', trash: 'Корзина' }, close: 'Закрыть меню', compose: 'Написать', drafts: 'Черновики', family: 'Семья', favorites: 'Избранное', inbox: 'Входящие', mail: 'Почта', open: 'Открыть меню', outbox: 'Исходящие', personalFolders: 'Личные папки', trash: 'Корзина', wedding: 'Свадьба', work: 'Работа' },
}

type StoryText = typeof messages['en-US']
type DestinationLabels = Pick<StoryText, 'inbox' | 'drafts' | 'outbox' | 'favorites' | 'trash'>

const accessibleLabel = (label: string, full: string) => label === full ? undefined : `${label} — ${full}`

const renderDestinations = (text: StoryText, labels: DestinationLabels = text) => (
  <>
    <M3NavigationTab label={labels.inbox} aria-label={accessibleLabel(labels.inbox, text.inbox)} active>
      <M3Icon name="inbox" />
      <M3NavigationTab.Badge>24</M3NavigationTab.Badge>
    </M3NavigationTab>
    <M3NavigationTab label={labels.drafts} aria-label={accessibleLabel(labels.drafts, text.drafts)}><M3Icon name="drafts" /></M3NavigationTab>
    <M3NavigationTab label={labels.outbox} aria-label={accessibleLabel(labels.outbox, text.outbox)} badged><M3Icon name="send" /></M3NavigationTab>
    <M3NavigationTab label={labels.favorites} aria-label={accessibleLabel(labels.favorites, text.favorites)}><M3Icon name="favorite" /></M3NavigationTab>
    <M3NavigationTab label={labels.trash} aria-label={accessibleLabel(labels.trash, text.trash)}><M3Icon name="delete" /></M3NavigationTab>

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
      options: ['auto', 'bar', 'bar-vertical', 'rail', 'rail-expanded', 'drawer'],
    },

    alignment: {
      control: 'select',
      options: ['top', 'middle', 'bottom'],
    },

    expansion: {
      control: 'select',
      options: ['auto', 'standard', 'modal'],
    },
  },

  args: {
    appearance: 'auto',
    alignment: 'top',
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
    const adaptive = useM3Adaptive()
    const text = localize(globals.locale, messages)
    const barLabels = { ...text, ...text.bar }
    const labels = requestedAppearance === 'bar'
      ? adaptive(barLabels, { compact: text })
      : requestedAppearance === 'auto'
        ? adaptive(text, { medium: barLabels })
        : text
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

          {renderDestinations(text, labels)}
        </M3Navigation>
        <NavigationStoryContent locale={globals.locale} />
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
        <NavigationStoryContent locale={globals.locale} />
      </>
    )
  },
}

export const ModalNavigationRail: Story = {
  args: { appearance: 'rail', expansion: 'modal' },
  render: (_args, { globals }) => {
    const [expanded, setExpanded] = useState(true)
    const text = localize(globals.locale, messages)

    return (
      <>
        <M3Navigation appearance="rail" expansion="modal" expanded={expanded} onToggle={setExpanded}>
          <M3Navigation.Top>
            <M3IconButton aria-label={expanded ? text.close : text.open} onClick={() => setExpanded(!expanded)}>
              <M3Icon name={expanded ? 'menu_open' : 'menu'} />
            </M3IconButton>
          </M3Navigation.Top>
          {renderDestinations(text)}
        </M3Navigation>
        <NavigationStoryContent locale={globals.locale} />
      </>
    )
  },
}

export const ImmersiveNavigationRail: Story = {
  args: { appearance: 'rail', collapse: 'hidden', expansion: 'modal' },
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
        <M3Navigation appearance="rail" expansion="modal" expanded={expanded} collapse="hidden" onToggle={setExpanded}>
          <M3Navigation.Top>
            <M3IconButton aria-label={text.close} onClick={() => setExpanded(false)}>
              <M3Icon name="menu_open" />
            </M3IconButton>
          </M3Navigation.Top>
          {renderDestinations(text)}
        </M3Navigation>
        <NavigationStoryContent locale={globals.locale} topAction />
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
    appearance: 'bar-vertical',
  },
}

export const AdaptiveNavigation: Story = {
  args: {
    appearance: 'auto',
  },
}

export const AdaptiveWithoutBar: Story = {
  args: {
    appearance: 'auto',
    appearances: ['rail', 'rail-expanded'],
    expansion: 'modal',
  },
  render: (_args, { globals }) => {
    const [expanded, setExpanded] = useState(false)
    const [collapsed, setCollapsed] = useState(false)
    const breakpoint = useBreakpoint()
    const wide = breakpoint.ge('large')
    const text = localize(globals.locale, messages)

    useEffect(() => {
      if (wide) setExpanded(false)
    }, [wide])

    const railExpanded = wide ? !collapsed : expanded

    return (
      <>
        {!wide ? (
          <M3IconButton
            aria-label={text.open}
            style={{ position: 'fixed', insetInlineStart: 28, insetBlockStart: 44 }}
            onClick={() => setExpanded(true)}
          >
            <M3Icon name="menu" />
          </M3IconButton>
        ) : null}
        <M3Navigation
          appearance={wide && collapsed ? 'rail' : 'auto'}
          appearances={['rail', 'rail-expanded']}
          expansion="modal"
          expanded={expanded}
          collapse={wide ? 'rail' : 'hidden'}
          onToggle={setExpanded}
        >
          <M3Navigation.Top>
            <M3IconButton
              aria-label={railExpanded ? text.close : text.open}
              onClick={() => wide ? setCollapsed(!collapsed) : setExpanded(false)}
            >
              <M3Icon name={railExpanded ? 'menu_open' : 'menu'} />
            </M3IconButton>
          </M3Navigation.Top>
          {renderDestinations(text)}
        </M3Navigation>
        <NavigationStoryContent locale={globals.locale} topAction={!wide} />
      </>
    )
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
        <NavigationStoryContent locale={globals.locale} />
      </>
    )
  },

  args: {
    appearance: 'drawer',
  },
}
