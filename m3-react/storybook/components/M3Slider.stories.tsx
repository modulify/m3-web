import type { Meta, StoryObj } from '@storybook/react'
import type {
  M3SliderProps,
  M3SliderValue,
} from '@/components/slider'

import { M3Slider } from '@/components/slider'

import {
  useEffect,
  useState,
} from 'react'

const M3SliderStory = (args: M3SliderProps) => {
  const [value, setValue] = useState<M3SliderValue>(
    args.type === 'single' ? 50 : [25, 75]
  )

  useEffect(() => {
    setValue(args.type === 'single' ? 50 : [25, 75])
  }, [args.type])

  return (
    <M3Slider
      {...args}
      value={value}
      onUpdate={(value) => setValue(value)}
      style={{ width: '320px' }}
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
