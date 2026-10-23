import type { Meta, StoryObj } from '@storybook/react'

import { M3Icon } from '@/components/icon'
import { M3MenuItem } from '@/components/menu'
import { M3SplitButton } from '@/components/split-button'

import { localize } from '../i18n'

const messages = {
  'en-US': { send: 'Send', more: 'More sending options', schedule: 'Schedule send', draft: 'Save draft' },
  'ru-RU': { send: 'Отправить', more: 'Другие варианты отправки', schedule: 'Запланировать отправку', draft: 'Сохранить черновик' },
}

const meta = {
  title: 'Components/M3SplitButton',
  component: M3SplitButton,
  argTypes: {
    appearance: { control: 'select', options: ['elevated', 'filled', 'tonal', 'outlined', 'standard', 'text'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    menu: { control: false },
    open: { control: false },
    onToggle: { control: false },
    onAction: { control: false },
  },
  args: { appearance: 'filled', size: 'sm', menuLabel: 'More sending options', menu: null },
  render: (args, { globals }) => {
    const text = localize(globals.locale, messages)
    const props = {
      ...args,
      menuLabel: text.more,
      menu: ({ close }: { close: () => void }) => <>
        <M3MenuItem onClick={close}>{text.schedule}</M3MenuItem>
        <M3MenuItem onClick={close}>{text.draft}</M3MenuItem>
      </>,
    }
    return <div className="p-8" style={{ minHeight: 240 }}>
      <M3SplitButton {...props}>
        <M3Icon name="send" />{text.send}
      </M3SplitButton>
    </div>
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof M3SplitButton>

export default meta

type Story = StoryObj<typeof meta>

export const Filled: Story = {}
export const Elevated: Story = { args: { appearance: 'elevated' } }
export const Tonal: Story = { args: { appearance: 'tonal' } }
export const Outlined: Story = { args: { appearance: 'outlined' } }
export const Medium: Story = { args: { size: 'md' } }
export const ExtraLarge: Story = { args: { size: 'xl' } }
export const Open: Story = { args: { open: true } }
