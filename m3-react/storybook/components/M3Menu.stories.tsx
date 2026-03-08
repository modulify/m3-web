import type { Meta, StoryObj } from '@storybook/react'
import type { M3MenuProps } from '@/components/menu'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3Menu, M3MenuItem } from '@/components/menu'
import { useCallback, useState } from 'react'

const M3MenuStory = (args: M3MenuProps) => {
  const [target, setTarget] = useState<HTMLElement | null>(null)
  const bindTarget = useCallback((el: HTMLButtonElement) => {
    setTarget(el)
    return () => {
      setTarget(current => current === el ? null : current)
    }
  }, [])

  return (
    <div style={{ minHeight: '220px', minWidth: '240px' }}>
      <M3Button effects={[bindTarget]}>
        Open menu
      </M3Button>

      <M3Menu
        {...args}
        target={target}
      >
        <M3MenuItem>Item 1</M3MenuItem>
        <M3MenuItem selected={true}>Item 2</M3MenuItem>
        <M3MenuItem>Item 3</M3MenuItem>
      </M3Menu>
    </div>
  )
}

const meta = {
  title: 'Components/M3Menu',

  component: M3Menu,

  args: {
    target: null,
  },

  argTypes: {
    target: { control: false },
    shown: { control: false },
    onToggle: { control: false },
    onShow: { control: false },
    onHide: { control: false },
    onDispose: { control: false },
  },

  render: (args) => <M3MenuStory {...args} />,

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3Menu>

export default meta

type Story = StoryObj<typeof meta>

export const Standard: Story = {
  args: {
    target: null,
  },
}

export const WithLeadingAndTrailingContent: Story = {
  args: {
    target: null,
  },

  render: (args) => {
    const [target, setTarget] = useState<HTMLElement | null>(null)
    const bindTarget = useCallback((el: HTMLButtonElement) => {
      setTarget(el)
      return () => {
        setTarget(current => current === el ? null : current)
      }
    }, [])

    return (
      <div style={{ minHeight: '220px', minWidth: '280px' }}>
        <M3Button effects={[bindTarget]}>
          Open menu
        </M3Button>

        <M3Menu
          {...args}
          target={target}
        >
          <M3MenuItem>
            <M3MenuItem.Leading>
              <M3Icon name="edit" />
            </M3MenuItem.Leading>
            Edit profile
          </M3MenuItem>

          <M3MenuItem selected={true}>
            <M3MenuItem.Leading>
              <M3Icon name="favorite" />
            </M3MenuItem.Leading>
            Favorite
            <M3MenuItem.Trailing>
              <span style={{ fontSize: '12px' }}>Selected</span>
            </M3MenuItem.Trailing>
          </M3MenuItem>

          <M3MenuItem disabled={true}>
            Archive
          </M3MenuItem>
        </M3Menu>
      </div>
    )
  },
}
