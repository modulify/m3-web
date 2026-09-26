import type { M3SliderProps, M3SliderValue } from '@/components/slider'
import type { Meta, StoryObj } from '@storybook/react'

import { useEffect, useState } from 'react'

import { M3Slider } from '@/components/slider'

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

  render: (args) => <M3SliderStory {...args} />,

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
