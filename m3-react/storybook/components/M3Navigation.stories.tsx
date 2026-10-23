import type { Appearance } from '@modulify/m3-foundation/types/components/navigation'
import type { Meta, StoryObj } from '@storybook/react'

import { useEffect, useState } from 'react'

import { M3Button } from '@/components/button'
import { M3FabButton } from '@/components/fab-button'
import { M3Icon } from '@/components/icon'
import {
  M3Navigation,
  M3NavigationSection,
  M3NavigationTab,
} from '@/components/navigation'

import { useBreakpoint, useM3Adaptive } from '@/hooks'

import { localize } from '../i18n'

import NavigationStoryContent from '../examples/navigation/NavigationStoryContent'

import { messages } from './M3Navigation.i18n'

type StoryText = typeof messages['en-US']
type DestinationLabels = Pick<StoryText, 'inbox' | 'drafts' | 'outbox' | 'favorites' | 'trash'>
type NavigationStoryState = 'default' | 'expanded' | 'collapsed'
type NavigationStoryMenuProps = {
  text: StoryText
  labels?: DestinationLabels
}

const accessibleLabel = (label: string, full: string) => label === full ? undefined : `${label} — ${full}`

const NavigationStoryMenu = ({ text, labels = text }: NavigationStoryMenuProps) => (
  <>
    <M3NavigationTab
      label={labels.inbox}
      aria-label={accessibleLabel(labels.inbox, text.inbox)}
      active
    >
      <M3Icon name="inbox" />
      <M3NavigationTab.Badge>24</M3NavigationTab.Badge>
    </M3NavigationTab>

    <M3NavigationTab
      label={labels.drafts}
      aria-label={accessibleLabel(labels.drafts, text.drafts)}
    >
      <M3Icon name="drafts" />
    </M3NavigationTab>

    <M3NavigationTab
      label={labels.outbox}
      aria-label={accessibleLabel(labels.outbox, text.outbox)}
      badged
    >
      <M3Icon name="send" />
    </M3NavigationTab>

    <M3NavigationTab
      label={labels.favorites}
      aria-label={accessibleLabel(labels.favorites, text.favorites)}
    >
      <M3Icon name="favorite" />
    </M3NavigationTab>

    <M3NavigationTab
      label={labels.trash}
      aria-label={accessibleLabel(labels.trash, text.trash)}
    >
      <M3Icon name="delete" />
    </M3NavigationTab>

    <M3NavigationSection>
      <M3NavigationSection.Header>{text.personalFolders}</M3NavigationSection.Header>

      <M3NavigationTab label={text.family}>
        <M3Icon name="folder" />
      </M3NavigationTab>

      <M3NavigationTab label={text.wedding}>
        <M3Icon name="folder" />
      </M3NavigationTab>

      <M3NavigationTab label={text.work}>
        <M3Icon name="folder" />
      </M3NavigationTab>
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
    const text = localize(globals.locale, messages)
    const breakpoint = useBreakpoint()
    const adaptive = useM3Adaptive()

    const [state, setState] = useState<NavigationStoryState>('default')

    let labels: DestinationLabels = text
    if (requestedAppearance === 'bar') labels = adaptive({ ...text, ...text.bar }, { compact: text })
    if (requestedAppearance === 'auto') labels = adaptive(text, { medium: { ...text, ...text.bar } })
    const shouldExpand = requestedAppearance === 'rail-expanded'
      || requestedAppearance === 'auto' && breakpoint.ge('large')
    const appearance = shouldExpand && state === 'collapsed' ? 'rail' : requestedAppearance

    useEffect(() => setState('default'), [requestedAppearance, shouldExpand])

    const toggle = () => {
      if (shouldExpand) {
        setState(state === 'collapsed' ? 'default' : 'collapsed')
      } else {
        setState(state === 'expanded' ? 'default' : 'expanded')
      }
    }

    return (
      <>
        <M3Navigation
          expanded={!shouldExpand && state === 'expanded'}
          appearance={appearance}
          {...args}
          onToggle={value => setState(value ? 'expanded' : 'default')}
        >
          <M3Navigation.Top>
            {({ view }) => (
              <>
                <M3Button
                  aria-label={view.appearance === 'rail-expanded' ? text.close : text.open}
                  appearance="standard"
                  width="medium"
                  onClick={toggle}
                >
                  <M3Icon name={view.appearance === 'rail-expanded' ? 'menu_open' : 'menu'} />
                </M3Button>

                <M3FabButton variant="tertiary">
                  <M3Icon name="edit" />
                  {text.compose}
                </M3FabButton>
              </>
            )}
          </M3Navigation.Top>

          <M3Navigation.Header>
            {text.mail}
          </M3Navigation.Header>

          <NavigationStoryMenu text={text} labels={labels} />
        </M3Navigation>

        <NavigationStoryContent locale={globals.locale} />
      </>
    )
  },

  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof M3Navigation>

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export default meta

