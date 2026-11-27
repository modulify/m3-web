import type { Meta, StoryObj } from '@storybook/vue3'

import { ref } from 'vue'

import { M3Button } from '@/components/button'
import { M3TimePicker } from '@/components/time-picker'

const meta = {
  title: 'Components/M3TimePicker',
  component: M3TimePicker,

  args: {
    value: { hour: 9, minute: 30 },
    appearance: 'dial',
    locale: 'en-US',
    layout: 'vertical',
    step: 1,
  },

  argTypes: {
    value: { control: false },
    min: { control: false },
    max: { control: false },
    format: { control: 'select', options: [undefined, '12h', '24h'] },
    appearance: { control: 'select', options: ['dial', 'input'] },
    layout: { control: 'select', options: ['vertical', 'horizontal'] },
  },

  render: (args, { viewMode }) => ({
    components: { M3Button, M3TimePicker },

    setup () {
      return {
        args,
        opened: ref(viewMode !== 'docs'),
        value: ref({ ...args.value }),
      }
    },

    template: `
        <M3Button @click="opened = true">Select time</M3Button>
        <M3TimePicker
            v-bind="args"
            v-model:opened="opened"
            v-model:value="value"
        />
    `,
  }),

  parameters: { layout: 'centered' },
} satisfies Meta<typeof M3TimePicker>

export default meta

type Story = StoryObj<typeof meta>

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const Dial: Story = {}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const TextInput: Story = {
  args: { appearance: 'input' },
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const TwentyFourHour: Story = {
  args: {
    format: '24h',
    value: { hour: 14, minute: 45 },
  },
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const Horizontal: Story = {
  args: { layout: 'horizontal' },
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const ScheduledInterval: Story = {
  args: {
    appearance: 'input',
    format: '24h',
    value: { hour: 9, minute: 0 },
    min: { hour: 9, minute: 0 },
    max: { hour: 17, minute: 0 },
    step: 15,
  },
}
