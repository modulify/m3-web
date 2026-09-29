import type { Meta, StoryObj } from '@storybook/vue3'

import { ref, watch } from 'vue'

import { M3Chip } from '@/components/chip'
import { M3Icon } from '@/components/icon'

import ChipShowcase from '../examples/chip/ChipShowcase.vue'
import { localize, resolveStorybookLocale } from '../i18n'

const messages = {
  'en-US': {
    input: 'Project Alpha',
    standard: 'Remind later',
  },
  'ru-RU': {
    input: 'Проект Альфа',
    standard: 'Напомнить позже',
  },
}

const renderStandard = (
  args: Record<string, unknown>,
  { globals }: { globals: Record<string, unknown> }
) => ({
  components: {
    M3Chip,
    M3Icon,
  },

  setup: () => {
    const selected = ref(Boolean(args.selected))
    const locale = resolveStorybookLocale(globals.locale)

    watch(() => args.selected, value => selected.value = Boolean(value), { immediate: true })

    return {
      args,
      locale,
      selected,
      text: localize(locale, messages),
    }
  },

  template: `
    <div :lang="locale">
        <M3Chip
            v-bind="args"
            :selected="selected"
            @update:selected="selected = $event"
        >
            <M3Icon
                v-if="args.variant === 'assist' || args.variant === 'suggestion'"
                :name="args.variant === 'assist' ? 'schedule' : 'lightbulb'"
            />
  
            {{ args.variant === 'input' ? text.input : text.standard }}
        </M3Chip>
    </div>
  `,
})

const renderShowcase = (
  mode: 'filters' | 'inputs' | 'matrix',
  locale: unknown
) => ({
  components: {
    ChipShowcase,
  },

  setup: () => ({
    locale: resolveStorybookLocale(locale),
    mode,
  }),

  template: '<ChipShowcase :locale="locale" :mode="mode" />',
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
  render: (_args, { globals }) => renderShowcase('matrix', globals.locale),
}

export const FilterSet: Story = {
  render: (_args, { globals }) => renderShowcase('filters', globals.locale),
}

export const InputTokens: Story = {
  render: (_args, { globals }) => renderShowcase('inputs', globals.locale),
}
