import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { useEffect, useRef, useState } from 'react'

import { M3Button } from '@/components/button'
import { M3Progress, M3ProgressCircle, M3ProgressLine } from '@/components/progress'

import { localize } from '../i18n'

const ProgressUpdate = ({ label }: { label: string }) => {
  const [value, setValue] = useState(30)

  return <div className="d-grid gap-6" style={{ width: 320 }}>
    <M3ProgressLine value={value} aria-label={label} />
    <input type="range" min="0" max="100" value={value} aria-label={label} onChange={event => setValue(Number(event.target.value))} />
  </div>
}

const CircularProgressUpdate = ({ label }: { label: string }) => {
  const [value, setValue] = useState(40)

  return <div className="d-grid gap-6" style={{ width: 320 }}>
    <div className="d-flex gap-8 align-items-center">
      <M3ProgressCircle value={value} aria-label={`${label} (flat)`} />
      <M3ProgressCircle shape="wavy" value={value} aria-label={`${label} (wavy)`} />
    </div>
    <input type="range" min="0" max="100" value={value} aria-label={label} onChange={event => setValue(Number(event.target.value))} />
  </div>
}

const ButtonLoading = ({ label, loadingLabel }: { label: string; loadingLabel: string }) => {
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
    aria-disabled={loading}
    aria-busy={loading}
    aria-label={loading ? loadingLabel : undefined}
    style={{ minInlineSize: 200 }}
    onClick={start}
  >
    {loading ? <M3ProgressCircle
      track={false}
      size={24}
      aria-hidden="true"
      style={{ '--m3-progress-color': 'currentColor' } as CSSProperties}
      indeterminate
    /> : label}
  </M3Button>
}

const meta = {
  title: 'Components/M3Progress',
  component: M3Progress,

  argTypes: {
    variant: { control: 'select', options: ['linear', 'circular'] },
    shape: { control: 'select', options: ['flat', 'wavy'] },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    thickness: { control: { type: 'range', min: 1, max: 12, step: 1 } },
    size: { control: { type: 'range', min: 24, max: 240, step: 4 } },
  },

  args: {
    variant: 'linear',
    shape: 'flat',
    value: 40,
    indeterminate: false,
    track: true,
    stop: true,
  },

  render: (args, { globals }) => {
    const label = localize(globals.locale, {
      'en-US': 'Loading article',
      'ru-RU': 'Загрузка статьи',
    })

    return <div style={{ width: args.variant === 'linear' ? 360 : undefined }}>
      <M3Progress aria-label={label} {...args} />
    </div>
  },

  parameters: { layout: 'centered' },
} satisfies Meta<typeof M3Progress>

export default meta

type Story = StoryObj<typeof meta>

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const Linear: Story = {}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const Circular: Story = { args: { variant: 'circular' } }

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const WavyLinear: Story = { args: { shape: 'wavy' } }

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const WavyCircular: Story = { args: { variant: 'circular', shape: 'wavy' } }

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const IndeterminateLinear: Story = { args: { indeterminate: true } }

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const WavyIndeterminateLinear: Story = { args: { shape: 'wavy', indeterminate: true } }

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const IndeterminateCircular: Story = { args: { variant: 'circular', indeterminate: true } }

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const WavyIndeterminate: Story = { args: { variant: 'circular', shape: 'wavy', indeterminate: true } }

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const WavyCircularMotion: Story = {
  args: { variant: 'circular', shape: 'wavy', indeterminate: true },
  render: (args, { globals }) => {
    const label = localize(globals.locale, {
      'en-US': 'Loading article',
      'ru-RU': 'Загрузка статьи',
    })

    return <div className="d-flex gap-8 align-items-center">
      {[48, 96, 160].map(size => <M3Progress key={size} aria-label={`${label} (${size}px)`} {...{ ...args, size }} />)}
    </div>
  },
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const ThickLinear: Story = { args: { thickness: 8, shape: 'wavy' } }

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const SmallProgress: Story = { args: { value: 1 } }

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const InButton: Story = {
  render: (_args, { globals }) => {
    return <ButtonLoading
      label={localize(globals.locale, {
        'en-US': 'Download episode',
        'ru-RU': 'Скачать эпизод',
      })}
      loadingLabel={localize(globals.locale, {
        'en-US': 'Downloading episode',
        'ru-RU': 'Загрузка эпизода',
      })}
    />
  },
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const RightToLeft: Story = {
  args: { value: 30 },
  render: (args, { globals }) => {
    const label = localize(globals.locale, {
      'en-US': 'Loading article',
      'ru-RU': 'Загрузка статьи',
    })

    return <div dir="rtl" style={{ width: 360 }}>
      <M3Progress aria-label={label} {...args} />
    </div>
  },
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const ProgressChanges: Story = {
  render: (_args, { globals }) => <ProgressUpdate label={localize(globals.locale, {
    'en-US': 'Loading article',
    'ru-RU': 'Загрузка статьи',
  })} />,
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const CircularProgressChanges: Story = {
  render: (_args, { globals }) => <CircularProgressUpdate label={localize(globals.locale, {
    'en-US': 'Loading article',
    'ru-RU': 'Загрузка статьи',
  })} />,
}
