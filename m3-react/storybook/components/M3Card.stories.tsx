import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { M3Button } from '@/components/button'
import { M3Card } from '@/components/card'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'

import { localize } from '../i18n'

const messages = {
  'en-US': {
    cardEmphasis: 'Card emphasis',
    enabled: 'Enabled',
    header: 'Header',
    supportingText: 'Supporting text for the current card style.',
    subhead: 'Subhead',
    title: 'Title',
  },
  'ru-RU': {
    cardEmphasis: 'Акцент карточки',
    enabled: 'Доступно',
    header: 'Заголовок',
    supportingText: 'Поясняющий текст для текущего стиля карточки.',
    subhead: 'Подзаголовок',
    title: 'Название',
  },
}

const meta = {
  title: 'Components/M3Card',

  component: M3Card,

  argTypes: {
    appearance: {
      control: 'select',
      options: ['elevated', 'filled', 'outlined'],
    },

    landscape: { control: false },
  },

  args: {
    appearance: 'filled',
  },

  render: (args, { globals }) => {
    const text = localize(globals.locale, messages)

    return <M3Card landscape {...args}>
      <M3Card.Media>
        <img alt="" src="/assets/image-80x80.png"/>
      </M3Card.Media>
      <M3Card.Heading>{text.header}</M3Card.Heading>
      <M3Card.Subheading>{text.subhead}</M3Card.Subheading>
    </M3Card>
  },

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3Card>

export default meta

type Story = StoryObj<typeof meta>

export const Landscape: Story = {}

export const LandscapeWithoutMedia: Story = {
  render: (args, { globals }) => {
    const text = localize(globals.locale, messages)

    return <M3Card aria-label={text.header} landscape {...args}>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="#6750A4"/>
      </svg>

      <div className="m3-card__head">
        <div className="m3-card__heading">{text.header}</div>
        <div className="m3-card__subheading">{text.subhead}</div>
      </div>

      <M3IconButton className="ml-auto">
        <M3Icon name="more_vert" />
      </M3IconButton>
    </M3Card>
  },
}

export const Portrait: Story = {
  render: (args, { globals }) => {
    const text = localize(globals.locale, messages)

    return <M3Card {...args}>
      <M3Card.Media>
        <img alt="" src="/assets/image-720x376.png" />
      </M3Card.Media>

      <M3Card.Heading>
        {text.title}
      </M3Card.Heading>

      <M3Card.Subheading>
        {text.subhead}
      </M3Card.Subheading>

      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', width: '100%' }}>
        <M3Button appearance="outlined">
          {text.enabled}
        </M3Button>

        <M3Button>
          {text.enabled}
        </M3Button>
      </div>
    </M3Card>
  },
}

export const AppearanceMatrix: Story = {
  render: (_args, { globals }) => {
    const text = localize(globals.locale, messages)
    const row = {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      alignItems: 'flex-start',
    } satisfies CSSProperties

    return (
      <div style={row}>
        {(['filled', 'elevated', 'outlined'] as const).map(appearance => (
          <M3Card key={appearance} appearance={appearance} style={{ width: '220px' }}>
            <M3Card.Heading>{appearance}</M3Card.Heading>
            <M3Card.Subheading>{text.cardEmphasis}</M3Card.Subheading>
            {text.supportingText}
          </M3Card>
        ))}
      </div>
    )
  },
}
