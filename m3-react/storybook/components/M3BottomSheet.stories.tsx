import type { M3BottomSheetProps } from '@/components/bottom-sheet'
import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { M3BottomSheet } from '@/components/bottom-sheet'
import { M3Button } from '@/components/button'

import { localize } from '../i18n'

const BottomSheetStory = ({ locale, shown: _shown, expanded: _expanded, ...args }: M3BottomSheetProps & { locale: unknown }) => {
  const [shown, setShown] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const text = localize(locale, {
    'en-US': { open: 'Open bottom sheet', close: 'Close', expand: 'Expand', collapse: 'Collapse', resize: 'Resize bottom sheet', title: 'Choose a destination', item: 'Destination' },
    'ru-RU': { open: 'Открыть нижнюю панель', close: 'Закрыть', expand: 'Развернуть', collapse: 'Свернуть', resize: 'Изменить высоту панели', title: 'Выберите место', item: 'Место' },
  })

  return (
    <div className="p-6">
      <M3Button onClick={() => setShown(true)}>{text.open}</M3Button>
      <M3BottomSheet
        shown={shown}
        expanded={expanded}
        label={text.resize}
        aria-label={text.title}
        {...args}
        onToggle={setShown}
        onExpand={setExpanded}
      >
        <div className="p-6">
          <h2 className="m-0">{text.title}</h2>
          {args.handle === false && <M3Button onClick={() => setExpanded(!expanded)}>{expanded ? text.collapse : text.expand}</M3Button>}
          {Array.from({ length: 12 }, (_, index) => <p key={index}>{text.item} {index + 1}</p>)}
          <M3Button onClick={() => setShown(false)}>{text.close}</M3Button>
        </div>
      </M3BottomSheet>
    </div>
  )
}

const meta = {
  title: 'Components/M3BottomSheet',
  component: M3BottomSheet,
  argTypes: { shown: { control: false }, expanded: { control: false }, onToggle: { control: false }, onExpand: { control: false } },
  args: { variant: 'standard', peek: 280 },
  render: (args, { globals }) => <BottomSheetStory locale={globals.locale} {...args} />,
} satisfies Meta<typeof M3BottomSheet>

export default meta
type Story = StoryObj<typeof meta>

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const Standard: Story = {}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const Modal: Story = { args: { variant: 'modal', peek: undefined } }

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const WithoutHandle: Story = { args: { handle: false } }
