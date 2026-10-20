import type { Meta, StoryObj } from '@storybook/react'

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
  render: (args, { globals }) => {
    const first = localize(globals.locale, { 'en-US': 'First section', 'ru-RU': 'Первый раздел' })
    const second = localize(globals.locale, { 'en-US': 'Second section', 'ru-RU': 'Второй раздел' })
    const vertical = args.orientation === 'vertical'

    return (
      <div style={{ display: vertical ? 'flex' : 'block', width: '420px', height: vertical ? '160px' : undefined, padding: '24px', borderRadius: '16px', background: 'var(--m3-sys-surface-container-low)' }}>
        <div style={{ flex: 1, padding: vertical ? '12px' : '12px 0' }}>{first}</div>
        <M3Divider {...args} />
        <div style={{ flex: 1, padding: vertical ? '12px' : '12px 0' }}>{second}</div>
      </div>
    )
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof M3Divider>

export default meta

type Story = StoryObj<typeof meta>

export const FullWidth: Story = {}
export const StartInset: Story = { args: { inset: 'start' } }
export const MiddleInset: Story = { args: { inset: 'middle' } }
export const EndInset: Story = { args: { inset: 'end' } }
export const Vertical: Story = { args: { orientation: 'vertical' } }
export const Semantic: Story = { args: { role: 'separator' } }
