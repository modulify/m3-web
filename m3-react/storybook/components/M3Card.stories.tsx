import type { Meta, StoryObj } from '@storybook/react'

import { M3Button } from '@/components/button'
import { M3Card } from '@/components/card'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'

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

  render: (args) => (
    <M3Card {...args} landscape>
      <M3Card.Media>
        <img alt="" src="/assets/image-80x80.png"/>
      </M3Card.Media>
      <M3Card.Heading>Header</M3Card.Heading>
      <M3Card.Subheading>Subhead</M3Card.Subheading>
    </M3Card>
  ),

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3Card>

export default meta

type Story = StoryObj<typeof meta>

export const Landscape: Story = {}

export const LandscapeWithoutMedia: Story = {
  render: (args) => (
    <M3Card aria-label="Header" {...args} landscape>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="#6750A4"/>
      </svg>

      <div className="m3-card__head">
        <div className="m3-card__heading">Header</div>
        <div className="m3-card__subheading">Subhead</div>
      </div>

      <M3IconButton className="ml-auto">
        <M3Icon name="more_vert" />
      </M3IconButton>
    </M3Card>
  ),
}

export const Portrait: Story = {
  render: (args) => (
    <M3Card {...args}>
      <M3Card.Media>
        <img alt="" src="/assets/image-720x376.png" />
      </M3Card.Media>

      <M3Card.Heading>
        Title
      </M3Card.Heading>

      <M3Card.Subheading>
        Subhead
      </M3Card.Subheading>

      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', width: '100%' }}>
        <M3Button appearance="outlined">
          Enabled
        </M3Button>

        <M3Button>
          Enabled
        </M3Button>
      </div>
    </M3Card>
  ),
}
