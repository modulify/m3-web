import type { Meta, StoryObj } from '@storybook/vue3'

import { M3Switch } from '@/components/switch'
import { ref } from 'vue'

import makeId from '@/utils/id'

const meta = {
  title: 'Components/M3Switch',

  component: M3Switch,

  argTypes: {
    id: { control: false },
    checked: { control: false },
    name: { control: false },
  },

  args: {
    disabled: false,
  },

  render: (args: unknown) => ({
    components: { M3Switch },

    setup () {
      return {
        id: makeId('m3-switch'),
        args,
        checked: ref(false),
      }
    },

    template: `
        <div style="display: flex; align-items: center; gap: 8px;">
            <M3Switch
                :id="id"
                :aria-labelledby="id + '-label'"
                v-model:checked="checked"
                v-bind="args"
            /> <label :id="id + '-label'" :for="id">Choice</label>
        </div>
    `,
  }),

  tags: ['autodocs'],

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3Switch>

export default meta

type Story = StoryObj<typeof meta>

export const DefaultSwitch: Story = {}
