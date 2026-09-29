import type { M3SliderProps, M3SliderValue } from '@/components/slider'
import type { Meta, StoryObj } from '@storybook/react'

import { useEffect, useState } from 'react'

import { M3Slider } from '@/components/slider'

import { localize } from '../i18n'

const M3SliderStory = ({
  value: _value,
  style: _style,
  onUpdate: _onUpdate,
  ...args
}: M3SliderProps) => {
  const [value, setValue] = useState<M3SliderValue>(
    args.type === 'single' ? 50 : [25, 75]
  )

  useEffect(() => {
    setValue(args.type === 'single' ? 50 : [25, 75])
  }, [args.type])

  return (
    <M3Slider
      value={value}
      style={{ width: '320px' }}
      {...args}
      onUpdate={(value) => setValue(value)}
    />
  )
}

const meta = {
  title: 'Components/M3Slider',

  component: M3Slider,

  argTypes: {
    type: { control: false },
    value: { control: false },
    step: { control: 'number' },
    onUpdate: { control: false },
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

  render: (args, { globals }) => {
    const text = localize(globals.locale, { 'en-US': { maximum: 'Maximum', minimum: 'Minimum' }, 'ru-RU': { maximum: 'Максимум', minimum: 'Минимум' } })
    return <M3SliderStory {...{ ...args, ariaHandleMax: { label: text.maximum }, ariaHandleMin: { label: text.minimum } }} />
  },

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

Single.render = (args, { globals }) => {
  const label = localize(globals.locale, { 'en-US': 'Value', 'ru-RU': 'Значение' })
  return <M3SliderStory {...{ ...args, ariaHandle: { label } }} />
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

DiscreteSingle.render = (args, { globals }) => {
  const label = localize(globals.locale, { 'en-US': 'Volume', 'ru-RU': 'Громкость' })
  return <M3SliderStory {...{ ...args, ariaHandle: { label } }} />
}

export const DisabledRange: Story = {
  args: {
    type: 'range',
    disabled: true,
  },
}
