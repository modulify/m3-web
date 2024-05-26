import type { Meta, StoryObj } from '@storybook/react'

import { M3ScrollRail } from '@/components/scroll-rail'

const meta = {
  title: 'Components/M3ScrollRail',

  component: M3ScrollRail,

  argTypes: {
    disabled: {
      control: 'boolean',
    },
  },

  args: {
    disabled: false,
  },

  render: (args) => {
    const items = Array.from({ length: 30 }, (_, i) => i + 1)
    return (
      <div className="m3-panel m3-panel_elevated-1" style={{ padding: '4px' }}>
        <div
          className="m3-scroll-box m3-scroll-box_scroll-x m3-scroll-box_scroll-y"
          style={{ maxWidth: '360px', maxHeight: '360px' }}
        >
          <div className="m3-scroll-box__content" style={{ padding: '0 8px' }}>
            <M3ScrollRail {...args} />
            <M3ScrollRail {...args} horizontal />
            {items.map(i => (
              <div key={i} style={{width: '480px'}}>
                Item {i}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3ScrollRail>

export default meta

type Story = StoryObj<typeof meta>

export const Both: Story = {}
