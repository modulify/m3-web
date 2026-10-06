import type { Meta, StoryObj } from '@storybook/vue3'

import { M3Button } from '@/components/button'
import { M3Snackbar } from '@/components/snackbar'

import { localize } from '../i18n'
import SnackbarInteraction from '../examples/snackbar/SnackbarInteraction.vue'

const messages = {
  'en-US': {
    saved: 'Changes saved',
    archived: 'Email archived',
    action: 'Undo',
    close: 'Close notification',
    duplicate: 'The item already has the label “travel.” Add a new label.',
    long: 'Add a new label',
  },

  'ru-RU': {
    saved: 'Изменения сохранены',
    archived: 'Письмо архивировано',
    action: 'Отменить',
    close: 'Закрыть уведомление',
    duplicate: 'У элемента уже есть метка «путешествие». Добавьте другую метку.',
    long: 'Добавить новую метку',
  },
}

const meta = {
  title: 'Components/M3Snackbar',

  component: M3Snackbar,

  args: {
    message: 'Email archived',
  },

  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof M3Snackbar>

export default meta

type Story = StoryObj<typeof meta>

export const SingleLine: Story = {
  render: (_args, { globals }) => ({
    components: { M3Snackbar },
    setup: () => ({ text: localize(globals.locale, messages) }),
    template: `
      <div style="padding:clamp(16px,4vw,32px)">
        <M3Snackbar :message="text.saved" />
      </div>
    `,
  }),
}

export const WithAction: Story = {
  render: (_args, { globals }) => ({
    components: { M3Button, M3Snackbar },
    setup: () => ({ text: localize(globals.locale, messages) }),
    template: `
      <div style="padding:clamp(16px,4vw,32px)">
        <M3Snackbar :message="text.archived" :close-label="text.close" closable>
          <template #action="{ buttonProps }">
            <M3Button v-bind="buttonProps">{{ text.action }}</M3Button>
          </template>
        </M3Snackbar>
      </div>
    `,
  }),
}

export const TwoLines: Story = {
  render: (_args, { globals }) => ({
    components: { M3Snackbar },
    setup: () => ({ text: localize(globals.locale, messages) }),
    template: `
      <div style="padding:clamp(16px,4vw,32px)">
        <M3Snackbar :message="text.duplicate" style="max-inline-size:336px" />
      </div>
    `,
  }),
}

export const LongAction: Story = {
  render: (_args, { globals }) => ({
    components: { M3Button, M3Snackbar },
    setup: () => ({ text: localize(globals.locale, messages) }),
    template: `
      <div style="padding:clamp(16px,4vw,32px)">
        <M3Snackbar
            :message="text.duplicate"
            :close-label="text.close"
            layout="stacked"
            closable
            style="max-inline-size:336px"
        >
          <template #action="{ buttonProps }">
            <M3Button v-bind="buttonProps">{{ text.long }}</M3Button>
          </template>
        </M3Snackbar>
      </div>
    `,
  }),
}

const interaction = (scenario: 'feedback' | 'undo' | 'queue' | 'navigation', locale: string) => ({
  components: { SnackbarInteraction },
  setup: () => ({ locale, scenario }),
  template: '<SnackbarInteraction :scenario="scenario" :locale="locale" />',
})

export const InlineFeedback: Story = {
  render: (_args, { globals }) => interaction('feedback', globals.locale),
}

export const UndoAction: Story = {
  render: (_args, { globals }) => interaction('undo', globals.locale),
}

export const QueueAndReplace: Story = {
  render: (_args, { globals }) => interaction('queue', globals.locale),
}

export const WithNavigationAndFab: Story = {
  render: (_args, { globals }) => interaction('navigation', globals.locale),
}
