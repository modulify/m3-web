<template>
    <main ref="scroller" class="app-bar-example">
        <M3AppBar
            :appearance="appearance"
            :alignment="centered ? 'center' : 'start'"
            :scroll="scroll"
            :scroll-target="scroller"
            :headline="text.title"
            :subtitle="subtitle ? text.subtitle : undefined"
        >
            <template #leading>
                <M3Button :aria-label="text.menu" appearance="standard" width="medium" @click="navigationOpen = true">
                    <M3Icon name="menu" />
                </M3Button>
            </template>

            <template v-if="appearance === 'search'" #search>
                <M3Search
                    v-model:query="query"
                    v-model:open="searchOpen"
                    :label="text.search"
                    :status="`${results.length} results`"
                    :hint="text.search"
                    :back-label="text.back"
                    :clear-label="text.close"
                    layout="full-screen"
                >
                    <template #results>
                        <div class="p-6">
                            {{ results.join(' · ') }}
                        </div>
                    </template>
                </M3Search>
            </template>

            <template #trailing>
                <M3Button :aria-label="text.favorite" appearance="standard" width="medium">
                    <M3Icon name="favorite" />
                </M3Button>
                <M3Button :aria-label="text.notifications" appearance="standard" width="medium">
                    <M3Icon name="notifications" />
                </M3Button>
            </template>
        </M3AppBar>

        <M3Navigation
            v-model:expanded="navigationOpen"
            appearance="rail"
            expansion="modal"
            collapse="hidden"
        >
            <M3NavigationTab :label="text.home">
                <M3Icon name="home" />
            </M3NavigationTab>
            <M3NavigationTab :label="text.library" active>
                <M3Icon name="book" />
            </M3NavigationTab>
            <M3NavigationTab :label="text.settings">
                <M3Icon name="settings" />
            </M3NavigationTab>
        </M3Navigation>

        <div class="app-bar-example__content">
            <h2>{{ text.section }}</h2>
            <div class="app-bar-example__grid">
                <article v-for="(card, index) in cards" :key="`${card}-${index}`">
                    {{ card }}
                </article>
            </div>
        </div>
    </main>
</template>

<script lang="ts" setup>
import type {
  AppBarAppearance,
  AppBarScroll,
} from '@modulify/m3-foundation/types/components/app-bar'
import type { PropType } from 'vue'

import { computed, ref } from 'vue'

import { M3AppBar } from '@/components/app-bar'
import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
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

const props = defineProps({
  appearance: { type: String as PropType<AppBarAppearance>, default: 'small' },
  scroll: { type: String as PropType<AppBarScroll>, default: 'pinned' },
  centered: { type: Boolean, default: false },
  subtitle: { type: Boolean, default: false },
  locale: { type: String, default: 'en-US' },
})

const text = computed(() => localize(props.locale, messages))
const cards = computed(() => text.value.cards.concat(text.value.cards, text.value.cards))
const results = computed(() => text.value.cards.filter(card => card.toLocaleLowerCase(props.locale).includes(query.value.toLocaleLowerCase(props.locale))))
const scroller = ref<HTMLElement | null>(null)
const navigationOpen = ref(false)
const searchOpen = ref(false)
const query = ref('')
</script>

<style scoped>
.app-bar-example {
  block-size: 100vh;
  overflow-y: auto;
  background: var(--m3-sys-surface);
}

.app-bar-example__content {
  max-inline-size: 1100px;
  padding: 24px;
  margin-inline: auto;
}

.app-bar-example__content h2 {
  margin-block: 16px 24px;
}

.app-bar-example__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.app-bar-example__grid article {
  min-block-size: 120px;
  padding: 24px;
  border-radius: 24px;
  background: var(--m3-sys-surface-container);
}
</style>
