import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import React from 'react'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'

import * as values from '@/components/button/values'

import { localize } from '../i18n'

const messages = {
  'en-US': { share: 'Share' },
  'ru-RU': { share: 'Поделиться' },
}

const meta: Meta<typeof M3Button> = {
  title: 'Components/M3Button',

  component: M3Button,

  argTypes: {
    appearance: {
      control: 'select',
      options: values.appearances,
    },

    href: { control: 'text' },

    disabled: { control: 'boolean' },
  },

  args: {
    appearance: 'filled',
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
