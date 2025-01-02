import type { Meta, StoryObj } from '@storybook/vue3'

import { M3Switch } from '@/components/switch'
import { ref } from 'vue'

import useId from '@/composables/id'

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
    components: {
      M3Switch,
    },

    setup: () => ({
      id: useId('m3-switch'),
      args,
      checked: ref(false),
    }),

    template: `
      <div class="flex-row">
          <label :for="id" class="mr-6">Airplane mode</label>

          <M3Switch
              :id="id"
              v-model:checked="checked"
              v-bind="args"
          />
      </div>
    `,
  }),

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3Switch>

export default meta

type Story = StoryObj<typeof meta>

export const StandardSwitch: Story = {}
