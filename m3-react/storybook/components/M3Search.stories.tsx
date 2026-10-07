import type { Meta, StoryObj } from '@storybook/react'

import { M3Search } from '@/components/search'

import SearchExample from '../examples/search/SearchExample'

const meta = {
  title: 'Components/M3Search',
  component: M3Search,
  args: {
    appearance: 'contained',
    layout: 'auto',
    query: '',
    label: 'Search your messages',
    status: '',
    open: false,
    onQueryChange: () => {},
    onOpenChange: () => {},
  },
  argTypes: {
    appearance: { control: 'select', options: ['contained', 'divided'] },
    layout: { control: 'select', options: ['auto', 'full-screen', 'docked'] },
    query: { control: false },
    open: { control: false },
    status: { control: false },
    onQueryChange: { control: false },
    onOpenChange: { control: false },
    onSubmit: { control: false },
  },
  render: (args, { globals }) => (
    <SearchExample appearance={args.appearance} layout={args.layout} locale={globals.locale} />
  ),
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof M3Search>

export default meta

type Story = StoryObj<typeof meta>

export const AdaptiveContained: Story = {}
export const DockedContained: Story = { args: { layout: 'docked' } }
export const FullScreenContained: Story = { args: { layout: 'full-screen' } }
export const DockedDivided: Story = { args: { layout: 'docked', appearance: 'divided' } }
export const FullScreenDivided: Story = { args: { layout: 'full-screen', appearance: 'divided' } }
export const ProgrammaticOpen: Story = {
  render: (args, { globals }) => (
    <SearchExample appearance={args.appearance} layout={args.layout} locale={globals.locale} externalTrigger />
  ),
}
export const InitiallyOpen: Story = {
  render: (args, { globals }) => (
    <SearchExample appearance={args.appearance} layout={args.layout} locale={globals.locale} initialOpen />
  ),
}
