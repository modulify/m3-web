import type {
  AppBarAppearance,
  AppBarScroll,
} from '@modulify/m3-foundation/types/components/app-bar'

import { useState } from 'react'

import { M3AppBar } from '@/components/app-bar'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'
import { M3Navigation, M3NavigationTab } from '@/components/navigation'
import { M3Search } from '@/components/search'

import { localize } from '../../i18n'

const messages = {
  'en-US': {
    title: 'Your library', subtitle: 'Recently added', search: 'Search your library', menu: 'Open navigation',
    back: 'Back to library', close: 'Clear search', favorite: 'Favorites', notifications: 'Notifications',
    home: 'Home', library: 'Library', settings: 'Settings', section: 'Recent items',
    cards: ['Reading list', 'Travel ideas', 'Project notes', 'Saved links', 'Garden plans', 'Music for later'],
  },
  'ru-RU': {
    title: 'Библиотека', subtitle: 'Недавно добавлено', search: 'Поиск в библиотеке', menu: 'Открыть навигацию',
    back: 'Назад к библиотеке', close: 'Очистить поиск', favorite: 'Избранное', notifications: 'Уведомления',
    home: 'Главная', library: 'Библиотека', settings: 'Настройки', section: 'Недавние записи',
    cards: ['Список для чтения', 'Идеи поездок', 'Заметки проекта', 'Сохранённые ссылки', 'Планы сада', 'Музыка на потом'],
  },
}

interface AppBarExampleProps {
  appearance: AppBarAppearance;
  scroll: AppBarScroll;
  centered?: boolean;
  subtitle?: boolean;
  locale: string;
}

export default function AppBarExample({ appearance, scroll, centered = false, subtitle = false, locale }: AppBarExampleProps) {
  const text = localize(locale, messages)
  const [scroller, setScroller] = useState<HTMLElement | null>(null)
  const [navigationOpen, setNavigationOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const results = text.cards.filter(card => card.toLocaleLowerCase(locale).includes(query.toLocaleLowerCase(locale)))

  return (
    <main ref={setScroller} style={{ blockSize: '100vh', overflowY: 'auto', background: 'var(--m3-sys-surface)' }}>
      <M3AppBar
        appearance={appearance}
        alignment={centered ? 'center' : 'start'}
        scroll={scroll}
        scrollTarget={scroller}
        headline={text.title}
        subtitle={subtitle ? text.subtitle : undefined}
      >
        <M3AppBar.Leading>
          <M3IconButton aria-label={text.menu} onClick={() => setNavigationOpen(true)}><M3Icon name="menu" /></M3IconButton>
        </M3AppBar.Leading>
        {appearance === 'search' && <M3AppBar.Search>
          <M3Search
            query={query}
            open={searchOpen}
            label={text.search}
            status={`${results.length} results`}
            hint={text.search}
            backLabel={text.back}
            clearLabel={text.close}
            layout="full-screen"
            onQueryChange={setQuery}
            onOpenChange={setSearchOpen}
          >
            <M3Search.Results>
              <div style={{ padding: 24 }}>{results.join(' · ')}</div>
            </M3Search.Results>
          </M3Search>
        </M3AppBar.Search>}
        <M3AppBar.Trailing>
          <M3IconButton aria-label={text.favorite}><M3Icon name="favorite" /></M3IconButton>
          <M3IconButton aria-label={text.notifications}><M3Icon name="notifications" /></M3IconButton>
        </M3AppBar.Trailing>
      </M3AppBar>

      <M3Navigation
        appearance="rail"
        expansion="modal"
        collapse="hidden"
        expanded={navigationOpen}
        onToggle={setNavigationOpen}
      >
        <M3NavigationTab label={text.home}><M3Icon name="home" /></M3NavigationTab>
        <M3NavigationTab label={text.library} active><M3Icon name="book" /></M3NavigationTab>
        <M3NavigationTab label={text.settings}><M3Icon name="settings" /></M3NavigationTab>
      </M3Navigation>

      <div style={{ padding: 24, maxWidth: 1100, marginInline: 'auto' }}>
        <h2 style={{ marginBlock: '16px 24px' }}>{text.section}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {text.cards.concat(text.cards, text.cards).map((card, index) => (
            <article key={`${card}-${index}`} style={{ minBlockSize: 120, padding: 24, borderRadius: 24, background: 'var(--m3-sys-surface-container)' }}>
              {card}
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
