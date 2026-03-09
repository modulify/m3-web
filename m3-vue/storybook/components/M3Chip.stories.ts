import type { Meta, StoryObj } from '@storybook/vue3'

import { M3Chip } from '@/components/chip'
import { M3Icon } from '@/components/icon'
import ChipShowcase from '../examples/chip/ChipShowcase.vue'

import { ref, watch } from 'vue'

const standardTemplate = `
  <M3Chip
      v-bind="args"
      :selected="selected"
      @update:selected="selected = $event"
  >
      <M3Icon
          v-if="args.variant === 'assist' || args.variant === 'suggestion'"
          :name="args.variant === 'assist' ? 'schedule' : 'lightbulb'"
      />

      {{ args.variant === 'input' ? 'Project Alpha' : 'Remind later' }}
  </M3Chip>
`

const renderStandard = (args: Record<string, unknown>) => ({
  components: {
    M3Chip,
    M3Icon,
  },

  setup: () => {
    const selected = ref(Boolean(args.selected))

    watch(() => args.selected, value => selected.value = Boolean(value), { immediate: true })

    return {
      args,
      selected,
    }
  },

  template: standardTemplate,
})

const meta = {
  title: 'Components/M3Chip',

  component: M3Chip,

  args: {
    variant: 'assist',
    selected: false,
    disabled: false,
    dismissible: false,
    showCheckmark: true,
  },

  render: renderStandard,

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3Chip>

export default meta

type Story = StoryObj<typeof meta>

export const Standard: Story = {}

export const VariantMatrix: Story = {
  render: () => ({
    components: {
      ChipShowcase,
    },

    template: '<ChipShowcase mode="matrix" />',
  }),
}

export const FilterSet: Story = {
  render: () => ({
    components: {
      ChipShowcase,
    },

    template: '<ChipShowcase mode="filters" />',
  }),
}

export const InputTokens: Story = {
  render: () => ({
    components: {
      ChipShowcase,
    },

    template: '<ChipShowcase mode="inputs" />',
  }),
}
