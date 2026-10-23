import type { Meta, StoryObj } from '@storybook/react'

import { M3ButtonGroup, M3ButtonGroupItem } from '@/components/button-group'
import { M3Icon } from '@/components/icon'

import { localize } from '../i18n'

const messages = {
  'en-US': {
    additionalActions: 'More actions',
    calendarView: 'Calendar view',
    copy: 'Copy',
    day: 'Day',
    documentActions: 'Document actions',
    download: 'Download',
    editingActions: 'Editing actions',
    iconButton: 'Wide icon button',
    month: 'Month',
    moreActions: 'More actions',
    next: 'Next',
    ordinaryButton: 'Ordinary icon-only button',
    play: 'Play',
    playback: 'Playback',
    previous: 'Previous',
    save: 'Save',
    share: 'Share',
    week: 'Week',
  },
  'ru-RU': {
    additionalActions: 'Дополнительные действия',
    calendarView: 'Вид календаря',
    copy: 'Копировать',
    day: 'День',
    documentActions: 'Действия с документом',
    download: 'Скачать',
    editingActions: 'Действия редактирования',
    iconButton: 'Широкая кнопка с иконкой',
    month: 'Месяц',
    moreActions: 'Другие действия',
    next: 'Вперёд',
    ordinaryButton: 'Обычная кнопка с иконкой',
    play: 'Играть',
    playback: 'Воспроизведение',
    previous: 'Назад',
    save: 'Сохранить',
    share: 'Поделиться',
    week: 'Неделя',
  },
}

const surfaceStyle = {
  background: 'var(--m3-sys-surface-container-low)',
  borderRadius: '24px',
  padding: '24px',
}

const meta = {
  title: 'Components/M3ButtonGroup',
  component: M3ButtonGroup,
  argTypes: {
    variant: { control: 'select', options: ['standard', 'connected'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    rounding: { control: 'select', options: ['round', 'square'] },
    selection: { control: 'select', options: ['none', 'single', 'multiple'] },
  },
  args: { variant: 'connected', size: 'sm', rounding: 'round', selection: 'single', defaultValue: 'day' },
  render: (args, { globals }) => {
    const text = localize(globals.locale, messages)

    return (
      <div style={{ ...surfaceStyle, width: 'min(560px, 90vw)' }}>
        <M3ButtonGroup aria-label={text.calendarView} {...args}>
          <M3ButtonGroupItem value="day">
            <M3Icon name="calendar_today" />{text.day}
          </M3ButtonGroupItem>
          <M3ButtonGroupItem value="week">
            <M3Icon name="date_range" />{text.week}
          </M3ButtonGroupItem>
          <M3ButtonGroupItem value="month">
            <M3Icon name="calendar_month" />{text.month}
          </M3ButtonGroupItem>
        </M3ButtonGroup>
      </div>
    )
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof M3ButtonGroup>

export default meta

type Story = StoryObj<typeof meta>

export const ConnectedSingle: Story = {}
export const ConnectedMultiple: Story = { args: { selection: 'multiple', defaultValue: ['day', 'week'] } }
export const ConnectedActions: Story = {
  render: (_args, { globals }) => {
    const text = localize(globals.locale, messages)

    return (
      <div style={{ ...surfaceStyle, width: 'min(560px, 90vw)' }}>
        <M3ButtonGroup variant="connected" selection="none" aria-label={text.documentActions}>
          <M3ButtonGroupItem value="copy">
            <M3Icon name="content_copy" />{text.copy}
          </M3ButtonGroupItem>
          <M3ButtonGroupItem value="download">
            <M3Icon name="download" />{text.download}
          </M3ButtonGroupItem>
          <M3ButtonGroupItem value="share">
            <M3Icon name="share" />{text.share}
          </M3ButtonGroupItem>
        </M3ButtonGroup>
      </div>
    )
  },
}
export const ConnectedSquare: Story = { args: { rounding: 'square' } }
export const ConnectedLarge: Story = { args: { size: 'lg' } }

export const StandardActions: Story = {
  render: (args, { globals }) => {
    const text = localize(globals.locale, messages)

    return (
      <div style={surfaceStyle}>
        <M3ButtonGroup variant="standard" size={args.size} rounding={args.rounding} aria-label={text.editingActions}>
          <M3ButtonGroupItem value="save" appearance="filled">
            <M3Icon name="save" />{text.save}
          </M3ButtonGroupItem>
          <M3ButtonGroupItem value="share" appearance="tonal">
            <M3Icon name="share" />{text.share}
          </M3ButtonGroupItem>
          <M3ButtonGroupItem value="more" kind="icon" appearance="outlined" aria-label={text.moreActions}>
            <M3Icon name="more_vert" />
          </M3ButtonGroupItem>
        </M3ButtonGroup>
      </div>
    )
  },
}

export const ExtraSmallActions: Story = { ...StandardActions, args: { size: 'xs' } }
export const IconKinds: Story = {
  render: (_args, { globals }) => {
    const text = localize(globals.locale, messages)

    return (
      <M3ButtonGroup variant="standard" aria-label={text.additionalActions}>
        <M3ButtonGroupItem value="ordinary" aria-label={text.ordinaryButton}>
          <M3Icon name="more_vert" />
        </M3ButtonGroupItem>
        <M3ButtonGroupItem value="icon" kind="icon" width="wide" aria-label={text.iconButton}>
          <M3Icon name="more_vert" />
        </M3ButtonGroupItem>
      </M3ButtonGroup>
    )
  },
}

export const MixedSizes: Story = {
  render: (_args, { globals }) => {
    const text = localize(globals.locale, messages)

    return (
      <M3ButtonGroup variant="standard" size="sm" aria-label={text.playback}>
        <M3ButtonGroupItem value="previous" kind="icon" appearance="tonal" aria-label={text.previous}>
          <M3Icon name="skip_previous" />
        </M3ButtonGroupItem>
        <M3ButtonGroupItem value="play" size="md" appearance="filled">
          <M3Icon name="play_arrow" />{text.play}
        </M3ButtonGroupItem>
        <M3ButtonGroupItem value="next" kind="icon" appearance="tonal" aria-label={text.next}>
          <M3Icon name="skip_next" />
        </M3ButtonGroupItem>
      </M3ButtonGroup>
    )
  },
}

export const StandardToggle: Story = {
  args: { variant: 'standard', selection: 'multiple', defaultValue: ['day'] },
}
export const ExtraSmallToggle: Story = {
  args: { variant: 'standard', size: 'xs', selection: 'multiple', defaultValue: ['day'] },
}
