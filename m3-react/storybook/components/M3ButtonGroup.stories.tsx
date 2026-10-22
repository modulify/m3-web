import type { Meta, StoryObj } from '@storybook/react'

import { M3ButtonGroup, M3ButtonGroupItem } from '@/components/button-group'
import { M3Icon } from '@/components/icon'

import { localize } from '../i18n'

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
  render: (args, { globals }) => (
    <div style={{ width: 'min(560px, 90vw)', padding: '24px', background: 'var(--m3-sys-surface-container-low)', borderRadius: '24px' }}>
      <M3ButtonGroup aria-label={localize(globals.locale, { 'en-US': 'Calendar view', 'ru-RU': 'Вид календаря' })} {...args}>
        <M3ButtonGroupItem value="day"><M3Icon name="calendar_today" />{localize(globals.locale, { 'en-US': 'Day', 'ru-RU': 'День' })}</M3ButtonGroupItem>
        <M3ButtonGroupItem value="week"><M3Icon name="date_range" />{localize(globals.locale, { 'en-US': 'Week', 'ru-RU': 'Неделя' })}</M3ButtonGroupItem>
        <M3ButtonGroupItem value="month"><M3Icon name="calendar_month" />{localize(globals.locale, { 'en-US': 'Month', 'ru-RU': 'Месяц' })}</M3ButtonGroupItem>
      </M3ButtonGroup>
    </div>
  ),
  parameters: { layout: 'centered' },
} satisfies Meta<typeof M3ButtonGroup>

export default meta

type Story = StoryObj<typeof meta>

export const ConnectedSingle: Story = {}
export const ConnectedMultiple: Story = { args: { selection: 'multiple', defaultValue: ['day', 'week'] } }
export const ConnectedActions: Story = {
  render: (_args, { globals }) => (
    <div style={{ width: 'min(560px, 90vw)', padding: '24px', background: 'var(--m3-sys-surface-container-low)', borderRadius: '24px' }}>
      <M3ButtonGroup variant="connected" selection="none" aria-label={localize(globals.locale, { 'en-US': 'Document actions', 'ru-RU': 'Действия с документом' })}>
        <M3ButtonGroupItem value="copy"><M3Icon name="content_copy" />{localize(globals.locale, { 'en-US': 'Copy', 'ru-RU': 'Копировать' })}</M3ButtonGroupItem>
        <M3ButtonGroupItem value="download"><M3Icon name="download" />{localize(globals.locale, { 'en-US': 'Download', 'ru-RU': 'Скачать' })}</M3ButtonGroupItem>
        <M3ButtonGroupItem value="share"><M3Icon name="share" />{localize(globals.locale, { 'en-US': 'Share', 'ru-RU': 'Поделиться' })}</M3ButtonGroupItem>
      </M3ButtonGroup>
    </div>
  ),
}
export const ConnectedSquare: Story = { args: { rounding: 'square' } }
export const ConnectedLarge: Story = { args: { size: 'lg' } }

export const StandardActions: Story = {
  render: (args, { globals }) => (
    <div style={{ padding: '24px', background: 'var(--m3-sys-surface-container-low)', borderRadius: '24px' }}>
      <M3ButtonGroup variant="standard" size={args.size} rounding={args.rounding} aria-label={localize(globals.locale, { 'en-US': 'Editing actions', 'ru-RU': 'Действия редактирования' })}>
        <M3ButtonGroupItem value="save" appearance="filled"><M3Icon name="save" />{localize(globals.locale, { 'en-US': 'Save', 'ru-RU': 'Сохранить' })}</M3ButtonGroupItem>
        <M3ButtonGroupItem value="share" appearance="tonal"><M3Icon name="share" />{localize(globals.locale, { 'en-US': 'Share', 'ru-RU': 'Поделиться' })}</M3ButtonGroupItem>
        <M3ButtonGroupItem value="more" kind="icon" appearance="outlined" aria-label={localize(globals.locale, { 'en-US': 'More actions', 'ru-RU': 'Другие действия' })}><M3Icon name="more_vert" /></M3ButtonGroupItem>
      </M3ButtonGroup>
    </div>
  ),
}

export const ExtraSmallActions: Story = { ...StandardActions, args: { size: 'xs' } }
export const IconKinds: Story = {
  render: (_args, { globals }) => (
    <M3ButtonGroup variant="standard" aria-label={localize(globals.locale, { 'en-US': 'More actions', 'ru-RU': 'Дополнительные действия' })}>
      <M3ButtonGroupItem value="ordinary" aria-label={localize(globals.locale, { 'en-US': 'Ordinary icon-only button', 'ru-RU': 'Обычная кнопка с иконкой' })}>
        <M3Icon name="more_vert" />
      </M3ButtonGroupItem>
      <M3ButtonGroupItem value="icon" kind="icon" width="wide" aria-label={localize(globals.locale, { 'en-US': 'Wide icon button', 'ru-RU': 'Широкая кнопка с иконкой' })}>
        <M3Icon name="more_vert" />
      </M3ButtonGroupItem>
    </M3ButtonGroup>
  ),
}

export const MixedSizes: Story = {
  render: (_args, { globals }) => (
    <M3ButtonGroup variant="standard" size="sm" aria-label={localize(globals.locale, { 'en-US': 'Playback', 'ru-RU': 'Воспроизведение' })}>
      <M3ButtonGroupItem value="previous" kind="icon" appearance="tonal" aria-label={localize(globals.locale, { 'en-US': 'Previous', 'ru-RU': 'Назад' })}><M3Icon name="skip_previous" /></M3ButtonGroupItem>
      <M3ButtonGroupItem value="play" size="md" appearance="filled"><M3Icon name="play_arrow" />{localize(globals.locale, { 'en-US': 'Play', 'ru-RU': 'Играть' })}</M3ButtonGroupItem>
      <M3ButtonGroupItem value="next" kind="icon" appearance="tonal" aria-label={localize(globals.locale, { 'en-US': 'Next', 'ru-RU': 'Вперёд' })}><M3Icon name="skip_next" /></M3ButtonGroupItem>
    </M3ButtonGroup>
  ),
}

export const StandardToggle: Story = {
  args: { variant: 'standard', selection: 'multiple', defaultValue: ['day'] },
}
export const ExtraSmallToggle: Story = {
  args: { variant: 'standard', size: 'xs', selection: 'multiple', defaultValue: ['day'] },
}
