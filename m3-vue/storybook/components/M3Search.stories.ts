import type { Meta, StoryObj } from '@storybook/vue3'

import { M3Search } from '@/components/search'

import SearchExample from '../examples/search/SearchExample.vue'

const meta = {
  title: 'Components/M3Search',
  component: M3Search,
  args: {
    appearance: 'contained',
    layout: 'auto',
    query: '',
    open: false,
    label: 'Search your messages',
    status: '',
  },
  argTypes: {
    appearance: { control: 'select', options: ['contained', 'divided'] },
    layout: { control: 'select', options: ['auto', 'full-screen', 'docked'] },
  },
  render: (args: Record<string, unknown>, { globals }) => ({
    components: { SearchExample },
    setup: () => ({ appearance: args.appearance, layout: args.layout, locale: globals.locale }),
    template: '<SearchExample :appearance="appearance" :layout="layout" :locale="locale" />',
  }),
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
  render: (args: Record<string, unknown>, { globals }) => ({
    components: { SearchExample },
    setup: () => ({ appearance: args.appearance, layout: args.layout, locale: globals.locale }),
    template: '<SearchExample :appearance="appearance" :layout="layout" :locale="locale" external-trigger />',
  }),
}
export const InitiallyOpen: Story = {
  render: (args: Record<string, unknown>, { globals }) => ({
    components: { SearchExample },
    setup: () => ({ appearance: args.appearance, layout: args.layout, locale: globals.locale }),
    template: '<SearchExample :appearance="appearance" :layout="layout" :locale="locale" initial-open />',
  }),
}
