import type { Meta, StoryObj } from '@storybook/vue3'

import { M3Button } from '@/components/button'
import { M3Card } from '@/components/card'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'

import { localize } from '../i18n'

const messages = {
  'en-US': {
    cardEmphasis: 'Card emphasis',
    enabled: 'Enabled',
    header: 'Header',
    supportingText: 'Supporting text for the current card style.',
    subhead: 'Subhead',
    title: 'Title',
  },
  'ru-RU': {
    cardEmphasis: 'Акцент карточки',
    enabled: 'Доступно',
    header: 'Заголовок',
    supportingText: 'Поясняющий текст для текущего стиля карточки.',
    subhead: 'Подзаголовок',
    title: 'Название',
  },
}

const meta = {
  title: 'Components/M3Card',

  component: M3Card,

  argTypes: {
    appearance: {
      control: 'select',
      options: ['elevated', 'filled', 'outlined'],
    },
  },

  args: {
    appearance: 'filled',
  },

  render: (args: unknown, { globals }) => ({
    components: {
      M3Button,
      M3Card,
    },

    setup () {
      return { args, text: localize(globals.locale, messages) }
    },

    template: `
        <M3Card v-bind="args" landscape>
            <template #media>
                <img alt="" src="/assets/image-80x80.png">
            </template>

            <template #heading>
                {{ text.header }}
            </template>

            <template #subheading>
                {{ text.subhead }}
            </template>
        </M3Card>
    `,
  }),

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3Button>

export default meta

type Story = StoryObj<typeof meta>

export const Landscape: Story = {}

export const LandscapeWithoutMedia: Story = {
  render: (args: unknown, { globals }) => ({
    components: {
      M3Button,
      M3Card,
      M3Icon,
      M3IconButton,
    },

    setup () {
      return { args, text: localize(globals.locale, messages) }
    },

    template: `
        <M3Card v-bind="args" landscape>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="20" fill="#6750A4"/>
            </svg>

            <div class="m3-card__head">
                <div class="m3-card__heading">{{ text.header }}</div>
                <div class="m3-card__subheading">{{ text.subhead }}</div>
            </div>

            <M3IconButton class="ml-auto">
                <M3Icon name="more_vert" />
            </M3IconButton>
        </M3Card>
    `,
  }),
}

export const Portrait: Story = {
  render: (args: unknown, { globals }) => ({
    components: {
      M3Button,
      M3Card,
      M3Icon,
      M3IconButton,
    },

    setup () {
      return { args, text: localize(globals.locale, messages) }
    },

    template: `
        <M3Card v-bind="args">
            <template #media>
                <img alt="" src="/assets/image-720x376.png">
            </template>

            <template #heading>
                {{ text.title }}
            </template>

            <template #subheading>
                {{ text.subhead }}
            </template>

            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor

            <div style="display: flex; justify-content: flex-end; gap: 8px; width: 100%;">
                <M3Button appearance="outlined">
                    {{ text.enabled }}
                </M3Button>

                <M3Button>{{ text.enabled }}</M3Button>
            </div>
        </M3Card>
    `,
  }),
}

export const AppearanceMatrix: Story = {
  render: (_args, { globals }) => ({
    components: {
      M3Card,
    },

    setup () {
      return {
        appearances: ['filled', 'elevated', 'outlined'],
        text: localize(globals.locale, messages),
      }
    },

    template: `
        <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start;">
            <M3Card
                v-for="appearance in appearances"
                :key="appearance"
                :appearance="appearance"
                style="width: 220px;"
            >
                <template #heading>
                    {{ appearance }}
                </template>

                <template #subheading>
                    {{ text.cardEmphasis }}
                </template>

                {{ text.supportingText }}
            </M3Card>
        </div>
    `,
  }),
}
