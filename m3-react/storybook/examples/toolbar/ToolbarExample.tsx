import type {
  ToolbarColor,
  ToolbarOrientation,
  ToolbarScroll,
  ToolbarSide,
  ToolbarVariant,
} from '@modulify/m3-foundation/types/components/toolbar'

import { useState } from 'react'

import { M3FabButton } from '@/components/fab-button'
import { M3Icon } from '@/components/icon'
import { M3Toolbar } from '@/components/toolbar'

import { localize } from '../../i18n'

const messages = {
  'en-US': {
    title: 'Document editor', hint: 'Scroll to see how the toolbar responds.', label: 'Editing tools', more: 'More editing tools',
    actions: ['Bold', 'Italic', 'Underline', 'Insert link', 'Insert image', 'Align', 'Comment'],
    cards: ['Outline', 'Introduction', 'Research notes', 'References', 'Draft', 'Review', 'Changes', 'Next steps'],
    add: 'Add section', last: 'Last action',
  },
  'ru-RU': {
    title: 'Редактор документа', hint: 'Прокрутите страницу, чтобы увидеть поведение панели.', label: 'Инструменты редактирования', more: 'Другие инструменты',
    actions: ['Полужирный', 'Курсив', 'Подчеркнуть', 'Вставить ссылку', 'Вставить изображение', 'Выровнять', 'Комментировать'],
    cards: ['Структура', 'Введение', 'Исследование', 'Источники', 'Черновик', 'Рецензия', 'Изменения', 'Следующие шаги'],
    add: 'Добавить раздел', last: 'Последнее действие',
  },
}

const icons = ['format_bold', 'format_italic', 'format_underlined', 'link', 'image', 'format_align_left', 'comment']

interface Props {
  variant: ToolbarVariant;
  orientation: ToolbarOrientation;
  color: ToolbarColor;
  scroll: ToolbarScroll;
  side: ToolbarSide;
  locale: string;
  narrow?: boolean;
}

export default function ToolbarExample({ variant, orientation, color, scroll, side, locale, narrow = false }: Props) {
  const text = localize(locale, messages)
  const [scroller, setScroller] = useState<HTMLElement | null>(null)
  const [last, setLast] = useState('—')
  const actions = text.actions.map((label, index) => ({
    id: icons[index], label, icon: icons[index], selected: index === 0,
    onClick: () => setLast(label),
  }))

  return <main
    ref={setScroller}
    lang={locale}
    style={{ blockSize: '100vh', inlineSize: narrow ? 'min(320px, 100vw)' : '100%', marginInline: 'auto', overflowY: 'auto', background: 'var(--m3-sys-surface)', color: 'var(--m3-sys-on-surface)' }}
  >
    <div style={{ maxInlineSize: 1120, marginInline: 'auto', padding: 24, paddingBlockEnd: 160 }}>
      <h1>{text.title}</h1>
      <p>{text.hint} {text.last}: {last}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {[...text.cards, ...text.cards].map((card, index) => <article
          key={`${card}-${index}`}
          style={{ boxSizing: 'border-box', flex: '1 1 max-content', minInlineSize: 'min(180px, 100%)', maxInlineSize: 'min(360px, 100%)', minBlockSize: 150, padding: 24, borderRadius: 24, background: 'var(--m3-sys-surface-container)' }}
        >
          <h2 style={{ marginBlockStart: 0, fontSize: 22, lineHeight: '28px', overflowWrap: 'break-word' }}>{card}</h2>
          <p>Material 3</p>
        </article>)}
      </div>
    </div>
    <M3Toolbar
      label={text.label}
      overflowLabel={text.more}
      variant={variant}
      orientation={orientation}
      color={color}
      side={side}
      scroll={scroll}
      scrollTarget={scroller}
      actions={actions}
    >
      {variant === 'floating' && <M3Toolbar.Fab>
        <M3FabButton aria-label={text.add} onClick={() => setLast(text.add)}><M3Icon name="add" /></M3FabButton>
      </M3Toolbar.Fab>}
    </M3Toolbar>
  </main>
}
