import type { Meta, StoryObj } from '@storybook/vue3'

import { M3AppBar } from '@/components/app-bar'

import AppBarExample from '../examples/app-bar/AppBarExample.vue'

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
  render: (args: Record<string, unknown>, { globals }) => ({
    components: { AppBarExample },
    setup: () => ({
      appearance: args.appearance,
      scroll: args.scroll,
      centered: args.alignment === 'center',
      subtitle: args.appearance === 'small' || String(args.appearance).includes('flexible'),
      locale: globals.locale,
    }),
    template: '<AppBarExample :appearance="appearance" :scroll="scroll" :centered="centered" :subtitle="subtitle" :locale="locale" />',
  }),
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
