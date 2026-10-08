import type { Meta, StoryObj } from '@storybook/react'

import { M3AppBar } from '@/components/app-bar'

import AppBarExample from '../examples/app-bar/AppBarExample'

const meta = {
  title: 'Components/M3AppBar',
  component: M3AppBar,
  args: { appearance: 'small', alignment: 'start', scroll: 'pinned' },
  argTypes: {
    appearance: { control: 'select', options: ['search', 'small', 'medium', 'medium-flexible', 'large', 'large-flexible'] },
    alignment: { control: 'select', options: ['start', 'center'] },
    scroll: { control: 'select', options: ['pinned', 'hide', 'collapse', 'transparent'] },
    scrollTarget: { control: false },
    headline: { control: false },
    subtitle: { control: false },
    headingLevel: { control: false },
  },
  render: (args, { globals }) => (
    <AppBarExample
      appearance={args.appearance ?? 'small'}
      scroll={args.scroll ?? 'pinned'}
      centered={args.alignment === 'center'}
      subtitle={args.appearance === 'small' || (args.appearance ?? '').includes('flexible')}
      locale={globals.locale}
    />
  ),
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof M3AppBar>

export default meta

type Story = StoryObj<typeof meta>

export const Search: Story = { args: { appearance: 'search' } }
export const Small: Story = {}
export const SmallCentered: Story = { args: { alignment: 'center' } }
export const Medium: Story = { args: { appearance: 'medium' } }
export const MediumFlexible: Story = { args: { appearance: 'medium-flexible', scroll: 'collapse' } }
export const Large: Story = { args: { appearance: 'large' } }
export const LargeFlexible: Story = { args: { appearance: 'large-flexible', scroll: 'collapse' } }
export const HideOnScroll: Story = { args: { scroll: 'hide' } }
export const TransparentOnScroll: Story = { args: { scroll: 'transparent' } }
