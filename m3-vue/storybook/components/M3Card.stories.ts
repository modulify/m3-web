import type { Meta, StoryObj } from '@storybook/vue3'

import { M3Button } from '@/components/button'
import { M3Card } from '@/components/card'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'

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

  render: (args: unknown) => ({
    components: {
      M3Button,
      M3Card,
    },

    setup () {
      return { args }
    },

    template: `
        <M3Card v-bind="args" landscape>
            <template #media>
                <img alt="" src="/assets/image-80x80.png">
            </template>

            <template #heading>
                Header
            </template>

            <template #subheading>
                Subhead
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
  // eslint-disable-next-line max-lines-per-function
  render: (args: unknown) => ({
    components: {
      M3Button,
      M3Card,
      M3Icon,
      M3IconButton,
    },

    setup () {
      return { args }
    },

    template: `
        <M3Card v-bind="args" landscape>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="20" fill="#6750A4"/>
            </svg>

            <div class="m3-card__head">
                <div class="m3-card__heading">Header</div>
                <div class="m3-card__subheading">Subhead</div>
            </div>

            <M3IconButton class="ml-auto">
                <M3Icon name="more_vert" />
            </M3IconButton>
        </M3Card>
    `,
  }),
}

export const Portrait: Story = {
  // eslint-disable-next-line max-lines-per-function
  render: (args: unknown) => ({
    components: {
      M3Button,
      M3Card,
      M3Icon,
      M3IconButton,
    },

    setup () {
      return { args }
    },

    template: `
        <M3Card v-bind="args">
            <template #media>
                <img alt="" src="/assets/image-720x376.png">
            </template>

            <template #heading>
                Title
            </template>

            <template #subheading>
                Subhead
            </template>

            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor

            <div style="display: flex; justify-content: flex-end; gap: 8px; width: 100%;">
                <M3Button appearance="outlined">
                    Enabled
                </M3Button>

                <M3Button>Enabled</M3Button>
            </div>
        </M3Card>
    `,
  }),
}
