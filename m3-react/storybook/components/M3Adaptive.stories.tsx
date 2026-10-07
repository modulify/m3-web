import type { Meta, StoryObj } from '@storybook/react'

import { M3Adaptive } from '@/components/adaptive'
import { useM3Adaptive } from '@/hooks'

import { localize } from '../i18n'

const messages = {
  'en-US': { notice: 'Use adaptive content only as a last resort to meet Material 3 guidance. First reconsider how the affected component is used, or replace it where possible.' },
  'ru-RU': { notice: 'Адаптивное содержимое — крайнее средство для соблюдения рекомендаций Material 3. Сначала пересмотрите способ применения проблемного компонента или, если возможно, замените его.' },
}

const meta = {
  title: 'Components/M3Adaptive',
  component: M3Adaptive,
} satisfies Meta<typeof M3Adaptive>

export default meta

type Story = StoryObj<typeof meta>

function AdaptiveExample ({ notice }: { notice: string }) {
  const adaptive = useM3Adaptive()

  return <div style={{ display: 'grid', gap: 16, padding: 24 }}>
    <p>{notice}</p>
    <div>Hook: {adaptive('Inbox', { compact: 'Mail', large: 'Incoming messages' })}</div>
    <div>Props: <M3Adaptive regular="Inbox" compact="Mail" large="Incoming messages" /></div>
    <div>Slots: <M3Adaptive>
        Inbox
      <M3Adaptive.Compact>Mail</M3Adaptive.Compact>
      <M3Adaptive.Large>Incoming messages</M3Adaptive.Large>
    </M3Adaptive></div>
  </div>
}

export const BreakpointContent: Story = {
  render: (_args, { globals }) => <AdaptiveExample notice={localize(globals.locale, messages).notice} />,
}
