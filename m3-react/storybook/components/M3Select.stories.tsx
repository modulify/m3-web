import type { Code } from '../countries/codes'
import type { M3SelectOption, M3SelectProps } from '@/components/select'
import type { Meta, StoryObj } from '@storybook/react'

import { useMemo, useState } from 'react'

import { M3Icon } from '@/components/icon'
import { M3Select } from '@/components/select'

import CountryFlag from '../countries/CountryFlag'

import codes from '../countries/codes'
import countries from '../countries/names.json'
import { localize, resolveStorybookLocale } from '../i18n'

type CountryOption = {
  value: Code;
  label: string;
}

type M3SelectStoryProps<Value> = Omit<
  M3SelectProps<Value>,
  'value' | 'options' | 'onUpdate'
>

const localizeArgs = <Value,>(locale: unknown, args: M3SelectStoryProps<Value>): M3SelectStoryProps<Value> => {
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

const M3SelectStory = ({ locale, ...args }: M3SelectStoryProps<number> & { locale: unknown }) => {
  const [value, setValue] = useState<number | null>(null)
  const option = localize(locale, { 'en-US': 'Option', 'ru-RU': 'Вариант' })
  const options = useMemo<Array<M3SelectOption<number>>>(() => [{
    label: `${option} 1`,
    value: 1,
  }, {
    label: `${option} 2`,
    value: 2,
  }, {
    label: `${option} 3`,
    value: 3,
  }], [option])

  return (
    <M3Select<number>
      value={value}
      options={options}
      {...args}
      onUpdate={(value) => setValue(value)}
    />
  )
}

const M3SelectWithIconsStory = ({ locale, ...args }: M3SelectStoryProps<Code> & { locale: unknown }) => {
  const [countryCode, setCountryCode] = useState<Code | null>(null)
  const displayNames = useMemo(() => new Intl.DisplayNames([resolveStorybookLocale(locale)], { type: 'region' }), [locale])
  const countryOptions = useMemo(() => (codes.map(code => ({
    value: code,
    label: displayNames.of(code) ?? (countries as Record<Code, string>)[code],
  })) as Array<CountryOption>).sort((a, b) => a.label.localeCompare(b.label)), [displayNames])

  return (
    <M3Select<Code>
      value={countryCode}
      options={countryOptions}
      {...args}
      onUpdate={(value) => setCountryCode(value)}
    >
      <M3Select.Leading>
        {() => countryCode
          ? (
            <CountryFlag
              code={countryCode}
              aria-hidden="true"
            />
          )
          : <M3Icon name="flag" />
        }
      </M3Select.Leading>

      <M3Select.OptionLeading>
        {({ option }: { option: CountryOption }) => (
          <CountryFlag
            code={option.value}
            aria-hidden="true"
          />
        )}
      </M3Select.OptionLeading>
    </M3Select>
  )
}

const meta = {
  title: 'Components/M3Select',

  component: M3Select,

  argTypes: {
    value: { control: false },
    options: { control: false },
    equalPredicate: { control: false },
    onUpdate: { control: false },
  },

  render: (args, { globals }) => <M3SelectStory locale={globals.locale} {...localizeArgs(globals.locale, args)} />,

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3Select>

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

  render: (args, { globals }) => <M3SelectWithIconsStory locale={globals.locale} {...localizeArgs(globals.locale, args)} />,
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
