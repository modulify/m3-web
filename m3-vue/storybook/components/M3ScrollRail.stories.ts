import type { Meta, StoryObj } from '@storybook/vue3'

import { M3ScrollRail } from '@/components/scroll-rail'
import { M3Surface } from '@/components/surface'

import { localize } from '../i18n'

const meta = {
  title: 'Components/M3ScrollRail',

  component: M3ScrollRail,

  argTypes: {
    horizontal: {
      control: false,
    },

    disabled: {
      control: 'boolean',
    },
  },

  args: {
    disabled: false,
  },

  render: (args: unknown, { globals }) => ({
    name: 'M3ScrollRailStory',

    components: {
      M3ScrollRail,
      M3Surface,
    },

    setup () {
      return {
        args,
        item: localize(globals.locale, { 'en-US': 'Item', 'ru-RU': 'Элемент' }),
        items: 30,
        scrollArea: localize(globals.locale, { 'en-US': 'Scrollable items', 'ru-RU': 'Прокручиваемые элементы' }),
      }
    },

    template: `
        <M3Surface
            :fill-width="false"
            :fill-height="false"
            :rounding="16"
            :elevation="0"
            variant="surface-container"
            style="padding: 4px;"
        >
            <div
                class="m3-scroll-box m3-scroll-box_scroll-x m3-scroll-box_scroll-y"
                style="max-width: 360px; max-height: 360px;"
            >
                <div
                    :aria-label="scrollArea"
                    class="m3-scroll-box__content"
                    style="padding: 0 8px;"
                    tabindex="0"
                >
                    <M3ScrollRail v-bind="args" />
                    <M3ScrollRail v-bind="args" horizontal />
                    <div v-for="i in items" :key="i" style="width: 480px;">
                      {{ item }} {{ i }}
                    </div>
                </div>
            </div>
        </M3Surface>
    `,
  }),

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3ScrollRail>

export default meta

type Story = StoryObj<typeof meta>

export const Both: Story = {}
