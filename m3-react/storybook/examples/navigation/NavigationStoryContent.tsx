import type { Appearance } from '@modulify/m3-foundation/types/components/navigation'
import type { FC } from 'react'

import { M3SurfacePanel } from '@/components/surface'

import { localize } from '../../i18n'

type NavigationStoryContentProps = {
  locale: unknown
  appearance?: Appearance
  inset?: boolean
  topAction?: boolean
}

const messages = {
  'en-US': {
    heading: 'Inbox',
    introduction: 'A quick view of the conversations that matter today.',
    overview: 'Today at a glance',
    overviewText: 'Six conversations are ready to catch up on.',
    messages: [
      { from: 'Design team · 9:42', subject: 'A fresh look at the workspace', preview: 'The latest layout sketches are ready for review.' },
      { from: 'Maya · 8:15', subject: 'Notes from yesterday', preview: 'I gathered the decisions and next steps in one place.' },
      { from: 'Research · Yesterday', subject: 'What we learned this week', preview: 'A short summary of the patterns people noticed.' },
      { from: 'Alex · Yesterday', subject: 'Planning the next release', preview: 'Here is the updated schedule for the team.' },
      { from: 'Studio · Monday', subject: 'New assets are ready', preview: 'The illustrations and icons are in the shared folder.' },
      { from: 'Family · Monday', subject: 'See you this weekend', preview: 'We have a few ideas for our day together.' },
    ],
  },
  'ru-RU': {
    heading: 'Входящие',
    introduction: 'Короткий обзор важных разговоров на сегодня.',
    overview: 'Сегодня',
    overviewText: 'Шесть разговоров ждут ответа.',
    messages: [
      { from: 'Команда дизайна · 9:42', subject: 'Новый вид рабочего пространства', preview: 'Эскизы обновлённого интерфейса готовы к просмотру.' },
      { from: 'Майя · 8:15', subject: 'Заметки со вчерашней встречи', preview: 'Собрала решения и следующие шаги в одном месте.' },
      { from: 'Исследование · Вчера', subject: 'Что мы узнали на этой неделе', preview: 'Короткая сводка наблюдений пользователей.' },
      { from: 'Алекс · Вчера', subject: 'План следующего выпуска', preview: 'Обновлённое расписание для команды.' },
      { from: 'Студия · Понедельник', subject: 'Новые материалы готовы', preview: 'Иллюстрации и иконки лежат в общей папке.' },
      { from: 'Семья · Понедельник', subject: 'Увидимся в выходные', preview: 'Есть несколько идей для совместного дня.' },
    ],
  },
}

const NavigationStoryContent: FC<NavigationStoryContentProps> = ({ locale, appearance, inset = true, topAction = false }) => {
  const text = localize(locale, messages)
  const insetClass = inset
    ? `m3-has-navigation${appearance && appearance !== 'auto' ? ` m3-has-navigation_${appearance}` : ''}`
    : ''

  return (
    <main
      className={insetClass}
      style={{ minHeight: '100vh', boxSizing: 'border-box', background: 'var(--m3-sys-surface)', color: 'var(--m3-sys-on-surface)' }}
    >
      <div style={{ maxWidth: 1160, padding: '28px 24px 40px', paddingBlockStart: topAction ? 104 : 28 }}>
        <header style={{ marginBlockEnd: 24 }}>
          <h1 style={{ margin: '0 0 8px' }}>{text.heading}</h1>
          <p style={{ margin: 0, color: 'var(--m3-sys-on-surface-variant)' }}>{text.introduction}</p>
        </header>

        <M3SurfacePanel
          fillHeight={false}
          rounding={24}
          variant="surface-container"
          style={{ padding: 24, marginBlockEnd: 16 }}
        >
          <h2 style={{ margin: '0 0 8px' }}>{text.overview}</h2>
          <p style={{ margin: 0 }}>{text.overviewText}</p>
        </M3SurfacePanel>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 16 }}>
          {text.messages.map(message => (
            <M3SurfacePanel
              key={message.subject}
              tag="article"
              fillHeight={false}
              rounding={24}
              variant="surface-container-low"
              style={{ minHeight: 168, padding: 20 }}
            >
              <p style={{ margin: '0 0 20px', color: 'var(--m3-sys-on-surface-variant)' }}>{message.from}</p>
              <h3 style={{ margin: '0 0 8px' }}>{message.subject}</h3>
              <p style={{ margin: 0, color: 'var(--m3-sys-on-surface-variant)' }}>{message.preview}</p>
            </M3SurfacePanel>
          ))}
        </div>
      </div>
    </main>
  )
}

export default NavigationStoryContent
