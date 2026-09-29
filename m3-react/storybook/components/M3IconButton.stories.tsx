import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'

import { useRecord } from '@/hooks'

import { localize } from '../i18n'

const messages = {
  'en-US': { favorite: 'Favorite', favoriteDisabled: 'Favorite, disabled' },
  'ru-RU': { favorite: 'Избранное', favoriteDisabled: 'Избранное, недоступно' },
}

const meta: Meta<typeof M3IconButton> = {
  title: 'Components/M3IconButton',

  component: M3IconButton,

  argTypes: {
    appearance: {
      control: 'select',
      options: ['filled', 'outlined', 'standard', 'tonal'],
    },

    toggleable: {
      control: false,
    },

    selected: {
      control: false,
    },

    disabled: {
      control: 'boolean',
    },
  },

  args: {
    appearance: 'standard',
    disabled: false,
  },

  render: (args, { globals }) => (
    <M3IconButton aria-label={localize(globals.locale, messages).favorite} {...args}>
      <M3Icon name="favorite" />
    </M3IconButton>
  ),

  parameters: {
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Standard: Story = {}

export const Toggleable: Story = {
  render: ({
    toggleable: _toggleable,
    selected: _selected,
    onClick: _onClick,
    ...args
  }, { globals }) => {
    const M3IconButtonToggleable = () => {
      const state = useRecord({
        selected: false,
      }, ['selected'])

      return (
        <M3IconButton
          toggleable={true}
          selected={state.selected}
          aria-label={localize(globals.locale, messages).favorite}
          {...args}
          onClick={() => state.selected = !state.selected}
        >
          <M3Icon name="favorite" />
        </M3IconButton>
      )
    }

    return <M3IconButtonToggleable />
  },
}

export const AppearanceMatrix: Story = {
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
            <M3IconButton key={appearance} appearance={appearance} aria-label={text.favorite}>
              <M3Icon name="favorite" />
            </M3IconButton>
          ))}
        </div>

        <div style={row}>
          {appearances.map(appearance => (
            <M3IconButton
              key={appearance}
              appearance={appearance}
              aria-label={text.favoriteDisabled}
              disabled={true}
            >
              <M3Icon name="favorite" />
            </M3IconButton>
          ))}
        </div>
      </div>
    )
  },
}
