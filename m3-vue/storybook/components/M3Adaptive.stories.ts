import type { Meta, StoryObj } from '@storybook/vue3'

import { M3Adaptive } from '@/components/adaptive'
import { m3Adaptive } from '@/composables'

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

export const BreakpointContent: Story = {
  render: (_args, { globals }) => ({
    components: { M3Adaptive },
    setup: () => ({ m3Adaptive, notice: localize(globals.locale, messages).notice }),
    template: `
      <div style="display: grid; gap: 16px; padding: 24px">
        <p>{{ notice }}</p>
        <div>Utility: {{ m3Adaptive('Inbox', { compact: 'Mail', large: 'Incoming messages' }) }}</div>
        <div>Props: <M3Adaptive regular="Inbox" compact="Mail" large="Incoming messages" /></div>
        <div>Slots: <M3Adaptive>
          Inbox
          <template #compact>Mail</template>
          <template #large>Incoming messages</template>
        </M3Adaptive></div>
      </div>
    `,
  }),
}
