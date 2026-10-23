import type { Meta, StoryObj } from '@storybook/react'

import { M3Divider } from '@/components/divider'
import { M3Icon } from '@/components/icon'
import { M3List, M3ListItem } from '@/components/list'

import { localize } from '../i18n'

const messages = {
  'en-US': {
    archive: 'Archive', bluetoothSupport: 'Connected to office network', folders: 'Folders',
    inbox: 'Inbox', messages: 'Messages', notifications: 'Notifications',
    planning: 'Planning meeting', planningSupport: 'Design sync moved to 15:00. Review the agenda before joining.',
    review: 'Review updates', reviewSupport: 'Two unread comments in the component review thread.',
    privacy: 'Privacy', profile: 'Profile', sent: 'Sent', settings: 'Settings',
    signOut: 'Sign out', today: 'Today',
  },
  'ru-RU': {
    archive: 'Архив', bluetoothSupport: 'Подключено к офисной сети', folders: 'Папки',
    inbox: 'Входящие', messages: 'Сообщения', notifications: 'Уведомления',
    planning: 'Планирование', planningSupport: 'Синхронизацию по дизайну перенесли на 15:00. Просмотрите повестку перед встречей.',
    review: 'Обновления ревью', reviewSupport: 'Два непрочитанных комментария в обсуждении компонентов.',
    privacy: 'Конфиденциальность', profile: 'Профиль', sent: 'Отправленные',
    settings: 'Настройки', signOut: 'Выйти', today: 'Сегодня',
  },
}

const meta = {
  title: 'Components/M3List',

  component: M3List,

  argTypes: {
    appearance: { control: 'select', options: ['standard', 'segmented'] },
  },

  render: (args, { globals }) => {
    const text = localize(globals.locale, messages)

    return <M3List aria-label={text.settings} {...args}>
      <M3ListItem>
        <M3ListItem.Leading>
          <M3Icon name="wifi" />
        </M3ListItem.Leading>
        Wi-Fi
        <M3ListItem.Trailing>
          <M3Icon name="check" />
        </M3ListItem.Trailing>
      </M3ListItem>

      <M3ListItem supportingText={text.bluetoothSupport}>
        <M3ListItem.Leading>
          <M3Icon name="bluetooth" />
        </M3ListItem.Leading>
        Bluetooth
      </M3ListItem>

      <M3ListItem href="javascript:void(0);">
        <M3ListItem.Leading>
          <M3Icon name="notifications" />
        </M3ListItem.Leading>
        {text.notifications}
        <M3ListItem.Trailing>
          <M3Icon name="chevron_right" />
        </M3ListItem.Trailing>
      </M3ListItem>
    </M3List>
  },

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3List>

export default meta

type Story = StoryObj<typeof meta>

export const Standard: Story = {}

export const Segmented: Story = {
  args: { appearance: 'segmented' },
}

export const WithDivider: Story = {
  render: (args, { globals }) => {
    const text = localize(globals.locale, messages)
    const listProps = { ...args, appearance: 'standard' as const }

    return <M3List aria-label={text.settings} {...listProps}>
      <M3ListItem interactive={true}>
        <M3ListItem.Leading>
          <M3Icon name="account_circle" />
        </M3ListItem.Leading>
        {text.profile}
      </M3ListItem>

      <M3ListItem interactive={true}>
        <M3ListItem.Leading>
          <M3Icon name="lock" />
        </M3ListItem.Leading>
        {text.privacy}
      </M3ListItem>

      <M3Divider />

      <M3ListItem interactive={true}>
        <M3ListItem.Leading>
          <M3Icon name="logout" />
        </M3ListItem.Leading>
        {text.signOut}
      </M3ListItem>
    </M3List>
  },
}

export const SupportingText: Story = {
  render: (args, { globals }) => {
    const text = localize(globals.locale, messages)

    return <M3List aria-label={text.messages} {...args}>
      <M3ListItem
        overline={text.today}
        supportingText={text.planningSupport}
      >
        <M3ListItem.Leading>
          <M3Icon name="event" />
        </M3ListItem.Leading>
        {text.planning}
        <M3ListItem.Trailing>
          14:12
        </M3ListItem.Trailing>
      </M3ListItem>

      <M3ListItem supportingText={text.reviewSupport}>
        <M3ListItem.Leading>
          <M3Icon name="chat" />
        </M3ListItem.Leading>
        {text.review}
        <M3ListItem.Trailing>
          09:30
        </M3ListItem.Trailing>
      </M3ListItem>
    </M3List>
  },
}

export const InteractiveSelection: Story = {
  render: (args, { globals }) => {
    const text = localize(globals.locale, messages)

    return <M3List aria-label={text.folders} {...args}>
      <M3ListItem interactive={true} selected={true}>
        <M3ListItem.Leading>
          <M3Icon name="inbox" />
        </M3ListItem.Leading>
        {text.inbox}
        <M3ListItem.Trailing>
          24
        </M3ListItem.Trailing>
      </M3ListItem>

      <M3ListItem interactive={true}>
        <M3ListItem.Leading>
          <M3Icon name="send" />
        </M3ListItem.Leading>
        {text.sent}
      </M3ListItem>

      <M3ListItem interactive={true} disabled={true}>
        <M3ListItem.Leading>
          <M3Icon name="archive" />
        </M3ListItem.Leading>
        {text.archive}
      </M3ListItem>
    </M3List>
  },
}
