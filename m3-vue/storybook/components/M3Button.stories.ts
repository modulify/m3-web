import type { Meta, StoryObj } from '@storybook/vue3'

import { ref } from 'vue'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'

import * as values from '@/components/button/values'

import { localize } from '../i18n'

const messages = {
  'en-US': { share: 'Share', favorite: 'Favorite', favoriteDisabled: 'Favorite, disabled' },
  'ru-RU': { share: 'Поделиться', favorite: 'Избранное', favoriteDisabled: 'Избранное, недоступно' },
}

const meta = {
  title: 'Components/M3Button',

  component: M3Button,

  argTypes: {
    appearance: {
      control: 'select',
      options: values.appearances,
    },

    size: { control: 'select', options: values.sizes },
    rounding: { control: 'select', options: values.roundings },
    width: { control: 'select', options: ['auto', 'narrow', 'medium', 'wide'] },
    toggleable: { control: 'boolean' },
    selected: { control: 'boolean' },

    disabled: {
      control: 'boolean',
    },
  },

  args: {
    appearance: 'filled',
    size: 'sm',
    rounding: 'round',
    width: 'auto',
    toggleable: false,
    selected: false,
    disabled: false,
  },

  render: (args: unknown, { globals }) => ({
    components: {
      M3Button,
    },

    setup () {
      return {
        args,
        label: localize(globals.locale, messages).share,
      }
    },

    template: '<M3Button v-bind="args">{{ label }}</M3Button>',
  }),

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3Button>

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export default meta

type Story = StoryObj<typeof meta>

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const WithTextOnly: Story = {}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const WithLeadingIcon: Story = {
  render: (args: unknown, { globals }) => ({
    components: {
      M3Button,
      M3Icon,
    },

    setup () {
      return {
        args,
        label: localize(globals.locale, messages).share,
      }
    },

    template: `
        <M3Button v-bind="args">
            <M3Icon name="share" />
            {{ label }}
        </M3Button>
    `,
  }),
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const IconOnly: Story = {
  args: { width: 'medium' },
  render: (args: unknown, { globals }) => ({
    components: { M3Button, M3Icon },
    setup () {
      return { args, label: localize(globals.locale, messages).share }
    },
    template: `
        <M3Button v-bind="args" :aria-label="label">
            <M3Icon name="share" />
        </M3Button>
    `,
  }),
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const Square: Story = { args: { rounding: 'square' } }

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const Toggleable: Story = {
  render: (args: unknown, { globals }) => ({
    components: { M3Button, M3Icon },
    setup () {
      const selected = ref(false)
      return { args, selected, label: localize(globals.locale, { 'en-US': 'Favorite', 'ru-RU': 'Избранное' }) }
    },
    template: '<M3Button v-bind="args" appearance="tonal" toggleable :selected="selected" @click="selected = !selected"><M3Icon name="favorite" />{{ label }}</M3Button>',
  }),
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const SizeMatrix: Story = {
  render: (_args, { globals }) => ({
    components: { M3Button, M3Icon },
    setup () {
      return { sizes: values.sizes, label: localize(globals.locale, messages).share }
    },
    template: '<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 16px;"><M3Button v-for="size in sizes" :key="size" :size="size"><M3Icon name="share" />{{ label }}</M3Button></div>',
  }),
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const AppearanceMatrix: Story = {
  render: (_args, { globals }) => ({
    components: {
      M3Button,
      M3Icon,
    },

    setup () {
      return {
        appearances: values.appearances,
        label: localize(globals.locale, messages).share,
      }
    },

    template: `
        <div style="display: grid; gap: 16px;">
            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                <M3Button
                    v-for="appearance in appearances"
                    :key="'text-' + appearance"
                    :appearance="appearance"
                >
                    {{ label }}
                </M3Button>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                <M3Button
                    v-for="appearance in appearances"
                    :key="'icon-' + appearance"
                    :appearance="appearance"
                >
                    <M3Icon name="share" />
                    {{ label }}
                </M3Button>
            </div>
        </div>
    `,
  }),
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const DisabledStates: Story = {
  render: (_args, { globals }) => ({
    components: {
      M3Button,
    },

    setup () {
      return {
        appearances: values.appearances,
        label: localize(globals.locale, messages).share,
      }
    },

    template: `
        <div style="display: flex; flex-wrap: wrap; gap: 16px;">
            <M3Button
                v-for="appearance in appearances"
                :key="appearance"
                :appearance="appearance"
                disabled
            >
                {{ label }}
            </M3Button>
        </div>
    `,
  }),
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const IconStandard: Story = {
  args: { width: 'medium', appearance: 'standard' },
  render: (args: unknown, { globals }) => ({
    components: { M3Button, M3Icon },
    setup () {
      return { args, label: localize(globals.locale, messages).favorite }
    },
    template: `
        <M3Button v-bind="args" :aria-label="label">
            <M3Icon name="favorite" />
        </M3Button>
    `,
  }),
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const IconSquare: Story = {
  args: { width: 'medium', rounding: 'square' },
  render: (args: unknown, { globals }) => ({
    components: { M3Button, M3Icon },
    setup () {
      return { args, label: localize(globals.locale, messages).favorite }
    },
    template: `
        <M3Button v-bind="args" :aria-label="label">
            <M3Icon name="favorite" />
        </M3Button>
    `,
  }),
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const IconSizeMatrix: Story = {
  render: (_args, { globals }) => ({
    components: { M3Icon, M3Button },
    setup () {
      return {
        sizes: ['xs', 'sm', 'md', 'lg', 'xl'],
        label: localize(globals.locale, messages).favorite,
      }
    },
    template: `
        <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
            <M3Button
                v-for="size in sizes"
                :key="size"
                :size="size"
                :aria-label="label"
                appearance="tonal"
                width="medium"
            >
                <M3Icon name="favorite" />
            </M3Button>
        </div>
    `,
  }),
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const IconWidthMatrix: Story = {
  render: (_args, { globals }) => ({
    components: { M3Icon, M3Button },
    setup () {
      return {
        widths: ['narrow', 'medium', 'wide'],
        label: localize(globals.locale, messages).favorite,
      }
    },
    template: `
        <div style="display: flex; gap: 16px; align-items: center;">
            <M3Button
                v-for="width in widths"
                :key="width"
                :width="width"
                :aria-label="label"
                appearance="tonal"
            >
                <M3Icon name="favorite" />
            </M3Button>
        </div>
    `,
  }),
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const IconToggleable: Story = {
  args: { width: 'medium' },
  argTypes: {
    toggleable: { control: false },
    selected: { control: false },
  },
  render: (args: unknown, { globals }) => ({
    components: {
      M3Icon,
      M3Button,
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
        <M3Button
            v-bind="args"
            :selected="selected"
            :aria-label="label"
            toggleable
            @click="selected = !selected"
        >
            <M3Icon name="favorite" />
        </M3Button>
    `,
  }),
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const IconAppearanceMatrix: Story = {
  render: (_args, { globals }) => ({
    components: {
      M3Icon,
      M3Button,
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
                <M3Button width="medium"
                    v-for="appearance in appearances"
                    :key="appearance"
                    :appearance="appearance"
                    :aria-label="text.favorite"
                >
                    <M3Icon name="favorite" />
                </M3Button>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                <M3Button width="medium"
                    v-for="appearance in appearances"
                    :key="appearance + '-disabled'"
                    :appearance="appearance"
                    :aria-label="text.favoriteDisabled"
                    disabled
                >
                    <M3Icon name="favorite" />
                </M3Button>
            </div>
        </div>
    `,
  }),
}
