import type { Meta, StoryObj } from '@storybook/react'

import { M3Switch } from '@/components/switch'

import makeId from '@/utils/id'
import {
  useMemo,
  useState,
} from 'react'

const meta = {
  title: 'Components/M3Switch',

  component: M3Switch,

  argTypes: {
    id: { control: false },
    checked: { control: false },
    name: { control: false },
    onToggle: { control: false },
  },

  args: {
    disabled: false,
  },

  render: ({ disabled }) => {
    const id = useMemo(() => makeId('m3-switch'), [])
    const [checked, toggle] = useState(false)

    return (
      <div className="flex-row">
        <label htmlFor={id} className="mr-6">
          Airplane mode
        </label>

        <M3Switch
          id={id}
          checked={checked}
          disabled={disabled}
          onToggle={toggle}
        />
      </div>
    );
  },

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3Switch>

export default meta

type Story = StoryObj<typeof meta>

export const StandardSwitch: Story = {}
