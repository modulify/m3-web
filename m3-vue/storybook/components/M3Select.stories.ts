import type { Code } from '../countries/codes'
import type { Meta, StoryObj } from '@storybook/vue3'

import { computed, ref } from 'vue'

import { M3Icon } from '@/components/icon'
import { M3Select } from '@/components/select'

import CountryFlag from '../countries/CountryFlag.vue'

import codes from '../countries/codes'
import countries from '../countries/names.json'
import { localize, resolveStorybookLocale } from '../i18n'

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

const localizeArgs = (locale: unknown, args: M3SelectStoryProps): M3SelectStoryProps => {
  const text = localize(locale, {
    'en-US': { choose: 'Choose', country: 'Country', required: 'Required', select: 'Select an option' },
    'ru-RU': { choose: 'Выберите', country: 'Страна', required: 'Обязательное поле', select: 'Выберите вариант' },
  })

  return {
    ...args,
    label: args.label === 'Country' ? text.country : text.choose,
    placeholder: args.placeholder === 'Required' ? text.required : args.placeholder ? text.select : undefined,
  }
}

const meta = {
  title: 'Components/M3Select',

  component: M3Select as unknown as NonNullable<Meta<M3SelectStoryProps>['component']>,

  argTypes: {
    options: {
      control: false,
    },
  },

  render: (args: M3SelectStoryProps, { globals }) => ({
    name: 'M3SelectStory',

    components: {
      M3Select,
    },

    setup () {
      const option = localize(globals.locale, { 'en-US': 'Option', 'ru-RU': 'Вариант' })
      return {
        args: localizeArgs(globals.locale, args),
        value: ref(''),
        options: [{
          label: `${option} 1`,
          value: 1,
        }, {
          label: `${option} 2`,
          value: 2,
        }, {
          label: `${option} 3`,
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

  render: (args: M3SelectStoryProps, { globals }) => ({
    name: 'M3SelectStory',

    components: {
      CountryFlag,
      M3Icon,
      M3Select,
    },

    setup () {
      const countryCode = ref<Code | null>(null)
      const displayNames = new Intl.DisplayNames([resolveStorybookLocale(globals.locale)], { type: 'region' })
      const countryOptions = computed(() => (codes.map(code => ({
        value: code,
        label: displayNames.of(code) ?? countries[code],
      })) as Array<CountryOption>).sort((a, b) => a.label.localeCompare(b.label)))

      return {
        args: localizeArgs(globals.locale, args),
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
