<template>
    <main class="search-example">
        <div class="search-example__content">
            <header class="search-example__header">
                <h1>{{ text.heading }}</h1>
                <M3Button v-if="externalTrigger" @click="open = true">
                    {{ text.open }}
                </M3Button>
            </header>
            <M3Search
                v-model:query="query"
                v-model:open="open"
                :appearance="appearance"
                :layout="layout"
                :label="text.hint"
                :hint="text.hint"
                :back-label="text.back"
                :clear-label="text.clear"
                :status="status"
                @submit="submitted = true"
                @update:query="submitted = false"
            >
                <template #actions>
                    <M3Button :aria-label="text.example" appearance="standard" width="medium" @click="query = text.cards[0]">
                        <M3Icon name="history" />
                    </M3Button>
                </template>
                <template #results>
                    <p class="search-example__section">
                        {{ section }}
                    </p>
                    <M3List>
                        <M3ListItem
                            v-for="entry in entries"
                            :key="entry"
                            :headline="entry"
                            interactive
                            @click="choose(entry)"
                        >
                            <template #leading>
                                <M3Icon :name="query ? 'mail' : 'history'" />
                            </template>
                        </M3ListItem>
                    </M3List>
                </template>
            </M3Search>
            <h2>{{ text.inbox }}</h2>
            <div class="search-example__grid">
                <article v-for="card in text.cards" :key="card">
                    {{ card }}
                </article>
            </div>
        </div>
    </main>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import type {
  SearchAppearance,
  SearchLayout,
} from '@modulify/m3-foundation/types/components/search'

import { computed, ref } from 'vue'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3List, M3ListItem } from '@/components/list'
import { M3Search } from '@/components/search'

import { localize } from '../../i18n'

const messages = {
  'en-US': {
    heading: 'Mail', hint: 'Search your messages', back: 'Back to mail', clear: 'Clear search', example: 'Use a recent query', open: 'Open search programmatically', recent: 'Recent searches', suggestions: 'Suggestions', results: 'Results', inbox: 'Inbox',
    cards: ['Planning the next release', 'Notes from yesterday', 'Design review', 'Project status'],
  },
  'ru-RU': {
    heading: 'Почта', hint: 'Поиск по сообщениям', back: 'Назад к почте', clear: 'Очистить поиск', example: 'Вставить недавний запрос', open: 'Открыть поиск программно', recent: 'Недавние запросы', suggestions: 'Подсказки', results: 'Результаты', inbox: 'Входящие',
    cards: ['План следующего выпуска', 'Заметки за вчера', 'Обзор дизайна', 'Состояние проекта'],
  },
}

const props = defineProps({
  appearance: { type: String as PropType<SearchAppearance>, default: 'contained' },
  layout: { type: String as PropType<SearchLayout>, default: 'auto' },
  locale: { type: String, default: 'en-US' },
  initialOpen: { type: Boolean, default: false },
  externalTrigger: { type: Boolean, default: false },
})

const text = computed(() => localize(props.locale, messages))
const query = ref('')
const open = ref(props.initialOpen)
const submitted = ref(false)
const matching = computed(() => text.value.cards.filter(item => item.toLocaleLowerCase(props.locale).includes(query.value.toLocaleLowerCase(props.locale))))
const entries = computed(() => query.value ? matching.value : text.value.cards.slice(0, 3))
const section = computed(() => submitted.value ? text.value.results : query.value ? text.value.suggestions : text.value.recent)
const status = computed(() => `${section.value}: ${entries.value.length}`)
const choose = (value: string) => {
  query.value = value
  open.value = false
}
</script>

<style scoped>
.search-example {
  min-block-size: 100vh;
  padding: 24px;
  background: var(--m3-sys-surface-container-low);
}

.search-example__content {
  max-inline-size: 880px;
  margin-inline: auto;
}

.search-example__header {
  display: flex;
  margin-block-end: 16px;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
}

.search-example__header h1 { margin: 0; }
h2 { margin-block: 32px 16px; }

.search-example__section {
  margin: 8px 16px;
  color: var(--m3-sys-on-surface-variant);
}

.search-example__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.search-example__grid article {
  min-block-size: 96px;
  padding: 20px;
  border-radius: 24px;
  background: var(--m3-sys-surface-container);
}
</style>
