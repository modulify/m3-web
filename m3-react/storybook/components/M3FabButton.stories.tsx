import type { Meta, StoryObj } from '@storybook/react'
import type { CSSProperties } from 'react'

import React from 'react'

import { M3FabButton } from '@/components/fab-button'
import { M3Icon } from '@/components/icon'

import * as values from '@/components/fab-button/values'

const meta: Meta<typeof M3FabButton> = {
  title: 'Components/M3FabButton',

  component: M3FabButton,

  argTypes: {
    variant: {
      control: 'select',
      options: values.variants,
    },

    size: {
      control: 'select',
      options: values.sizes,
    },

    disabled: {
      control: 'boolean',
    },
  },

  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
  },

  render: (args) => (
    <M3FabButton {...args} aria-label="Edit">
      <M3Icon name="edit" />
    </M3FabButton>
  ),

  parameters: {
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Standard: Story = {}

export const Extended: Story = {
  render: (args) => (
    <M3FabButton {...args}>
      <M3Icon name="edit" aria-hidden="true" /> Edit
    </M3FabButton>
  ),
}

export const VariantMatrix: Story = {
  render: () => {
    const stack = {
      display: 'grid',
      gap: '16px',
    } satisfies CSSProperties

    const row = {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      alignItems: 'center',
    } satisfies CSSProperties

    return (
      <div style={stack}>
        <div style={row}>
          {values.variants.map(variant => (
            <M3FabButton key={variant} variant={variant} aria-label={variant}>
              <M3Icon name="edit" />
            </M3FabButton>
          ))}
        </div>

        <div style={row}>
          {values.variants.map(variant => (
            <M3FabButton key={variant} variant={variant}>
              <M3Icon name="edit" /> New task
            </M3FabButton>
          ))}
        </div>
      </div>
    )
  },
}

export const SizeMatrix: Story = {
  render: () => {
    const row = {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      alignItems: 'center',
    } satisfies CSSProperties

    return (
      <div style={row}>
        {values.sizes.map(size => (
          <M3FabButton key={size} size={size} aria-label={size}>
            <M3Icon name="edit" />
          </M3FabButton>
        ))}
      </div>
    )
  },
}
