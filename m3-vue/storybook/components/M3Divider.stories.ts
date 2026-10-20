import type { Meta, StoryObj } from '@storybook/vue3'

import { M3Divider } from '@/components/divider'

import { localize } from '../i18n'

const meta = {
  title: 'Components/M3Divider',
  component: M3Divider,
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    inset: { control: 'select', options: ['none', 'start', 'end', 'middle'] },
  },
  args: { orientation: 'horizontal', inset: 'none' },
  render: (args: unknown, { globals }) => ({
    components: { M3Divider },
    setup () {
      return {
        args,
        first: localize(globals.locale, { 'en-US': 'First section', 'ru-RU': 'Первый раздел' }),
        second: localize(globals.locale, { 'en-US': 'Second section', 'ru-RU': 'Второй раздел' }),
      }
    },
    template: `
      <div
        :style="{
          display: args.orientation === 'vertical' ? 'flex' : 'block',
          width: '420px',
          height: args.orientation === 'vertical' ? '160px' : undefined,
          padding: '24px',
          borderRadius: '16px',
          background: 'var(--m3-sys-surface-container-low)',
        }"
      >
        <div :style="{ flex: 1, padding: args.orientation === 'vertical' ? '12px' : '12px 0' }">{{ first }}</div>
        <M3Divider v-bind="args" />
        <div :style="{ flex: 1, padding: args.orientation === 'vertical' ? '12px' : '12px 0' }">{{ second }}</div>
      </div>
    `,
  }),
  parameters: { layout: 'centered' },
} satisfies Meta<typeof M3Divider>

export default meta

type Story = StoryObj<typeof meta>

export const FullWidth: Story = {}
export const StartInset: Story = { args: { inset: 'start' } }
export const MiddleInset: Story = { args: { inset: 'middle' } }
export const EndInset: Story = { args: { inset: 'end' } }
export const Vertical: Story = { args: { orientation: 'vertical' } }
export const Semantic: Story = {
  render: (_args, { globals }) => ({
    components: { M3Divider },
    setup () {
      return {
        label: localize(globals.locale, { 'en-US': 'Sections', 'ru-RU': 'Разделы' }),
      }
    },
    template: '<M3Divider role="separator" :aria-label="label" style="width: 420px" />',
  }),
}
