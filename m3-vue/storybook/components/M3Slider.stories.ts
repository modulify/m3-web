import type { Meta, StoryObj } from '@storybook/vue3'

import { M3Slider } from '@/components/slider'

import {
  computed,
  ref,
} from 'vue'

const meta = {
  title: 'Components/M3Slider',

  component: M3Slider,

  argTypes: {
    type: { control: false },
    value: { control: false },
    step: { control: 'number' },
  },

  args: {
    type: 'single',
    step: 0,
    ariaHandleMax: {
      label: 'Maximum',
    },
    ariaHandleMin: {
      label: 'Minimum',
    },
  },

  render: (args: unknown) => ({
    name: 'M3SliderStory',

    components: {
      M3Slider,
    },

    setup () {
      const bindings = computed(() => {
        const { value: _, ...bindings } = args

        return bindings
      })

      return {
        value: ref(bindings.value.type === 'single' ? 50 : [25, 75]),
        bindings,
      }
    },

    template: `
      <M3Slider
          v-model:value="value"
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
    ariaHandle: {
      label: 'Value',
    },
    ariaHandleMax: {},
  },
}

export const Range: Story = {
  args: {
    type: 'range',
  },
}
