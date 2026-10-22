import type { Meta, StoryObj } from '@storybook/vue3'

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
  render: (args: unknown, { globals }) => ({
    components: { M3ButtonGroup, M3ButtonGroupItem, M3Icon },
    setup () {
      return {
        args,
        groupLabel: localize(globals.locale, { 'en-US': 'Calendar view', 'ru-RU': 'Вид календаря' }),
        day: localize(globals.locale, { 'en-US': 'Day', 'ru-RU': 'День' }),
        week: localize(globals.locale, { 'en-US': 'Week', 'ru-RU': 'Неделя' }),
        month: localize(globals.locale, { 'en-US': 'Month', 'ru-RU': 'Месяц' }),
      }
    },
    template: `
      <div style="width: min(560px, 90vw); padding: 24px; background: var(--m3-sys-surface-container-low); border-radius: 24px">
        <M3ButtonGroup v-bind="args" :aria-label="groupLabel">
          <M3ButtonGroupItem value="day"><M3Icon name="calendar_today" />{{ day }}</M3ButtonGroupItem>
          <M3ButtonGroupItem value="week"><M3Icon name="date_range" />{{ week }}</M3ButtonGroupItem>
          <M3ButtonGroupItem value="month"><M3Icon name="calendar_month" />{{ month }}</M3ButtonGroupItem>
        </M3ButtonGroup>
      </div>
    `,
  }),
  parameters: { layout: 'centered' },
} satisfies Meta<typeof M3ButtonGroup>

export default meta

type Story = StoryObj<typeof meta>

export const ConnectedSingle: Story = {}
export const ConnectedMultiple: Story = { args: { selection: 'multiple', defaultValue: ['day', 'week'] } }
export const ConnectedActions: Story = {
  render: (_args, { globals }) => ({
    components: { M3ButtonGroup, M3ButtonGroupItem, M3Icon },
    setup () {
      return {
        groupLabel: localize(globals.locale, { 'en-US': 'Document actions', 'ru-RU': 'Действия с документом' }),
        copy: localize(globals.locale, { 'en-US': 'Copy', 'ru-RU': 'Копировать' }),
        download: localize(globals.locale, { 'en-US': 'Download', 'ru-RU': 'Скачать' }),
        share: localize(globals.locale, { 'en-US': 'Share', 'ru-RU': 'Поделиться' }),
      }
    },
    template: `
      <div style="width: min(560px, 90vw); padding: 24px; background: var(--m3-sys-surface-container-low); border-radius: 24px">
        <M3ButtonGroup variant="connected" selection="none" :aria-label="groupLabel">
          <M3ButtonGroupItem value="copy"><M3Icon name="content_copy" />{{ copy }}</M3ButtonGroupItem>
          <M3ButtonGroupItem value="download"><M3Icon name="download" />{{ download }}</M3ButtonGroupItem>
          <M3ButtonGroupItem value="share"><M3Icon name="share" />{{ share }}</M3ButtonGroupItem>
        </M3ButtonGroup>
      </div>
    `,
  }),
}
export const ConnectedSquare: Story = { args: { rounding: 'square' } }
export const ConnectedLarge: Story = { args: { size: 'lg' } }

export const StandardActions: Story = {
  render: (args, { globals }) => ({
    components: { M3ButtonGroup, M3ButtonGroupItem, M3Icon },
    setup () {
      return {
        args,
        groupLabel: localize(globals.locale, { 'en-US': 'Editing actions', 'ru-RU': 'Действия редактирования' }),
        save: localize(globals.locale, { 'en-US': 'Save', 'ru-RU': 'Сохранить' }),
        share: localize(globals.locale, { 'en-US': 'Share', 'ru-RU': 'Поделиться' }),
        more: localize(globals.locale, { 'en-US': 'More actions', 'ru-RU': 'Другие действия' }),
      }
    },
    template: `
      <div style="padding: 24px; background: var(--m3-sys-surface-container-low); border-radius: 24px">
        <M3ButtonGroup variant="standard" :size="args.size" :rounding="args.rounding" :aria-label="groupLabel">
          <M3ButtonGroupItem value="save" appearance="filled"><M3Icon name="save" />{{ save }}</M3ButtonGroupItem>
          <M3ButtonGroupItem value="share" appearance="tonal"><M3Icon name="share" />{{ share }}</M3ButtonGroupItem>
          <M3ButtonGroupItem value="more" kind="icon" appearance="outlined" :aria-label="more"><M3Icon name="more_vert" /></M3ButtonGroupItem>
        </M3ButtonGroup>
      </div>
    `,
  }),
}

export const ExtraSmallActions: Story = { ...StandardActions, args: { size: 'xs' } }
export const IconKinds: Story = {
  render: (_args, { globals }) => ({
    components: { M3ButtonGroup, M3ButtonGroupItem, M3Icon },
    setup () {
      return {
        groupLabel: localize(globals.locale, { 'en-US': 'More actions', 'ru-RU': 'Дополнительные действия' }),
        ordinary: localize(globals.locale, { 'en-US': 'Ordinary icon-only button', 'ru-RU': 'Обычная кнопка с иконкой' }),
        icon: localize(globals.locale, { 'en-US': 'Wide icon button', 'ru-RU': 'Широкая кнопка с иконкой' }),
      }
    },
    template: `<M3ButtonGroup variant="standard" :aria-label="groupLabel">
      <M3ButtonGroupItem value="ordinary" :aria-label="ordinary"><M3Icon name="more_vert" /></M3ButtonGroupItem>
      <M3ButtonGroupItem value="icon" kind="icon" width="wide" :aria-label="icon"><M3Icon name="more_vert" /></M3ButtonGroupItem>
    </M3ButtonGroup>`,
  }),
}

export const MixedSizes: Story = {
  render: (_args, { globals }) => ({
    components: { M3ButtonGroup, M3ButtonGroupItem, M3Icon },
    setup () {
      return {
        groupLabel: localize(globals.locale, { 'en-US': 'Playback', 'ru-RU': 'Воспроизведение' }),
        previous: localize(globals.locale, { 'en-US': 'Previous', 'ru-RU': 'Назад' }),
        play: localize(globals.locale, { 'en-US': 'Play', 'ru-RU': 'Играть' }),
        next: localize(globals.locale, { 'en-US': 'Next', 'ru-RU': 'Вперёд' }),
      }
    },
    template: `<M3ButtonGroup variant="standard" size="sm" :aria-label="groupLabel">
      <M3ButtonGroupItem value="previous" kind="icon" appearance="tonal" :aria-label="previous"><M3Icon name="skip_previous" /></M3ButtonGroupItem>
      <M3ButtonGroupItem value="play" size="md" appearance="filled"><M3Icon name="play_arrow" />{{ play }}</M3ButtonGroupItem>
      <M3ButtonGroupItem value="next" kind="icon" appearance="tonal" :aria-label="next"><M3Icon name="skip_next" /></M3ButtonGroupItem>
    </M3ButtonGroup>`,
  }),
}

export const StandardToggle: Story = { args: { variant: 'standard', selection: 'multiple', defaultValue: ['day'] } }
export const ExtraSmallToggle: Story = { args: { variant: 'standard', size: 'xs', selection: 'multiple', defaultValue: ['day'] } }
