<template>
    <main
        ref="scroller"
        :lang="locale"
        :style="{
            blockSize: '100vh',
            inlineSize: narrow ? 'min(320px, 100vw)' : '100%',
            marginInline: 'auto',
            overflowY: 'auto',
            background: 'var(--m3-sys-surface)',
            color: 'var(--m3-sys-on-surface)',
        }"
    >
        <div style="max-inline-size: 1120px; margin-inline: auto; padding: 24px; padding-block-end: 160px">
            <h1>{{ text.title }}</h1>
            <p>{{ text.hint }} {{ text.last }}: {{ last }}</p>
            <div class="flex-container gap-4">
                <article
                    v-for="(card, index) in cards"
                    :key="`${card}-${index}`"
                    class="p-6"
                    style="box-sizing: border-box; flex: 1 1 max-content; min-inline-size: min(180px, 100%); max-inline-size: min(360px, 100%); min-block-size: 150px; border-radius: 24px; background: var(--m3-sys-surface-container)"
                >
                    <h2 style="margin-block-start: 0; font-size: 22px; line-height: 28px; overflow-wrap: break-word">
                        {{ card }}
                    </h2>
                    <p>Material 3</p>
                </article>
            </div>
        </div>

        <M3Toolbar
            :label="text.label"
            :overflow-label="text.more"
            :variant="variant"
            :orientation="orientation"
            :color="color"
            :side="side"
            :scroll="scroll"
            :scroll-target="scroller"
            :actions="actions"
        >
            <template v-if="variant === 'floating'" #fab>
                <M3FabButton :aria-label="text.add" @click="last = text.add">
                    <M3Icon name="add" />
                </M3FabButton>
            </template>
        </M3Toolbar>
    </main>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import type {
  ToolbarColor,
  ToolbarOrientation,
  ToolbarScroll,
  ToolbarSide,
  ToolbarVariant,
} from '@modulify/m3-foundation/types/components/toolbar'

import { computed, ref } from 'vue'

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

const props = defineProps({
  variant: { type: String as PropType<ToolbarVariant>, required: true },
  orientation: { type: String as PropType<ToolbarOrientation>, required: true },
  color: { type: String as PropType<ToolbarColor>, required: true },
  side: { type: String as PropType<ToolbarSide>, required: true },
  scroll: { type: String as PropType<ToolbarScroll>, required: true },
  locale: { type: String, required: true },
  narrow: { type: Boolean, default: false },
})

const scroller = ref<HTMLElement | null>(null)
const last = ref('—')
const text = computed(() => localize(props.locale, messages))
const cards = computed(() => [...text.value.cards, ...text.value.cards])
const actions = computed(() => text.value.actions.map((label, index) => ({
  id: icons[index], label, icon: icons[index], selected: index === 0,
  onClick: () => last.value = label,
})))
</script>
