import type { Meta } from '@storybook/react'
import type { SnackbarHostMethods } from '@/components/snackbar'
import type { StoryObj } from '@storybook/react'

import { useRef, useState } from 'react'

import { M3Button } from '@/components/button'
import { M3FabButton } from '@/components/fab-button'
import { M3Icon } from '@/components/icon'
import { M3Navigation, M3NavigationTab } from '@/components/navigation'
import { M3Snackbar, M3SnackbarHost } from '@/components/snackbar'

import { localize } from '../i18n'

const FEEDBACK_DURATION_MS = 6000
const QUEUED_UPDATE_DURATION_MS = 4000

const messages = {
  'en-US': {
    feedback: 'Save changes',
    saved: 'Saved',
    savedMessage: 'Changes saved',

    archive: 'Archive email',
    archived: 'Email archived',
    action: 'Undo',
    close: 'Close notification',

    queue: 'Queue two updates',
    replace: 'Replace with latest update',
    first: 'Uploading photo',
    second: 'Photo uploaded',

    duplicate: 'The item already has the label “travel.” Add a new label.',
    long: 'Add a new label',

    inbox: 'Inbox',
    browse: 'Browse',
    library: 'Library',
    compose: 'Compose',
  },

  'ru-RU': {
    feedback: 'Сохранить изменения',
    saved: 'Сохранено',
    savedMessage: 'Изменения сохранены',

    archive: 'Архивировать письмо',
    archived: 'Письмо архивировано',
    action: 'Отменить',
    close: 'Закрыть уведомление',

    queue: 'Поставить два сообщения в очередь',
    replace: 'Заменить новым сообщением',
    first: 'Загружаем фото',
    second: 'Фото загружено',

    duplicate: 'У элемента уже есть метка «путешествие». Добавьте другую метку.',
    long: 'Добавить новую метку',

    inbox: 'Входящие',
    browse: 'Обзор',
    library: 'Библиотека',
    compose: 'Создать',
  },
}

type Scenario = 'feedback' | 'undo' | 'queue' | 'navigation'

function SnackbarInteraction({ scenario, locale }: { scenario: Scenario; locale: string }) {
  const host = useRef<SnackbarHostMethods | null>(null)
  const [feedback, setFeedback] = useState('')
  const text = localize(locale, messages)

  const showFeedback = () => {
    setFeedback(text.saved)
    void host.current?.show({ message: text.savedMessage, duration: FEEDBACK_DURATION_MS, closeLabel: text.close })
  }

  const showUndo = () => {
    setFeedback(text.archived)
    void host.current?.show({ message: text.archived, closeLabel: text.close })
      .then(result => {
        if (result === 'action') setFeedback('')
      })
  }

  const showQueue = () => {
    void host.current?.show({ message: text.first, duration: QUEUED_UPDATE_DURATION_MS, closeLabel: text.close })
    void host.current?.show({ message: text.second, duration: QUEUED_UPDATE_DURATION_MS, closeLabel: text.close })
  }

  const replaceQueue = () => {
    void host.current?.replace({ message: text.second, duration: QUEUED_UPDATE_DURATION_MS, closeLabel: text.close })
  }

  const content = (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
        {(scenario === 'feedback' || scenario === 'navigation') && <M3Button onClick={showFeedback}>{text.feedback}</M3Button>}
        {scenario === 'undo' && <M3Button onClick={showUndo}>{text.archive}</M3Button>}
        {scenario === 'queue' && (
          <>
            <M3Button onClick={showQueue}>{text.queue}</M3Button>
            <M3Button appearance="outlined" onClick={replaceQueue}>{text.replace}</M3Button>
          </>
        )}
        {feedback && <span role="status">{feedback}</span>}
      </div>
      <M3SnackbarHost
        ref={host}
        renderAction={scenario === 'undo' ? ({ buttonProps }) => <M3Button {...buttonProps}>{text.action}</M3Button> : undefined}
        style={scenario === 'navigation' ? { '--m3-snackbar-inset-block-end': 'calc(64px + 96px)' } as React.CSSProperties : undefined}
      />
    </>
  )

  if (scenario !== 'navigation') {
    return (
      <main style={{ minHeight: 360, padding: 32, background: 'var(--m3-sys-surface)' }}>
        {content}
      </main>
    )
  }

  return (
    <>
      <M3Navigation appearance="bar">
        <M3NavigationTab label={text.inbox} active><M3Icon name="inbox" /></M3NavigationTab>
        <M3NavigationTab label={text.browse}><M3Icon name="explore" /></M3NavigationTab>
        <M3NavigationTab label={text.library}><M3Icon name="library_music" /></M3NavigationTab>
      </M3Navigation>
      <main className="m3-has-navigation_bar" style={{ minHeight: '100vh', padding: 32, background: 'var(--m3-sys-surface)' }}>
        {content}
        <M3FabButton
          variant="tertiary"
          style={{ position: 'fixed', insetInlineEnd: 24, insetBlockEnd: 'calc(64px + 16px)' }}
        ><M3Icon name="edit" />{text.compose}</M3FabButton>
      </main>
    </>
  )
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
  render: (_args, { globals }) => {
    const text = localize(globals.locale, messages)

    return (
      <div style={{ padding: 'clamp(16px, 4vw, 32px)' }}>
        <M3Snackbar message={text.savedMessage} />
      </div>
    )
  },
}

export const WithAction: Story = {
  render: (_args, { globals }) => {
    const text = localize(globals.locale, messages)
    return (
      <div style={{ padding: 'clamp(16px, 4vw, 32px)' }}>
        <M3Snackbar message={text.archived} closeLabel={text.close} closable>
          <M3Snackbar.Action>{({ buttonProps }) => <M3Button {...buttonProps}>{text.action}</M3Button>}</M3Snackbar.Action>
        </M3Snackbar>
      </div>
    )
  },
}

export const TwoLines: Story = {
  render: (_args, { globals }) => {
    const text = localize(globals.locale, messages)

    return (
      <div style={{ padding: 'clamp(16px, 4vw, 32px)' }}>
        <M3Snackbar message={text.duplicate} style={{ maxInlineSize: 336 }} />
      </div>
    )
  },
}

export const LongAction: Story = {
  render: (_args, { globals }) => {
    const text = localize(globals.locale, messages)
    return (
      <div style={{ padding: 'clamp(16px, 4vw, 32px)' }}>
        <M3Snackbar message={text.duplicate} closeLabel={text.close} layout="stacked" style={{ maxInlineSize: 336 }} closable>
          <M3Snackbar.Action>{({ buttonProps }) => <M3Button {...buttonProps}>{text.long}</M3Button>}</M3Snackbar.Action>
        </M3Snackbar>
      </div>
    )
  },
}

export const InlineFeedback: Story = {
  render: (_args, { globals }) => <SnackbarInteraction scenario="feedback" locale={globals.locale} />,
}

export const UndoAction: Story = {
  render: (_args, { globals }) => <SnackbarInteraction scenario="undo" locale={globals.locale} />,
}

export const QueueAndReplace: Story = {
  render: (_args, { globals }) => <SnackbarInteraction scenario="queue" locale={globals.locale} />,
}

export const WithNavigationAndFab: Story = {
  render: (_args, { globals }) => <SnackbarInteraction scenario="navigation" locale={globals.locale} />,
}
