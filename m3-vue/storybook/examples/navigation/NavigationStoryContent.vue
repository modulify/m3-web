<template>
    <main :class="{ 'm3-has-navigation': inset }" class="navigation-story-content">
        <div :class="{ 'navigation-story-content__inner_with-top-action': topAction }" class="navigation-story-content__inner">
            <header class="navigation-story-content__header">
                <h1>{{ text.heading }}</h1>
                <p>{{ text.introduction }}</p>
            </header>

            <M3SurfacePanel
                :fill-height="false"
                :rounding="24"
                class="navigation-story-content__overview"
                variant="surface-container"
            >
                <h2>{{ text.overview }}</h2>
                <p>{{ text.overviewText }}</p>
            </M3SurfacePanel>

            <div class="navigation-story-content__grid">
                <M3SurfacePanel
                    v-for="message in text.messages"
                    :key="message.subject"
                    :fill-height="false"
                    :rounding="24"
                    class="navigation-story-content__tile"
                    tag="article"
                    variant="surface-container-low"
                >
                    <p class="navigation-story-content__sender">
                        {{ message.from }}
                    </p>
                    <h3>{{ message.subject }}</h3>
                    <p>{{ message.preview }}</p>
                </M3SurfacePanel>
            </div>
        </div>
    </main>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { M3SurfacePanel } from '@/components/surface'

import { localize } from '../../i18n'

const props = withDefaults(defineProps<{
  locale: unknown
  inset?: boolean
  topAction?: boolean
}>(), { inset: true, topAction: false })

const text = computed(() => localize(props.locale, {
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
}))
</script>

<style scoped>
.navigation-story-content {
    min-block-size: 100vh;
    box-sizing: border-box;
    background: var(--m3-sys-surface);
    color: var(--m3-sys-on-surface);
}

.navigation-story-content__inner {
    max-inline-size: 1160px;
    padding-block: 28px 40px;
    padding-inline: 24px;
}

.navigation-story-content__inner_with-top-action {
    padding-block-start: 104px;
}

.navigation-story-content__header,
.navigation-story-content__overview {
    margin-block-end: 24px;
}

.navigation-story-content__header h1,
.navigation-story-content__overview h2,
.navigation-story-content__tile h3 {
    margin-block: 0 8px;
}

.navigation-story-content__header p,
.navigation-story-content__overview p,
.navigation-story-content__tile p {
    margin: 0;
}

.navigation-story-content__header p,
.navigation-story-content__tile p {
    color: var(--m3-sys-on-surface-variant);
}

.navigation-story-content__overview {
    padding: 24px;
    margin-block-end: 16px;
}

.navigation-story-content__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
    gap: 16px;
}

.navigation-story-content__tile {
    min-block-size: 168px;
    padding: 20px;
}

.navigation-story-content__tile .navigation-story-content__sender {
    margin-block-end: 20px;
}
</style>
