import type {
  SearchAppearance,
  SearchLayout,
} from '@modulify/m3-foundation/types/components/search'

import { useState } from 'react'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'
import { M3List, M3ListItem } from '@/components/list'
import { M3Search } from '@/components/search'

import { localize } from '../../i18n'

const messages = {
  'en-US': {
    heading: 'Mail',
    hint: 'Search your messages',
    back: 'Back to mail',
    clear: 'Clear search',
    example: 'Use a recent query',
    open: 'Open search programmatically',
    recent: 'Recent searches',
    suggestions: 'Suggestions',
    results: 'Results',
    inbox: 'Inbox',
    cards: ['Planning the next release', 'Notes from yesterday', 'Design review', 'Project status'],
  },
  'ru-RU': {
    heading: 'Почта',
    hint: 'Поиск по сообщениям',
    back: 'Назад к почте',
    clear: 'Очистить поиск',
    example: 'Вставить недавний запрос',
    open: 'Открыть поиск программно',
    recent: 'Недавние запросы',
    suggestions: 'Подсказки',
    results: 'Результаты',
    inbox: 'Входящие',
    cards: ['План следующего выпуска', 'Заметки за вчера', 'Обзор дизайна', 'Состояние проекта'],
  },
}

interface SearchExampleProps {
  appearance?: SearchAppearance;
  layout?: SearchLayout;
  locale: string;
  initialOpen?: boolean;
  externalTrigger?: boolean;
}

export default function SearchExample({
  appearance = 'contained',
  layout = 'auto',
  locale,
  initialOpen = false,
  externalTrigger = false,
}: SearchExampleProps) {
  const text = localize(locale, messages)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(initialOpen)
  const [submitted, setSubmitted] = useState(false)
  const matching = text.cards.filter(item => item.toLocaleLowerCase(locale).includes(query.toLocaleLowerCase(locale)))
  const entries = query ? matching : text.cards.slice(0, 3)
  const section = submitted ? text.results : query ? text.suggestions : text.recent
  const status = `${section}: ${entries.length}`

  const updateQuery = (value: string) => {
    setQuery(value)
    setSubmitted(false)
  }
  const choose = (value: string) => {
    setQuery(value)
  }

  return (
    <main style={{ minHeight: '100vh', padding: '24px', background: 'var(--m3-sys-surface-container-low)' }}>
      <div style={{ maxWidth: 880, marginInline: 'auto' }}>
        <header style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBlockEnd: 16 }}>
          <h1 style={{ margin: 0 }}>{text.heading}</h1>
          {externalTrigger ? <M3Button onClick={() => setOpen(true)}>{text.open}</M3Button> : null}
        </header>
        <M3Search
          appearance={appearance}
          layout={layout}
          label={text.hint}
          hint={text.hint}
          backLabel={text.back}
          clearLabel={text.clear}
          query={query}
          status={status}
          open={open}
          onQueryChange={updateQuery}
          onOpenChange={setOpen}
          onSubmit={() => setSubmitted(true)}
        >
          <M3Search.Actions>
            <M3IconButton aria-label={text.example} onClick={() => updateQuery(text.cards[0])}><M3Icon name="history" /></M3IconButton>
          </M3Search.Actions>
          <M3Search.Results render={({ close }) => (
            <>
              <p style={{ margin: '8px 16px', color: 'var(--m3-sys-on-surface-variant)' }}>{section}</p>
              <M3List>
                {entries.map(entry => (
                  <M3ListItem key={entry} headline={entry} onClick={() => { choose(entry); close() }}>
                    <M3ListItem.Leading><M3Icon name={query ? 'mail' : 'history'} /></M3ListItem.Leading>
                  </M3ListItem>
                ))}
              </M3List>
            </>
          )} />
        </M3Search>
        <h2 style={{ marginBlock: '32px 16px' }}>{text.inbox}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {text.cards.map(card => (
            <article key={card} style={{ minHeight: 96, padding: 20, borderRadius: 24, background: 'var(--m3-sys-surface-container)' }}>
              {card}
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
