import type { Meta, StoryObj } from '@storybook/react'
import type { M3SideSheetProps } from '@/components/side-sheet'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3SideSheet } from '@/components/side-sheet'

import { useState } from 'react'

const M3SideSheetStory = (args: M3SideSheetProps) => {
  const [shown, setShown] = useState(false)

  return (
    <>
      <M3Button onClick={() => setShown(true)}>Open side sheet</M3Button>

      <M3SideSheet
        shown={shown}
        onToggle={setShown}
        {...args}
      >
        <M3SideSheet.Title>
          Filters
        </M3SideSheet.Title>

        <M3SideSheet.CloseIcon>
          <M3Icon name="close" />
        </M3SideSheet.CloseIcon>

        <p className="m-4">Choose filters and apply changes.</p>

        <M3SideSheet.Footer>
          <div className="p-4">Footer actions</div>
        </M3SideSheet.Footer>
      </M3SideSheet>
    </>
  )
}

const meta = {
  title: 'Components/M3SideSheet',

  component: M3SideSheet,

  argTypes: {
    onToggle: { control: false },
  },

  args: {
    docked: false,
  },

  render: (args) => <M3SideSheetStory {...args} />,

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3SideSheet>

export default meta

type Story = StoryObj<typeof meta>

export const Standard: Story = {}

export const Docked: Story = {
  args: {
    docked: true,
  },
}
