import type { Meta, StoryObj } from '@storybook/vue3'

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

  render: (args: unknown, { globals }) => ({
    components: {
      M3Icon,
      M3List,
      M3ListItem,
    },

    setup () {
      return { args, text: localize(globals.locale, messages) }
    },

    template: `
        <M3List :aria-label="text.settings" v-bind="args">
            <M3ListItem>
                <template #leading>
                    <M3Icon name="wifi" />
                </template>

                Wi-Fi

                <template #trailing>
                    <M3Icon name="check" />
                </template>
            </M3ListItem>

            <M3ListItem :supporting-text="text.bluetoothSupport">
                <template #leading>
                    <M3Icon name="bluetooth" />
                </template>

                Bluetooth
            </M3ListItem>

            <M3ListItem href="javascript:void(0);">
                <template #leading>
                    <M3Icon name="notifications" />
                </template>

                {{ text.notifications }}

                <template #trailing>
                    <M3Icon name="chevron_right" />
                </template>
            </M3ListItem>
        </M3List>
    `,
  }),

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
  render: (args: unknown, { globals }) => ({
    components: {
      M3Divider,
      M3Icon,
      M3List,
      M3ListItem,
    },

    setup () {
      return { args, text: localize(globals.locale, messages) }
    },

    template: `
        <M3List :aria-label="text.settings" appearance="standard" v-bind="args">
            <M3ListItem interactive>
                <template #leading>
                    <M3Icon name="account_circle" />
                </template>

                {{ text.profile }}
            </M3ListItem>

            <M3ListItem interactive>
                <template #leading>
                    <M3Icon name="lock" />
                </template>

                {{ text.privacy }}
            </M3ListItem>

            <M3Divider />

            <M3ListItem interactive>
                <template #leading>
                    <M3Icon name="logout" />
                </template>

                {{ text.signOut }}
            </M3ListItem>
        </M3List>
    `,
  }),
}

export const SupportingText: Story = {
  render: (args: unknown, { globals }) => ({
    components: {
      M3Icon,
      M3List,
      M3ListItem,
    },

    setup () {
      return { args, text: localize(globals.locale, messages) }
    },

    template: `
        <M3List :aria-label="text.messages" v-bind="args">
            <M3ListItem
                :overline="text.today"
                :supporting-text="text.planningSupport"
            >
                <template #leading>
                    <M3Icon name="event" />
                </template>

                {{ text.planning }}

                <template #trailing>
                    14:12
                </template>
            </M3ListItem>

            <M3ListItem :supporting-text="text.reviewSupport">
                <template #leading>
                    <M3Icon name="chat" />
                </template>

                {{ text.review }}

                <template #trailing>
                    09:30
                </template>
            </M3ListItem>
        </M3List>
    `,
  }),
}

export const InteractiveSelection: Story = {
  render: (args: unknown, { globals }) => ({
    components: {
      M3Icon,
      M3List,
      M3ListItem,
    },

    setup () {
      return { args, text: localize(globals.locale, messages) }
    },

    template: `
        <M3List :aria-label="text.folders" v-bind="args">
            <M3ListItem interactive selected>
                <template #leading>
                    <M3Icon name="inbox" />
                </template>

                {{ text.inbox }}

                <template #trailing>
                    24
                </template>
            </M3ListItem>

            <M3ListItem interactive>
                <template #leading>
                    <M3Icon name="send" />
                </template>

                {{ text.sent }}
            </M3ListItem>

            <M3ListItem interactive disabled>
                <template #leading>
                    <M3Icon name="archive" />
                </template>

                {{ text.archive }}
            </M3ListItem>
        </M3List>
    `,
  }),
}
