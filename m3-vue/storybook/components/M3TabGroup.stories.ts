import type { Meta, StoryObj } from '@storybook/vue3'

import { M3Icon } from '@/components/icon'
import { M3Tab, M3TabGroup } from '@/components/tabs'

import { localize } from '../i18n'

const messages = {
  'en-US': {
    all: 'All',
    archived: 'Archived',
    drafts: 'Drafts',
    inbox: 'Inbox',
    inboxCount: 'Inbox, 24 unread messages',
    labels: 'Mail folders',
    photos: 'Photos',
    recent: 'Recent',
    shared: 'Shared',
    starred: 'Starred',
    trash: 'Trash',
  },
  'ru-RU': {
    all: 'Все',
    archived: 'Архив',
    drafts: 'Черновики',
    inbox: 'Входящие',
    inboxCount: 'Входящие, 24 непрочитанных сообщения',
    labels: 'Папки почты',
    photos: 'Фотографии',
    recent: 'Недавние',
    shared: 'Общие',
    starred: 'Избранные',
    trash: 'Корзина',
  },
}

const meta = {
  title: 'Components/M3TabGroup',
  component: M3TabGroup,
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary'] },
    layout: { control: 'select', options: ['fixed', 'scrollable'] },
  },
  args: { variant: 'primary', layout: 'fixed' },
  render: (args: unknown, { globals }) => ({
    components: { M3Icon, M3Tab, M3TabGroup },
    setup: () => ({ args, text: localize(globals.locale, messages) }),
    template: `
        <div style="width: min(640px, 90vw); background: var(--m3-sys-surface)">
            <M3TabGroup v-bind="args" :aria-label="text.labels">
                <M3Tab value="inbox" :label="text.inbox">{{ text.inbox }}</M3Tab>
                <M3Tab value="drafts" :label="text.drafts">{{ text.drafts }}</M3Tab>
                <M3Tab value="starred" :label="text.starred">{{ text.starred }}</M3Tab>
            </M3TabGroup>
        </div>
    `,
  }),
  parameters: { layout: 'centered' },
} satisfies Meta<typeof M3TabGroup>

export default meta
type Story = StoryObj<typeof meta>

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const PrimaryFixed: Story = {}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const SecondaryFixed: Story = { args: { variant: 'secondary' } }

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const Scrollable: Story = {
  args: { layout: 'scrollable' },
  render: (args: unknown, { globals }) => ({
    components: { M3Tab, M3TabGroup },
    setup: () => ({ args, text: localize(globals.locale, messages) }),
    template: `
        <div style="width: min(360px, 90vw); background: var(--m3-sys-surface)">
            <M3TabGroup v-bind="args" :aria-label="text.labels">
                <M3Tab value="all" :label="text.all">{{ text.all }}</M3Tab>
                <M3Tab value="recent" :label="text.recent">{{ text.recent }}</M3Tab>
                <M3Tab value="shared" :label="text.shared">{{ text.shared }}</M3Tab>
                <M3Tab value="archived" :label="text.archived">{{ text.archived }}</M3Tab>
                <M3Tab value="trash" :label="text.trash">{{ text.trash }}</M3Tab>
            </M3TabGroup>
        </div>
    `,
  }),
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const IconsAndBadges: Story = {
  render: (args: unknown, { globals }) => ({
    components: { M3Icon, M3Tab, M3TabGroup },
    setup: () => ({ args, text: localize(globals.locale, messages) }),
    template: `
        <div style="width: min(640px, 90vw); background: var(--m3-sys-surface)">
            <M3TabGroup v-bind="args" :aria-label="text.labels">
                <M3Tab value="inbox" :label="text.inbox" :aria-label="text.inboxCount" badge="24">
                    <template #icon><M3Icon name="inbox" /></template>
                    {{ text.inbox }}
                </M3Tab>
                <M3Tab value="drafts" :label="text.drafts">
                    <template #icon><M3Icon name="drafts" /></template>
                    {{ text.drafts }}
                </M3Tab>
                <M3Tab value="photos" :label="text.photos">
                    <template #icon><M3Icon name="image" /></template>
                    {{ text.photos }}
                </M3Tab>
            </M3TabGroup>
        </div>
    `,
  }),
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const IconOnly: Story = {
  render: (args: unknown, { globals }) => ({
    components: { M3Icon, M3Tab, M3TabGroup },
    setup: () => ({ args, text: localize(globals.locale, messages) }),
    template: `
        <div style="width: min(400px, 90vw); background: var(--m3-sys-surface)">
            <M3TabGroup v-bind="args" :aria-label="text.labels">
                <M3Tab value="inbox" :aria-label="text.inbox">
                    <template #icon><M3Icon name="inbox" /></template>
                    {{ text.inbox }}
                </M3Tab>
                <M3Tab value="drafts" :aria-label="text.drafts">
                    <template #icon><M3Icon name="drafts" /></template>
                    {{ text.drafts }}
                </M3Tab>
                <M3Tab value="photos" :aria-label="text.photos">
                    <template #icon><M3Icon name="image" /></template>
                    {{ text.photos }}
                </M3Tab>
            </M3TabGroup>
        </div>
    `,
  }),
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const UrlNavigation: Story = {
  args: { navigation: 'query', queryKey: 'section' },
}
