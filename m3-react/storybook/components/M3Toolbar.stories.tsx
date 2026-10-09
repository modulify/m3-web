import type { Meta, StoryObj } from '@storybook/react'

import { M3Toolbar } from '@/components/toolbar'

import ToolbarExample from '../examples/toolbar/ToolbarExample'

const meta = {
  title: 'Components/M3Toolbar',
  component: M3Toolbar,
  args: { label: 'Editing tools', variant: 'docked', orientation: 'horizontal', color: 'standard', side: 'end', scroll: 'pinned' },
  argTypes: {
    variant: { control: 'select', options: ['docked', 'floating'] },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    color: { control: 'select', options: ['standard', 'vibrant'] },
    side: { control: 'select', options: ['start', 'end'] },
    scroll: { control: 'select', options: ['pinned', 'hide', 'collapse'] },
    actions: { control: false },
    scrollTarget: { control: false },
    overflowLabel: { control: false },
  },
  render: (args, { globals }) => <ToolbarExample
    variant={args.variant ?? 'docked'}
    orientation={args.orientation ?? 'horizontal'}
    color={args.color ?? 'standard'}
    side={args.side ?? 'end'}
    scroll={args.scroll ?? 'pinned'}
    locale={globals.locale}
  />,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof M3Toolbar>

export default meta

type Story = StoryObj<typeof meta>

export const Docked: Story = {}
export const DockedVibrant: Story = { args: { color: 'vibrant' } }
export const Floating: Story = { args: { variant: 'floating' } }
export const FloatingVibrant: Story = { args: { variant: 'floating', color: 'vibrant' } }
export const VerticalFloating: Story = { args: { variant: 'floating', orientation: 'vertical' } }
export const HideOnScroll: Story = { args: { variant: 'floating', scroll: 'hide' } }
export const CollapseOnScroll: Story = { args: { variant: 'floating', scroll: 'collapse' } }
export const NarrowOverflow: Story = {
  args: { variant: 'floating' },
  render: (args, { globals }) => <ToolbarExample
    variant={args.variant ?? 'floating'}
    orientation={args.orientation ?? 'horizontal'}
    color={args.color ?? 'standard'}
    side={args.side ?? 'end'}
    scroll={args.scroll ?? 'pinned'}
    locale={globals.locale}
    narrow
  />,
}
