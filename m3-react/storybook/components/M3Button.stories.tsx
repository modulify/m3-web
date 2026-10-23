import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import React, { useState } from 'react'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'

import * as values from '@/components/button/values'

import { localize } from '../i18n'

const messages = {
  'en-US': { share: 'Share', favorite: 'Favorite', favoriteDisabled: 'Favorite, disabled' },
  'ru-RU': { share: 'Поделиться', favorite: 'Избранное', favoriteDisabled: 'Избранное, недоступно' },
}

const meta: Meta<typeof M3Button> = {
  title: 'Components/M3Button',

  component: M3Button,

  argTypes: {
    appearance: {
      control: 'select',
      options: values.appearances,
    },

    size: { control: 'select', options: values.sizes },
    rounding: { control: 'select', options: values.roundings },
    width: { control: 'select', options: ['auto', 'narrow', 'medium', 'wide'] },
    toggleable: { control: 'boolean' },
    selected: { control: 'boolean' },

    href: { control: 'text' },

    disabled: { control: 'boolean' },
  },

  args: {
    appearance: 'filled',
    size: 'sm',
    rounding: 'round',
    width: 'auto',
    toggleable: false,
    selected: false,
    disabled: false,
  },

  render: (args, { globals }) => (
    <M3Button {...args}>
      {localize(globals.locale, messages).share}
    </M3Button>
  ),

  parameters: {
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const WithTextOnly: Story = {}

export const WithLeadingIcon: Story = {
  render: (args, { globals }) => (
    <M3Button {...args}>
      <M3Icon name="share" /> {localize(globals.locale, messages).share}
    </M3Button>
  ),
}

export const IconOnly: Story = {
  args: { width: 'medium' },
  render: (args, { globals }) => (
    <M3Button aria-label={localize(globals.locale, messages).share} {...args}>
      <M3Icon name="share" />
    </M3Button>
  ),
}

export const Square: Story = { args: { rounding: 'square' } }

export const Toggleable: Story = {
  render: (args, { globals }) => {
    const Toggle = () => {
      const [selected, setSelected] = useState(false)
      const toggleArgs = { ...args, appearance: 'tonal' as const, toggleable: true, selected }

      return (
        <M3Button {...toggleArgs} onClick={() => setSelected(!selected)}>
          <M3Icon name="favorite" /> {localize(globals.locale, { 'en-US': 'Favorite', 'ru-RU': 'Избранное' })}
        </M3Button>
      )
    }

    return <Toggle />
  },
}

export const SizeMatrix: Story = {
  render: (_args, { globals }) => (
    <div className="flex-row flex-wrap gap-4">
      {values.sizes.map(size => (
        <M3Button key={size} size={size}>
          <M3Icon name="share" /> {localize(globals.locale, messages).share}
        </M3Button>
      ))}
    </div>
  ),
}

export const AppearanceMatrix: Story = {
  render: (_args, { globals }) => {
    const text = localize(globals.locale, messages)
    const stack = {
      display: 'grid',
      gap: '16px',
    } satisfies CSSProperties

    const row = {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
    } satisfies CSSProperties

    return (
      <div style={stack}>
        <div style={row}>
          {values.appearances.map(appearance => (
            <M3Button key={appearance} appearance={appearance}>
              {text.share}
            </M3Button>
          ))}
        </div>

        <div style={row}>
          {values.appearances.map(appearance => (
            <M3Button key={appearance} appearance={appearance}>
              <M3Icon name="share" /> {text.share}
            </M3Button>
          ))}
        </div>
      </div>
    )
  },
}

export const DisabledStates: Story = {
  render: (_args, { globals }) => {
    const text = localize(globals.locale, messages)
    const row = {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
    } satisfies CSSProperties

    return (
      <div style={row}>
        {values.appearances.map(appearance => (
          <M3Button key={appearance} appearance={appearance} disabled={true}>
            {text.share}
          </M3Button>
        ))}
      </div>
    )
  },
}

export const IconStandard: Story = {
  args: { width: 'medium', appearance: 'standard' },
  render: (args, { globals }) => (
    <M3Button aria-label={localize(globals.locale, messages).favorite} {...args}>
      <M3Icon name="favorite" />
    </M3Button>
  ),
}

export const IconSquare: Story = {
  args: { width: 'medium', rounding: 'square' },
  render: (args, { globals }) => (
    <M3Button aria-label={localize(globals.locale, messages).favorite} {...args}>
      <M3Icon name="favorite" />
    </M3Button>
  ),
}

export const IconSizeMatrix: Story = {
  render: (_args, { globals }) => (
    <div className="flex-row flex-wrap gap-4">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => (
        <M3Button key={size} size={size} appearance="tonal" aria-label={localize(globals.locale, messages).favorite} width="medium">
          <M3Icon name="favorite" />
        </M3Button>
      ))}
    </div>
  ),
}

export const IconWidthMatrix: Story = {
  render: (_args, { globals }) => (
    <div className="flex-row gap-4">
      {(['narrow', 'medium', 'wide'] as const).map(width => (
        <M3Button key={width} width={width} appearance="tonal" aria-label={localize(globals.locale, messages).favorite}>
          <M3Icon name="favorite" />
        </M3Button>
      ))}
    </div>
  ),
}

export const IconToggleable: Story = {
  args: { width: 'medium' },
  argTypes: {
    toggleable: { control: false },
    selected: { control: false },
  },
  render: ({
    toggleable: _toggleable,
    selected: _selected,
    onClick: _onClick,
    ...args
  }, { globals }) => {
    const IconButtonToggleable = () => {
      const [selected, setSelected] = useState(false)
      const buttonProps = {
        ...args,
        toggleable: true,
        selected,
        'aria-label': localize(globals.locale, messages).favorite,
      }

      return (
        <M3Button
          {...buttonProps}
          onClick={() => setSelected(current => !current)}
        >
          <M3Icon name="favorite" />
        </M3Button>
      )
    }

    return <IconButtonToggleable />
  },
}

export const IconAppearanceMatrix: Story = {
  render: (_args, { globals }) => {
    const text = localize(globals.locale, messages)
    const row = {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
    } satisfies CSSProperties

    const stack = {
      display: 'grid',
      gap: '16px',
    } satisfies CSSProperties

    const appearances = ['standard', 'filled', 'tonal', 'outlined'] as const

    return (
      <div style={stack}>
        <div style={row}>
          {appearances.map(appearance => (
            <M3Button key={appearance} appearance={appearance} aria-label={text.favorite} width="medium">
              <M3Icon name="favorite" />
            </M3Button>
          ))}
        </div>

        <div style={row}>
          {appearances.map(appearance => (
            <M3Button key={appearance}
              appearance={appearance}
              aria-label={text.favoriteDisabled}
              disabled={true}
              width="medium"
            >
              <M3Icon name="favorite" />
            </M3Button>
          ))}
        </div>
      </div>
    )
  },
}