type Story = StoryObj<typeof meta>

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const NavigationDrawer: Story = {
  args: {
    appearance: 'drawer',
  },
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const NavigationRail: Story = {
  args: {
    appearance: 'rail',
  },
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const NavigationRailExpanded: Story = {
  args: { appearance: 'rail-expanded' },

  render: (_args, { globals }) => {
    const [appearance, setAppearance] = useState<Appearance>('rail-expanded')
    const text = localize(globals.locale, messages)

    return (
      <>
        <M3Navigation appearance={appearance}>
          <M3Navigation.Top>
            {({ view }) => (
              <>
                <M3Button
                  aria-label={view.appearance === 'rail-expanded' ? text.close : text.open}
                  appearance="standard"
                  width="medium"
                  onClick={() => setAppearance(appearance === 'rail-expanded' ? 'rail' : 'rail-expanded')}
                >
                  <M3Icon name={view.appearance === 'rail-expanded' ? 'menu_open' : 'menu'} />
                </M3Button>

                <M3FabButton variant="tertiary">
                  <M3Icon name="edit" />
                  {text.compose}
                </M3FabButton>
              </>
            )}
          </M3Navigation.Top>

          <NavigationStoryMenu text={text} />
        </M3Navigation>

        <NavigationStoryContent locale={globals.locale} />
      </>
    )
  },
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const ModalNavigationRail: Story = {
  args: { appearance: 'rail', expansion: 'modal' },

  render: (_args, { globals }) => {
    const [expanded, setExpanded] = useState(true)
    const text = localize(globals.locale, messages)

    return (
      <>
        <M3Navigation appearance="rail" expansion="modal" expanded={expanded} onToggle={setExpanded}>
          <M3Navigation.Top>
            {({ view }) => (
              <M3Button
                aria-label={view.appearance === 'rail-expanded' ? text.close : text.open}
                appearance="standard"
                width="medium"
                onClick={() => setExpanded(!expanded)}
              >
                <M3Icon name={view.appearance === 'rail-expanded' ? 'menu_open' : 'menu'} />
              </M3Button>
            )}
          </M3Navigation.Top>

          <NavigationStoryMenu text={text} />
        </M3Navigation>

        <NavigationStoryContent locale={globals.locale} />
      </>
    )
  },
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const ImmersiveNavigationRail: Story = {
  args: { appearance: 'rail', collapse: 'hidden', expansion: 'modal' },

  render: (_args, { globals }) => {
    const [expanded, setExpanded] = useState(false)
    const text = localize(globals.locale, messages)

    return (
      <>
        <M3Button
          aria-label={text.open}
          appearance="standard"
          style={{ position: 'fixed', insetInlineStart: 28, insetBlockStart: 44 }}
          width="medium"
          onClick={() => setExpanded(true)}
        >
          <M3Icon name="menu" />
        </M3Button>

        <M3Navigation
          appearance="rail"
          expansion="modal"
          expanded={expanded}
          collapse="hidden"
          onToggle={setExpanded}
        >
          <M3Navigation.Top>
            {({ view }) => (
              <M3Button
                aria-label={view.appearance === 'rail-expanded' ? text.close : text.open}
                appearance="standard"
                width="medium"
                onClick={() => setExpanded(false)}
              >
                <M3Icon name={view.appearance === 'rail-expanded' ? 'menu_open' : 'menu'} />
              </M3Button>
            )}
          </M3Navigation.Top>

          <NavigationStoryMenu text={text} />
        </M3Navigation>

        <NavigationStoryContent locale={globals.locale} topAction />
      </>
    )
  },
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const NavigationBar: Story = {
  args: {
    appearance: 'bar',
  },
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const VerticalNavigationBar: Story = {
  args: {
    appearance: 'bar-vertical',
  },
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const AdaptiveNavigation: Story = {
  args: {
    appearance: 'auto',
  },
  argTypes: {
    appearance: { control: false },
  },
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const AdaptiveWithoutBar: Story = {
  args: {
    appearance: 'auto',
    appearances: ['rail', 'rail-expanded'],
    expansion: 'modal',
  },

  render: (_args, { globals }) => {
    const text = localize(globals.locale, messages)
    const breakpoint = useBreakpoint()
    const wide = breakpoint.ge('large')

    const [state, setState] = useState<NavigationStoryState>('default')

    useEffect(() => setState('default'), [wide])

    const toggle = () => {
      if (wide) setState(state === 'collapsed' ? 'default' : 'collapsed')
      else setState('default')
    }

    return (
      <>
        {!wide ? (
          <M3Button
            aria-label={text.open}
            appearance="standard"
            style={{ position: 'fixed', insetInlineStart: 28, insetBlockStart: 44 }}
            width="medium"
            onClick={() => setState('expanded')}
          >
            <M3Icon name="menu" />
          </M3Button>
        ) : null}

        <M3Navigation
          appearance={wide && state === 'collapsed' ? 'rail' : 'auto'}
          appearances={['rail', 'rail-expanded']}
          expansion="modal"
          expanded={!wide && state === 'expanded'}
          collapse={wide ? 'rail' : 'hidden'}
          onToggle={value => setState(value ? 'expanded' : 'default')}
        >
          <M3Navigation.Top>
            {({ view }) => (
              <M3Button
                aria-label={view.appearance === 'rail-expanded' ? text.close : text.open}
                appearance="standard"
                width="medium"
                onClick={toggle}
              >
                <M3Icon name={view.appearance === 'rail-expanded' ? 'menu_open' : 'menu'} />
              </M3Button>
            )}
          </M3Navigation.Top>

          <NavigationStoryMenu text={text} />
        </M3Navigation>

        <NavigationStoryContent locale={globals.locale} topAction={!wide} />
      </>
    )
  },
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
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
            {({ view }) => (
              <M3Button
                aria-label={view.appearance === 'drawer' ? text.close : text.open}
                appearance="standard"
                width="medium"
                onClick={() => setExpanded(!expanded)}
              >
                <M3Icon name={view.appearance === 'drawer' ? 'menu_open' : 'menu'} />
              </M3Button>
            )}
          </M3Navigation.Top>

          <M3Navigation.Header>
            {text.mail}
          </M3Navigation.Header>

          <NavigationStoryMenu text={text} />
        </M3Navigation>

        <NavigationStoryContent locale={globals.locale} />
      </>
    )
  },

  args: {
    appearance: 'drawer',
  },
}
