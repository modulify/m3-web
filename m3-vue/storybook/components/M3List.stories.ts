import type { Meta, StoryObj } from '@storybook/vue3'

import { M3Icon } from '@/components/icon'
import { M3List, M3ListItem } from '@/components/list'

import { localize } from '../i18n'

const messages = {
  'en-US': { archive: 'Archive', bluetoothSupport: 'Connected to office network', folders: 'Folders', inbox: 'Inbox', messages: 'Messages', notifications: 'Notifications', on: 'On', planning: 'Planning meeting', planningSupport: 'Design sync moved to 15:00. Review the agenda before joining.', review: 'Review updates', reviewSupport: 'Two unread comments in the component review thread.', sent: 'Sent', settings: 'Settings', today: 'Today' },
  'ru-RU': { archive: 'Архив', bluetoothSupport: 'Подключено к офисной сети', folders: 'Папки', inbox: 'Входящие', messages: 'Сообщения', notifications: 'Уведомления', on: 'Включено', planning: 'Планирование', planningSupport: 'Синхронизацию по дизайну перенесли на 15:00. Просмотрите повестку перед встречей.', review: 'Обновления ревью', reviewSupport: 'Два непрочитанных комментария в обсуждении компонентов.', sent: 'Отправленные', settings: 'Настройки', today: 'Сегодня' },
}

const meta = {
  title: 'Components/M3List',

  component: M3List,

  argTypes: {
    divided: { control: 'boolean' },
  },

  args: {
    divided: false,
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
                    {{ text.on }}
                </template>
            </M3ListItem>

            <M3ListItem :supporting-text="text.bluetoothSupport">
                <template #leading>
                    <M3Icon name="bluetooth" />
                </template>

                Bluetooth
            </M3ListItem>

            <M3ListItem href="#notifications">
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
  args: {
    divided: true,
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
        <M3List :aria-label="text.folders" v-bind="args">
            <M3ListItem selected interactive>
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

            <M3ListItem disabled interactive>
                <template #leading>
                    <M3Icon name="archive" />
                </template>

                {{ text.archive }}
            </M3ListItem>
        </M3List>
    `,
  }),
}
