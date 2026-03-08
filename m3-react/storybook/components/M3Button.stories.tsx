import type { Meta, StoryObj } from '@storybook/react'

import React from 'react'
import type { CSSProperties } from 'react'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'

import * as values from '@/components/button/values'

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

  render: (args) => (
    <M3Button {...args}>
      Share
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
  render: (args) => (
    <M3Button {...args}>
      <M3Icon name="share" /> Share
    </M3Button>
  ),
}

export const AppearanceMatrix: Story = {
  render: () => {
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
              Share
            </M3Button>
          ))}
        </div>

        <div style={row}>
          {values.appearances.map(appearance => (
            <M3Button key={appearance} appearance={appearance}>
              <M3Icon name="share" /> Share
            </M3Button>
          ))}
        </div>
      </div>
    )
  },
}

export const DisabledStates: Story = {
  render: () => {
    const row = {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
    } satisfies CSSProperties

    return (
      <div style={row}>
        {values.appearances.map(appearance => (
          <M3Button key={appearance} appearance={appearance} disabled={true}>
            Share
          </M3Button>
        ))}
      </div>
    )
  },
}
