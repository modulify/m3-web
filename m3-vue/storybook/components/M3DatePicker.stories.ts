import type { Meta, StoryObj } from '@storybook/vue3'

import { ref } from 'vue'

import { M3Button } from '@/components/button'
import {
  M3DatePicker,
  M3DatePickerDialog,
  M3DatePickerField,
} from '@/components/date-picker'

const INITIAL_DATE = new Date(2026, 6, 1)
const MIN_DATE = new Date(2026, 6, 3)
const MAX_DATE = new Date(2026, 6, 24)
const INITIAL_RANGE = [new Date(2026, 6, 17), new Date(2026, 6, 23)]

const meta = {
  title: 'Components/M3DatePicker',

  component: M3DatePicker,

  args: {
    type: 'single',
    value: INITIAL_DATE,
    label: 'Select date',
    locale: 'en-US',
    firstDayOfWeek: 0,
    navigation: 'split',
    views: ['days', 'months', 'years'],
    disabled: false,
  },

  argTypes: {
    value: { control: false },
    min: { control: false },
    max: { control: false },
    yearRange: { control: false },
    availability: { control: false },
    cursor: { control: false },
  },

  render: (args: unknown) => ({
    components: {
      M3DatePicker,
    },

    setup: () => ({
      args,
      selectedDate: ref((args as { value?: Date }).value ?? INITIAL_DATE),
    }),

    template: `
        <M3DatePicker
            v-bind="args"
            v-model:value="selectedDate"
        />
    `,
  }),

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3DatePicker>

export default meta

type Story = StoryObj<typeof meta>

export const Standard: Story = {}

export const MondayFirst: Story = {
  args: {
    firstDayOfWeek: 1,
  },
}

export const RestrictedRange: Story = {
  args: {
    value: new Date(2026, 6, 10),
    min: MIN_DATE,
    max: MAX_DATE,
  },
}

export const Availability: Story = {
  args: {
    value: new Date(2026, 6, 10),
    availability: {
      isDateSelectable: (date: Date) => date.getDay() !== 0 && date.getDay() !== 6,
      isYearSelectable: (year: number) => year >= 2026,
    },
  },
}

export const RangeSelection: Story = {
  args: {
    label: 'Depart - Return dates',
  },

  render: (args: unknown) => ({
    components: {
      M3DatePicker,
    },

    setup: () => ({
      args,
      selectedRange: ref(INITIAL_RANGE),
    }),

    template: `
        <M3DatePicker
            v-bind="args"
            v-model:value="selectedRange"
            type="range"
        />
    `,
  }),
}

export const ControlledCursor: Story = {
  render: (args: unknown) => ({
    components: {
      M3DatePicker,
    },

    setup: () => ({
      args,
      selectedDate: ref((args as { value?: Date }).value ?? INITIAL_DATE),
      cursor: ref(new Date(2026, 8, 1)),
    }),

    template: `
        <M3DatePicker
            v-bind="args"
            v-model:value="selectedDate"
            v-model:cursor="cursor"
        />
    `,
  }),
}

export const WithoutNavigation: Story = {
  args: {
    navigation: 'none',
  },
}

export const WithoutYearView: Story = {
  args: {
    views: ['days', 'months'],
  },
}

export const SwipeNavigation: Story = {
  args: {
    value: new Date(2026, 6, 10),
  },
}

export const InlineNavigation: Story = {
  args: {
    value: new Date(2026, 6, 10),
    navigation: 'inline',
  },
}

export const DockedField: Story = {
  render: () => ({
    components: {
      M3DatePickerField,
    },

    setup: () => ({
      selectedDate: ref(new Date(2026, 6, 10)),
    }),

    template: `
        <div style="width: 320px;">
            <M3DatePickerField
                v-model:value="selectedDate"
                label="Trip date"
                name="trip_date"
                placeholder="MM/DD/YYYY"
            >
                <template #supporting-text>
                    MM/DD/YYYY
                </template>
            </M3DatePickerField>
        </div>
    `,
  }),
}

export const ModalComposition: Story = {
  render: (args: unknown) => ({
    components: {
      M3Button,
      M3DatePickerDialog,
    },

    setup: () => ({
      args,
      opened: ref(true),
      selectedDate: ref((args as { value?: Date }).value ?? INITIAL_DATE),
    }),

    template: `
        <div>
            <M3Button @click="opened = true">
                Open date picker
            </M3Button>

            <M3DatePickerDialog
                v-model:opened="opened"
                v-bind="args"
                v-model:value="selectedDate"
            />
        </div>
    `,
  }),
}

export const ModalDateInput: Story = {
  render: (args: unknown) => ({
    components: {
      M3Button,
      M3DatePickerDialog,
    },

    setup: () => ({
      args,
      opened: ref(false),
      selectedDate: ref((args as { value?: Date }).value ?? INITIAL_DATE),
    }),

    template: `
        <div>
            <M3Button @click="opened = true">
                Open date input
            </M3Button>

            <M3DatePickerDialog
                v-model:opened="opened"
                v-bind="args"
                appearance="input"
                v-model:value="selectedDate"
            />
        </div>
    `,
  }),
}
