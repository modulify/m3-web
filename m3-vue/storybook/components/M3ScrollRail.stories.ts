import type { Meta, StoryObj } from '@storybook/vue3'

import { M3ScrollRail } from '@/components/scroll-rail'

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

  // eslint-disable-next-line max-lines-per-function
  render: (args: unknown) => ({
    name: 'M3ScrollRailStory',

    components: {
      M3ScrollRail,
    },

    setup () {
      return {
        args,
        items: 30,
      }
    },

    template: `
        <div class="m3-panel m3-panel_elevated-1" style="padding: 4px;">
            <div
                class="m3-scroll-box m3-scroll-box_scroll-x m3-scroll-box_scroll-y"
                style="max-width: 360px; max-height: 360px;"
            >
                <div class="m3-scroll-box__content" style="padding: 0 8px;">
                    <M3ScrollRail v-bind="args" />
                    <M3ScrollRail v-bind="args" horizontal />
                    <div v-for="i in items" :key="i" style="width: 480px;">
                      Item {{ i }}
                    </div>
                </div>
            </div>
        </div>
    `,
  }),

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3ScrollRail>

export default meta

type Story = StoryObj<typeof meta>

export const Both: Story = {}
