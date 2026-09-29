import type { Meta, StoryObj } from '@storybook/vue3'

import { ref } from 'vue'

import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'

import { localize } from '../i18n'

const messages = {
  'en-US': { favorite: 'Favorite', favoriteDisabled: 'Favorite, disabled' },
  'ru-RU': { favorite: 'Избранное', favoriteDisabled: 'Избранное, недоступно' },
}

const meta = {
  title: 'Components/M3IconButton',

  component: M3IconButton,

  argTypes: {
    appearance: {
      control: 'select',
      options: ['filled', 'outlined', 'standard', 'tonal'],
    },

    toggleable: {
      control: false,
    },

    selected: {
      control: false,
    },

    disabled: {
      control: 'boolean',
    },
  },

  args: {
    appearance: 'standard',
    disabled: false,
  },

  render: (args: unknown, { globals }) => ({
    components: {
      M3Icon,
      M3IconButton,
    },

    setup () {
      return {
        args,
        label: localize(globals.locale, messages).favorite,
      }
    },

    template: `
        <M3IconButton v-bind="args" :aria-label="label">
            <M3Icon name="favorite" />
        </M3IconButton>
    `,
  }),

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3IconButton>

export default meta

type Story = StoryObj<typeof meta>

export const Standard: Story = {}

export const Toggleable: Story = {
  render: (args: unknown, { globals }) => ({
    components: {
      M3Icon,
      M3IconButton,
    },

    setup () {
      const selected = ref(false)

      return {
        args,
        label: localize(globals.locale, messages).favorite,
        selected,
      }
    },

    template: `
        <M3IconButton
            :selected="selected"
            v-bind="args"
            :aria-label="label"
            toggleable
            @click="selected = !selected"
        >
            <M3Icon name="favorite" />
        </M3IconButton>
    `,
  }),
}

export const AppearanceMatrix: Story = {
  render: (_args, { globals }) => ({
    components: {
      M3Icon,
      M3IconButton,
    },

    setup () {
      return {
        appearances: ['standard', 'filled', 'tonal', 'outlined'],
        text: localize(globals.locale, messages),
      }
    },

    template: `
        <div style="display: grid; gap: 16px;">
            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                <M3IconButton
                    v-for="appearance in appearances"
                    :key="appearance"
                    :appearance="appearance"
                    :aria-label="text.favorite"
                >
                    <M3Icon name="favorite" />
                </M3IconButton>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                <M3IconButton
                    v-for="appearance in appearances"
                    :key="appearance + '-disabled'"
                    :appearance="appearance"
                    :aria-label="text.favoriteDisabled"
                    disabled
                >
                    <M3Icon name="favorite" />
                </M3IconButton>
            </div>
        </div>
    `,
  }),
}
