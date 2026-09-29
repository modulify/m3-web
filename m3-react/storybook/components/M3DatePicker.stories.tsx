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

import { localize, resolveStorybookLocale } from '../i18n'

const INITIAL_DATE = new Date(2026, 6, 1)
const MIN_DATE = new Date(2026, 6, 3)
const MAX_DATE = new Date(2026, 6, 24)
const INITIAL_RANGE: [Date | null, Date | null] = [new Date(2026, 6, 17), new Date(2026, 6, 23)]

const messages = {
  'en-US': {
    openDateInput: 'Open date input',
    openDatePicker: 'Open date picker',
    rangeDates: 'Depart - Return dates',
    selectDate: 'Select date',
    tripDate: 'Trip date',
  },
  'ru-RU': {
    openDateInput: 'Открыть ввод даты',
    openDatePicker: 'Открыть календарь',
    rangeDates: 'Даты отправления и возвращения',
    selectDate: 'Выберите дату',
    tripDate: 'Дата поездки',
  },
}

const getLocalizedArgs = <T extends object>(
  args: T,
  localeValue: unknown,
  label: 'rangeDates' | 'selectDate' = 'selectDate'
) => {
  const locale = resolveStorybookLocale(localeValue)

  return {
    ...args,
    label: localize(locale, messages)[label],
    locale,
  }
}

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
    firstDayOfWeek: 0,
    navigation: 'split',
    views: ['days', 'months', 'years'],
    disabled: false,
  },

  argTypes: {
    label: { control: false },
    locale: { control: false },
    value: { control: false },
    min: { control: false },
    max: { control: false },
    yearRange: { control: false },
    availability: { control: false },
    cursor: { control: false },
    onCursorChange: { control: false },
    onChange: { control: false },
  },

  render: (args, { globals }) => (
    <M3DatePickerStory {...getLocalizedArgs(args, globals.locale)} />
  ),

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
  render: ({
    type: _type,
    value: _value,
    onChange: _onChange,
    ...args
  }, { globals }) => {
    const [value, setValue] = useState<[Date | null, Date | null]>(INITIAL_RANGE)
    const localizedArgs = getLocalizedArgs(args, globals.locale, 'rangeDates')

    return (
      <M3DatePicker
        type="range"
        value={value}
        {...localizedArgs}
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
  }, { globals }) => {
    const [value, setValue] = useState<Date | null>(initialValue ?? INITIAL_DATE)
    const [cursor, setCursor] = useState(new Date(2026, 8, 1))
    const localizedArgs = getLocalizedArgs(args, globals.locale)

    return (
      <M3DatePicker
        type="single"
        value={value}
        cursor={cursor}
        {...localizedArgs}
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
  render: (_args, { globals }) => {
    const locale = resolveStorybookLocale(globals.locale)

    return (
      <M3DatePickerFieldStory
        value={new Date(2026, 6, 10)}
        label={localize(locale, messages).tripDate}
        locale={locale}
        name="trip_date"
        supportingText={<span>MM/DD/YYYY</span>}
        placeholder="MM/DD/YYYY"
      />
    )
  },
}

export const ModalComposition: Story = {
  render: ({
    value: initialValue,
    onChange: _onChange,
    ...args
  }, { globals }) => {
    const [opened, setOpened] = useState(true)
    const [value, setValue] = useState<Date | null>(initialValue ?? INITIAL_DATE)
    const locale = resolveStorybookLocale(globals.locale)
    const text = localize(locale, messages)
    const localizedArgs = getLocalizedArgs(args, locale)

    return (
      <div>
        <M3Button onClick={() => setOpened(true)}>
          {text.openDatePicker}
        </M3Button>

        <M3DatePickerDialog
          opened={opened}
          value={value}
          {...localizedArgs}
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
  }, { globals }) => {
    const [opened, setOpened] = useState(false)
    const [value, setValue] = useState<Date | null>(initialValue ?? INITIAL_DATE)
    const locale = resolveStorybookLocale(globals.locale)
    const text = localize(locale, messages)
    const localizedArgs = getLocalizedArgs(args, locale)

    return (
      <div>
        <M3Button onClick={() => setOpened(true)}>
          {text.openDateInput}
        </M3Button>

        <M3DatePickerDialog
          opened={opened}
          appearance="input"
          value={value}
          {...localizedArgs}
          onToggle={setOpened}
          onChange={setValue}
        />
      </div>
    )
  },
}
