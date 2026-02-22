import type { Meta, StoryObj } from '@storybook/react'
import type { Code } from '../countries/codes'
import type {
  M3SelectOption,
  M3SelectProps,
} from '@/components/select'

import CountryFlag from '../countries/CountryFlag'
import { M3Icon } from '@/components/icon'
import { M3Select } from '@/components/select'

import {
  useMemo,
  useState,
} from 'react'

import codes from '../countries/codes'
import countries from '../countries/names.json'

type CountryOption = {
  value: Code;
  label: string;
}

type M3SelectStoryProps<Value> = Omit<
  M3SelectProps<Value>,
  'value' | 'options' | 'onUpdate'
>

const M3SelectStory = (args: M3SelectStoryProps<number>) => {
  const [value, setValue] = useState<number | null>(null)
  const options = useMemo<Array<M3SelectOption<number>>>(() => [{
    label: 'Option 1',
    value: 1,
  }, {
    label: 'Option 2',
    value: 2,
  }, {
    label: 'Option 3',
    value: 3,
  }], [])

  return (
    <M3Select<number>
      value={value}
      options={options}
      onUpdate={(value) => setValue(value)}
      {...args}
    />
  )
}

const M3SelectWithIconsStory = (args: M3SelectStoryProps<Code>) => {
  const [countryCode, setCountryCode] = useState<Code | null>(null)
  const countryOptions = useMemo(() => (codes.map(code => ({
    value: code,
    label: (countries as Record<Code, string>)[code],
  })) as Array<CountryOption>).sort((a, b) => a.label.localeCompare(b.label)), [])

  return (
    <M3Select<Code>
      value={countryCode}
      options={countryOptions}
      onUpdate={(value) => setCountryCode(value)}
      {...args}
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

  render: (args) => <M3SelectStory {...args} />,

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

  render: (args) => <M3SelectWithIconsStory {...args} />,
}
