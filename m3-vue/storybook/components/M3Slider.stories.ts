import type { Meta, StoryObj } from '@storybook/vue3'

import { M3Slider } from '@/components/slider'

import {
  ref,
} from 'vue'

const meta = {
  title: 'Components/M3Slider',

  component: M3Slider,

  argTypes: {
    type: { control: false },
    value: { control: false },
  },

  args: {
    type: 'single',
  },

  // eslint-disable-next-line max-lines-per-function
  render: (args: unknown) => ({
    name: 'M3SliderStory',

    components: {
      M3Slider,
    },

    setup () {
      const { value: _, type, ...bindings } = args
      return {
        type,
        value: ref(type === 'single' ? 50 : [25, 75]),
        bindings,
      }
    },

    template: `
      <M3Slider
          v-model:value="value"
          :type="type"
          v-bind="bindings"
          style="width: 320px;"
      />
    `,
  }),

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3Slider>

export default meta

type Story = StoryObj<typeof meta>

export const Single: Story = {
  args: {
    type: 'single',
  },
}

export const Range: Story = {
  args: {
    type: 'range',
  },
}
