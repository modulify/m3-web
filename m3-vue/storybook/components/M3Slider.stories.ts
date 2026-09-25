import type { Meta, StoryObj } from '@storybook/vue3'

import { computed, ref } from 'vue'

import { M3Slider } from '@/components/slider'

type AriaOptions = {
  label?: string;
  labelledBy?: string;
}

type M3SliderStoryProps = {
  type?: 'single' | 'range';
  value?: number | [number, number] | null;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  ariaHandle?: AriaOptions;
  ariaHandleMin?: AriaOptions;
  ariaHandleMax?: AriaOptions;
}

const meta = {
  title: 'Components/M3Slider',

  component: M3Slider as unknown as NonNullable<Meta<M3SliderStoryProps>['component']>,

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

  render: (args: M3SliderStoryProps) => ({
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
} satisfies Meta<M3SliderStoryProps>

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

export const DiscreteSingle: Story = {
  args: {
    type: 'single',
    step: 10,
    ariaHandle: {
      label: 'Volume',
    },
    ariaHandleMax: {},
  },
}

export const DisabledRange: Story = {
  args: {
    type: 'range',
    disabled: true,
  },
}
