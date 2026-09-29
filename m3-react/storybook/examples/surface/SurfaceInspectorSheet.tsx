import type { CSSProperties, FC } from 'react'
import type { M3SelectOption } from '@/components/select'

import type { StorybookLocale } from '../../i18n'

import { useState } from 'react'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'
import { M3Select } from '@/components/select'
import { M3Surface, M3SurfacePanel } from '@/components/surface'
import { M3TextField } from '@/components/text-field'

import { localize } from '../../i18n'

type Priority = 'low' | 'normal' | 'high'

const panelStyle = {
  padding: '18px',
} satisfies CSSProperties

const SurfaceInspectorSheet: FC<{ locale: StorybookLocale }> = ({ locale }) => {
  const text = localize(locale, {
    'en-US': { cards: ['Launch plan', 'Dependencies', 'Approvals'], cardDescription: 'Dashboard content keeps its place while the inspector surface is layered above it.', description: 'A supplemental editing surface appears from the edge while the main dashboard stays visible.', dismiss: 'Dismiss', heading: 'Scenario: inspector side sheet', notes: 'Notes', notesValue: 'Coordinate the release notes and schedule rollout approval.', open: 'Open inspector', owner: 'Owner email', priority: 'Priority', priorities: ['Low', 'Normal', 'High'], save: 'Save changes', sheetDescription: 'Use the side sheet for supporting edits that should not replace the dashboard context.', title: 'Release inspector' },
    'ru-RU': { cards: ['План запуска', 'Зависимости', 'Согласования'], cardDescription: 'Содержимое дашборда остаётся на месте, пока панель инспектора располагается поверх него.', description: 'Вспомогательная панель редактирования появляется с края, а основной дашборд остаётся видимым.', dismiss: 'Закрыть', heading: 'Сценарий: боковая панель инспектора', notes: 'Заметки', notesValue: 'Согласовать заметки к выпуску и запланировать подтверждение запуска.', open: 'Открыть инспектор', owner: 'Почта владельца', priority: 'Приоритет', priorities: ['Низкий', 'Обычный', 'Высокий'], save: 'Сохранить изменения', sheetDescription: 'Используйте боковую панель для вспомогательных правок, которые не должны заменять контекст дашборда.', title: 'Инспектор выпуска' },
  })
  const priorityOptions: Array<M3SelectOption<Priority>> = [
    { label: text.priorities[0], value: 'low' },
    { label: text.priorities[1], value: 'normal' },
    { label: text.priorities[2], value: 'high' },
  ]
  const [opened, setOpened] = useState(false)
  const [owner, setOwner] = useState('owner@example.com')
  const [priority, setPriority] = useState<Priority | null>('normal')
  const [notes, setNotes] = useState(text.notesValue)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, var(--m3-sys-surface) 0%, var(--m3-sys-surface-container-low) 100%)',
      color: 'var(--m3-sys-on-surface)',
      padding: '24px',
      boxSizing: 'border-box',
    }}
    >
      <M3SurfacePanel
        fillHeight={false}
        height={84}
        rounding={24}
        variant="surface-container"
        elevation={0}
        style={{ ...panelStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div>
          <strong style={{ display: 'block', marginBottom: '6px' }}>{text.heading}</strong>
          <span style={{ fontSize: '13px', opacity: 0.82 }}>{text.description}</span>
        </div>

        <M3Button appearance="tonal" onClick={() => setOpened(true)}>
          {text.open}
        </M3Button>
      </M3SurfacePanel>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px', marginTop: '16px' }}>
        {text.cards.map(label => (
          <M3SurfacePanel
            key={label}
            fillHeight={false}
            height={188}
            rounding={18}
            variant="surface-container-low"
            elevation={1}
            style={panelStyle}
          >
            <h3 style={{ margin: '0 0 8px' }}>{label}</h3>
            <p style={{ margin: 0 }}>{text.cardDescription}</p>
          </M3SurfacePanel>
        ))}
      </div>

      <M3Surface
        mode="modal"
        shown={opened}
        anchor="end"
        fillWidth={false}
        width={360}
        insetTop={0}
        insetRight={0}
        insetBottom={0}
        roundingTopLeft={28}
        roundingBottomLeft={28}
        roundingTopRight={0}
        roundingBottomRight={0}
        elevation={2}
        variant="surface-container-high"
        overflow="auto"
        className="m3-side-sheet surface-inspector-sheet__sheet"
        onToggle={setOpened}
        onDismiss={() => setOpened(false)}
      >
        <header className="m3-side-sheet__header">
          <div className="m3-side-sheet__title">{text.title}</div>

          <div className="m3-side-sheet__affordance">
            <M3IconButton appearance="standard" onClick={() => setOpened(false)}>
              <M3Icon name="close" />
            </M3IconButton>
          </div>
        </header>

        <div className="m3-side-sheet__content">
          <div style={{ display: 'grid', gap: '16px', width: '100%', padding: '0 24px 24px' }}>
            <p style={{ margin: 0 }}>{text.sheetDescription}</p>

            <div style={{ display: 'grid', gap: '12px' }}>
              <M3TextField
                value={owner}
                label={text.owner}
                outlined={true}
                onUpdate={setOwner}
              />

              <M3Select<Priority>
                value={priority}
                label={text.priority}
                options={priorityOptions}
                outlined={true}
                onUpdate={setPriority}
              />

              <M3TextField
                value={notes}
                label={text.notes}
                outlined={true}
                multiline={true}
                onUpdate={setNotes}
              />
            </div>
          </div>
        </div>

        <footer className="m3-side-sheet__footer" style={{ justifyContent: 'flex-end' }}>
          <M3Button appearance="text" onClick={() => setOpened(false)}>
            {text.dismiss}
          </M3Button>

          <M3Button appearance="filled" onClick={() => setOpened(false)}>
            {text.save}
          </M3Button>
        </footer>
      </M3Surface>
    </div>
  )
}

export default SurfaceInspectorSheet
