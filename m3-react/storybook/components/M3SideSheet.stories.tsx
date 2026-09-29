import type { M3SideSheetProps } from '@/components/side-sheet'
import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3SideSheet } from '@/components/side-sheet'

import { localize } from '../i18n'

const M3SideSheetStory = ({
  shown: _shown,
  locale,
  onToggle: _onToggle,
  ...args
}: M3SideSheetProps & { locale: unknown }) => {
  const [shown, setShown] = useState(false)
  const text = localize(locale, {
    'en-US': { body: 'Choose filters and apply changes.', filter: 'Filters', footer: 'Footer actions', open: 'Open side sheet' },
    'ru-RU': { body: 'Выберите фильтры и примените изменения.', filter: 'Фильтры', footer: 'Действия', open: 'Открыть боковую панель' },
  })

  return (
    <>
      <M3Button onClick={() => setShown(true)}>{text.open}</M3Button>

      <M3SideSheet
        shown={shown}
        {...args}
        onToggle={setShown}
      >
        <M3SideSheet.Title>
          {text.filter}
        </M3SideSheet.Title>

        <M3SideSheet.CloseIcon>
          <M3Icon name="close" />
        </M3SideSheet.CloseIcon>

        <p className="m-4">{text.body}</p>

        <M3SideSheet.Footer>
          <div className="p-4">{text.footer}</div>
        </M3SideSheet.Footer>
      </M3SideSheet>
    </>
  )
}

const meta = {
  title: 'Components/M3SideSheet',

  component: M3SideSheet,

  argTypes: {
    onToggle: { control: false },
  },

  args: {
    docked: false,
  },

  render: (args, { globals }) => <M3SideSheetStory locale={globals.locale} {...args} />,

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3SideSheet>

export default meta

type Story = StoryObj<typeof meta>

export const Standard: Story = {}

export const Docked: Story = {
  args: {
    docked: true,
  },
}
