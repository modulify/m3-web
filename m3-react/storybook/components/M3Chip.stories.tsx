import type { Meta, StoryObj } from '@storybook/react'

import { M3Chip } from '@/components/chip'
import { M3Icon } from '@/components/icon'
import ChipShowcase from '../examples/chip/ChipShowcase'

import {
  useEffect,
  useState,
} from 'react'

const meta = {
  title: 'Components/M3Chip',

  component: M3Chip,

  argTypes: {
    variant: {
      control: 'select',
      options: ['assist', 'filter', 'input', 'suggestion'],
    },

    selected: {
      control: 'boolean',
    },

    disabled: {
      control: 'boolean',
    },

    dismissible: {
      control: 'boolean',
    },

    showCheckmark: {
      control: 'boolean',
    },
  },

  args: {
    variant: 'assist',
    selected: false,
    disabled: false,
    dismissible: false,
    showCheckmark: true,
  },

  render: (args) => {
    const [selected, setSelected] = useState(args.selected)

    useEffect(() => {
      setSelected(args.selected)
    }, [args.selected])

    return (
      <M3Chip
        {...args}
        selected={selected}
        onToggle={setSelected}
      >
        {args.variant === 'assist' || args.variant === 'suggestion'
          ? <M3Icon name={args.variant === 'assist' ? 'schedule' : 'lightbulb'} />
          : null}
        {args.variant === 'input' ? 'Project Alpha' : 'Remind later'}
      </M3Chip>
    )
  },

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3Chip>

export default meta

type Story = StoryObj<typeof meta>

export const Standard: Story = {}

export const VariantMatrix: Story = {
  render: () => <ChipShowcase mode="matrix" />,
}

export const FilterSet: Story = {
  render: () => <ChipShowcase mode="filters" />,
}

export const InputTokens: Story = {
  render: () => <ChipShowcase mode="inputs" />,
}
