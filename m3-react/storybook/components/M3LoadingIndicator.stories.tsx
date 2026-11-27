import type { Meta, StoryObj } from '@storybook/react'

import { useEffect, useRef, useState } from 'react'

import { M3Button } from '@/components/button'
import { M3LoadingIndicator } from '@/components/loading-indicator'

import { localize } from '../i18n'

const ButtonLoading = ({ label, busyLabel }: { label: string; busyLabel: string }) => {
  const [loading, setLoading] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const start = () => {
    if (loading) return

    setLoading(true)
    timer.current = window.setTimeout(() => setLoading(false), 2400)
  }

  return <M3Button
    appearance="tonal"
    aria-busy={loading}
    aria-disabled={loading}
    aria-label={loading ? busyLabel : undefined}
    style={{ minInlineSize: 200 }}
    onClick={start}
  >
    {loading
      ? <M3LoadingIndicator size={24} aria-hidden="true" style={{ color: 'currentColor' }} />
      : label}
  </M3Button>
}

const meta = {
  title: 'Components/M3LoadingIndicator',
  component: M3LoadingIndicator,

  argTypes: {
    size: { control: { type: 'range', min: 24, max: 240, step: 4 } },
  },

  args: {
    contained: false,
    size: 48,
  },

  render: (args, { globals }) => <M3LoadingIndicator
    aria-label={localize(globals.locale, {
      'en-US': 'Loading article',
      'ru-RU': 'Загрузка статьи',
    })}
    {...args}
  />,

  parameters: { layout: 'centered' },
} satisfies Meta<typeof M3LoadingIndicator>

export default meta

type Story = StoryObj<typeof meta>

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const Default: Story = {}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const Contained: Story = { args: { contained: true } }

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const Sizes: Story = {
  render: (_args, { globals }) => {
    const label = localize(globals.locale, {
      'en-US': 'Loading article',
      'ru-RU': 'Загрузка статьи',
    })

    return <div className="d-flex gap-8 align-items-center">
      {[24, 48, 96, 160].map(size => <M3LoadingIndicator
        key={size}
        size={size}
        aria-label={`${label} (${size}px)`}
      />)}
    </div>
  },
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const InButton: Story = {
  render: (_args, { globals }) => <ButtonLoading
    label={localize(globals.locale, {
      'en-US': 'Save changes',
      'ru-RU': 'Сохранить изменения',
    })}
    busyLabel={localize(globals.locale, {
      'en-US': 'Saving changes',
      'ru-RU': 'Сохранение изменений',
    })}
  />,
}
