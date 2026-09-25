import type { Code } from '../countries/codes'
import type { Meta, StoryObj } from '@storybook/vue3'

import { computed, ref } from 'vue'

import { M3Icon } from '@/components/icon'
import { M3Select } from '@/components/select'

import CountryFlag from '../countries/CountryFlag.vue'

import codes from '../countries/codes'
import countries from '../countries/names.json'

type CountryOption = {
  value: Code;
  label: string;
}

type M3SelectStoryProps = {
  options?: unknown[];
  label?: string;
  outlined?: boolean;
  placeholder?: string;
  invalid?: boolean;
}

const meta = {
  title: 'Components/M3Select',

  component: M3Select as unknown as NonNullable<Meta<M3SelectStoryProps>['component']>,

  argTypes: {
    options: {
      control: false,
    },
  },

  render: (args: M3SelectStoryProps) => ({
    name: 'M3SelectStory',

    components: {
      M3Select,
    },

    setup () {
      return {
        args,
        value: ref(''),
        options: [{
          label: 'Option 1',
          value: 1,
        }, {
          label: 'Option 2',
          value: 2,
        }, {
          label: 'Option 3',
          value: 3,
        }],
      }
    },

    template: `
        <M3Select
            v-model:value="value"
            :options="options"
            v-bind="args"
        />
    `,
  }),

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<M3SelectStoryProps>

export default meta

type Story = StoryObj<typeof meta>

export const Standard: Story = {
  args: {
    label: 'Choose',
  },
}

export const WithIcons: Story = {
  args: {
    label: 'Country',
  },

  render: (args: M3SelectStoryProps) => ({
    name: 'M3SelectStory',

    components: {
      CountryFlag,
      M3Icon,
      M3Select,
    },

    setup () {
      const countryCode = ref<Code | null>(null)
      const countryOptions = computed(() => (codes.map(code => ({
        value: code,
        label: countries[code],
      })) as Array<CountryOption>).sort((a, b) => a.label.localeCompare(b.label)))

      return {
        args,
        countryCode,
        countryOptions,
      }
    },

    template: `
        <M3Select
            v-model:value="countryCode"
            :options="countryOptions"
            v-bind="args"
        >
            <template #leading>
                <CountryFlag
                    v-if="countryCode"
                    :code="countryCode"
                    aria-hidden="true"
                />

                <M3Icon v-else name="flag" />
            </template>

            <template #option-leading="{ option }">
                <CountryFlag :code="option.value" aria-hidden="true" />
            </template>
        </M3Select>
    `,
  }),
}

export const Outlined: Story = {
  args: {
    label: 'Choose',
    outlined: true,
    placeholder: 'Select an option',
  },
}

export const Invalid: Story = {
  args: {
    label: 'Choose',
    invalid: true,
    placeholder: 'Required',
  },
}
