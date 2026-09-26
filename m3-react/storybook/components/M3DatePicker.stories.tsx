import type {
  M3DatePickerFieldProps,
  M3DatePickerSingleProps,
} from '@/components/date-picker'
import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { M3Button } from '@/components/button'
import {
  M3DatePicker,
  M3DatePickerDialog,
  M3DatePickerField,
} from '@/components/date-picker'

const INITIAL_DATE = new Date(2026, 6, 1)
const MIN_DATE = new Date(2026, 6, 3)
const MAX_DATE = new Date(2026, 6, 24)
const INITIAL_RANGE: [Date | null, Date | null] = [new Date(2026, 6, 17), new Date(2026, 6, 23)]

const M3DatePickerStory = ({
  type: _type,
  value: initialValue,
  onChange: _onChange,
  ...args
}: M3DatePickerSingleProps) => {
  const [value, setValue] = useState<Date | null>(initialValue ?? INITIAL_DATE)

  return (
    <M3DatePicker
      type="single"
      value={value}
      {...args}
      onChange={setValue}
    />
  )
}

const M3DatePickerFieldStory = ({
  value: initialValue,
  onChange: _onChange,
  ...args
}: M3DatePickerFieldProps) => {
  const [value, setValue] = useState<Date | null>(initialValue ?? INITIAL_DATE)

  return (
    <div style={{ width: 320 }}>
      <M3DatePickerField
        value={value}
        {...args}
        onChange={setValue}
      />
    </div>
  )
}

const meta = {
  title: 'Components/M3DatePicker',

  component: M3DatePicker as NonNullable<Meta<M3DatePickerSingleProps>['component']>,

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
    onCursorChange: { control: false },
    onChange: { control: false },
  },

  render: (args) => <M3DatePickerStory {...args} />,

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<M3DatePickerSingleProps>

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
      isDateSelectable: date => date.getDay() !== 0 && date.getDay() !== 6,
      isYearSelectable: year => year >= 2026,
    },
  },
}

export const RangeSelection: Story = {
  args: {
    label: 'Depart - Return dates',
  },

  render: ({
    type: _type,
    value: _value,
    onChange: _onChange,
    ...args
  }) => {
    const [value, setValue] = useState<[Date | null, Date | null]>(INITIAL_RANGE)

    return (
      <M3DatePicker
        type="range"
        value={value}
        {...args}
        onChange={setValue}
      />
    )
  },
}

export const ControlledCursor: Story = {
  render: ({
    type: _type,
    value: initialValue,
    cursor: _cursor,
    onCursorChange: _onCursorChange,
    onChange: _onChange,
    ...args
  }) => {
    const [value, setValue] = useState<Date | null>(initialValue ?? INITIAL_DATE)
    const [cursor, setCursor] = useState(new Date(2026, 8, 1))

    return (
      <M3DatePicker
        type="single"
        value={value}
        cursor={cursor}
        {...args}
        onCursorChange={setCursor}
        onChange={setValue}
      />
    )
  },
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
  render: () => (
    <M3DatePickerFieldStory
      value={new Date(2026, 6, 10)}
      label="Trip date"
      name="trip_date"
      supportingText={<span>MM/DD/YYYY</span>}
      placeholder="MM/DD/YYYY"
    />
  ),
}

export const ModalComposition: Story = {
  render: ({
    value: initialValue,
    onChange: _onChange,
    ...args
  }) => {
    const [opened, setOpened] = useState(true)
    const [value, setValue] = useState<Date | null>(initialValue ?? INITIAL_DATE)

    return (
      <div>
        <M3Button onClick={() => setOpened(true)}>
          Open date picker
        </M3Button>

        <M3DatePickerDialog
          opened={opened}
          value={value}
          {...args}
          onToggle={setOpened}
          onChange={setValue}
        />
      </div>
    )
  },
}

export const ModalDateInput: Story = {
  render: ({
    value: initialValue,
    onChange: _onChange,
    ...args
  }) => {
    const [opened, setOpened] = useState(false)
    const [value, setValue] = useState<Date | null>(initialValue ?? INITIAL_DATE)

    return (
      <div>
        <M3Button onClick={() => setOpened(true)}>
          Open date input
        </M3Button>

        <M3DatePickerDialog
          opened={opened}
          appearance="input"
          value={value}
          {...args}
          onToggle={setOpened}
          onChange={setValue}
        />
      </div>
    )
  },
}
