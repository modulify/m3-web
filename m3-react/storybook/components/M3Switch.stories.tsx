import type { Meta, StoryObj } from '@storybook/react'

import { M3Switch } from '@/components/switch'

import makeId from '@/utils/id'
import { useMemo } from 'react'
import { useRecord, useWatch } from '@/hooks';

const M3SwitchWithLabel = ({ children = 'M3Switch', checked = false, disabled = false }) => {
  const id = useMemo(() => makeId('m3-switch'), [])
  const state = useRecord({
    checked,
  }, ['checked'])

  useWatch(checked, checked => state.checked = checked);

  return (
    <div className="flex-row">
      <label htmlFor={id} className="mr-6">
        {children}
      </label>

      <M3Switch
        id={id}
        checked={state.checked}
        disabled={disabled}
        onToggle={() => state.checked = !state.checked}
      />
    </div>
  );
}

const meta = {
  title: 'Components/M3Switch',

  component: M3Switch,

  argTypes: {
    id: { control: false },
    name: { control: false },
    onToggle: { control: false },
  },

  args: {
    checked: false,
    disabled: false,
  },

  render: ({ checked, disabled }) => {
    return (
      <M3SwitchWithLabel checked={checked} disabled={disabled}>
        Airplane mode
      </M3SwitchWithLabel>
    );
  },

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3Switch>

export default meta

type Story = StoryObj<typeof meta>

export const StandardSwitch: Story = {}
