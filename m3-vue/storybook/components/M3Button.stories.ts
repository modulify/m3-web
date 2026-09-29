import type { Meta, StoryObj } from '@storybook/vue3'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'

import * as values from '@/components/button/values'

import { localize } from '../i18n'

const messages = {
  'en-US': { share: 'Share' },
  'ru-RU': { share: 'Поделиться' },
}

const meta = {
  title: 'Components/M3Button',

  component: M3Button,

  argTypes: {
    appearance: {
      control: 'select',
      options: values.appearances,
    },

    disabled: {
      control: 'boolean',
    },
  },

  args: {
    appearance: 'filled',
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

export default meta

type Story = StoryObj<typeof meta>

export const WithTextOnly: Story = {}

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
