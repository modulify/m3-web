import type { M3MenuProps } from '@/components/menu'
import type { Meta, StoryObj } from '@storybook/react'

import { useCallback, useState } from 'react'

import { M3Button } from '@/components/button'
import { M3Divider } from '@/components/divider'
import { M3Icon } from '@/components/icon'
import { M3Menu, M3MenuItem } from '@/components/menu'

import { localize } from '../i18n'

const messages = {
  'en-US': { archive: 'Archive', editProfile: 'Edit profile', favorite: 'Favorite', items: ['Item 1', 'Item 2', 'Item 3'], open: 'Open menu', selected: 'Selected', more: 'More actions' },
  'ru-RU': { archive: 'Архивировать', editProfile: 'Изменить профиль', favorite: 'Избранное', items: ['Пункт 1', 'Пункт 2', 'Пункт 3'], open: 'Открыть меню', selected: 'Выбрано', more: 'Другие действия' },
}

const M3MenuStory = ({ locale, target: _target, ...args }: M3MenuProps & { locale: unknown }) => {
  const [target, setTarget] = useState<HTMLElement | null>(null)
  const [open, setOpen] = useState(false)
  const text = localize(locale, messages)
  const bindTarget = useCallback((el: HTMLElement) => {
    setTarget(el)
    return () => {
      setTarget(current => current === el ? null : current)
    }
  }, [])

  return (
    <div style={{ minHeight: '220px', minWidth: '240px' }}>
      <M3Button effects={[bindTarget]} aria-haspopup="menu" aria-expanded={open}>
        {text.open}
      </M3Button>

      <M3Menu
        target={target}
        {...args}
        onToggle={setOpen}
      >
        <M3MenuItem>{text.items[0]}</M3MenuItem>
        <M3MenuItem selection="single" selected={true}>{text.items[1]}</M3MenuItem>
        <M3MenuItem>{text.items[2]}</M3MenuItem>
      </M3Menu>
    </div>
  )
}

const meta = {
  title: 'Components/M3Menu',

  component: M3Menu,

  args: {
    target: null,
  },

  argTypes: {
    target: { control: false },
    shown: { control: false },
    onToggle: { control: false },
    onShow: { control: false },
    onHide: { control: false },
    onDispose: { control: false },
  },

  render: (args, { globals }) => <M3MenuStory locale={globals.locale} {...args} />,

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3Menu>

export default meta

type Story = StoryObj<typeof meta>

export const Standard: Story = {
  args: {
    target: null,
  },
}

export const Vibrant: Story = {
  args: { target: null, color: 'vibrant' },
}

export const GroupedWithSubmenu: Story = {
  args: { target: null },

  render: ({ target: _target, ...args }, { globals }) => {
    const [target, setTarget] = useState<HTMLElement | null>(null)
    const [open, setOpen] = useState(false)
    const text = localize(globals.locale, messages)
    const bindTarget = useCallback((el: HTMLElement) => {
      setTarget(el)
      return () => setTarget(current => current === el ? null : current)
    }, [])

    return <div style={{ minHeight: '260px', minWidth: '360px' }}>
      <M3Button effects={[bindTarget]} aria-haspopup="menu" aria-expanded={open}>{text.open}</M3Button>
      <M3Menu target={target} {...args} onToggle={setOpen}>
        <M3MenuItem>{text.editProfile}</M3MenuItem>
        <M3MenuItem>
          {text.more}
          <M3MenuItem.Submenu>
            <M3MenuItem>{text.favorite}</M3MenuItem>
            <M3MenuItem>{text.archive}</M3MenuItem>
          </M3MenuItem.Submenu>
        </M3MenuItem>
        <M3Divider role="separator" />
        <M3MenuItem disabled>{text.archive}</M3MenuItem>
      </M3Menu>
    </div>
  },
}

export const WithLeadingAndTrailingContent: Story = {
  args: {
    target: null,
  },

  render: ({ target: _target, ...args }, { globals }) => {
    const [target, setTarget] = useState<HTMLElement | null>(null)
    const [open, setOpen] = useState(false)
    const text = localize(globals.locale, messages)
    const bindTarget = useCallback((el: HTMLElement) => {
      setTarget(el)
      return () => {
        setTarget(current => current === el ? null : current)
      }
    }, [])

    return (
      <div style={{ minHeight: '220px', minWidth: '280px' }}>
        <M3Button effects={[bindTarget]} aria-haspopup="menu" aria-expanded={open}>
          {text.open}
        </M3Button>

        <M3Menu
          target={target}
          {...args}
          onToggle={setOpen}
        >
          <M3MenuItem>
            <M3MenuItem.Leading>
              <M3Icon name="edit" />
            </M3MenuItem.Leading>
            {text.editProfile}
          </M3MenuItem>

          <M3MenuItem selection="single" selected={true}>
            <M3MenuItem.Leading>
              <M3Icon name="favorite" />
            </M3MenuItem.Leading>
            {text.favorite}
            <M3MenuItem.Trailing>
              <span style={{ fontSize: '12px' }}>{text.selected}</span>
            </M3MenuItem.Trailing>
          </M3MenuItem>

          <M3MenuItem disabled={true}>
            {text.archive}
          </M3MenuItem>
        </M3Menu>
      </div>
    )
  },
}
