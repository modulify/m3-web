<template>
    <div :lang="props.locale" class="m3-chip-showcase">
        <template v-if="props.mode === 'filters'">
            <M3Chip
                v-for="option in filterOptions"
                :key="option.id"
                :selected="filters.includes(option.id)"
                variant="filter"
                @update:selected="onToggleFilter(option.id, $event)"
            >
                {{ option.label }}
            </M3Chip>
        </template>

        <template v-else-if="props.mode === 'inputs'">
            <M3Chip
                v-for="token in tokens"
                :key="token.id"
                variant="input"
                dismissible
                @dismiss="removeToken(token.id)"
            >
                {{ token.label }}
            </M3Chip>
        </template>

        <template v-else>
            <M3Chip variant="assist">
                <M3Icon name="schedule" />
                {{ text.remindLater }}
            </M3Chip>

            <M3Chip :selected="true" variant="filter">
                {{ text.updates }}
            </M3Chip>

            <M3Chip variant="input" dismissible>
                {{ text.projectAlpha }}
            </M3Chip>

            <M3Chip variant="suggestion">
                <M3Icon name="lightbulb" />
                {{ text.draftSummary }}
            </M3Chip>
        </template>
    </div>
</template>

<script lang="ts" setup>
import type { StorybookLocale } from '../../i18n'

import { computed, ref } from 'vue'

import { M3Chip } from '@/components/chip'
import { M3Icon } from '@/components/icon'

import { DEFAULT_STORYBOOK_LOCALE, localize } from '../../i18n'

type FilterId = 'assignedToMe' | 'needsReview' | 'urgent'
type TokenId = 'billing' | 'designReview' | 'onboarding'

const messages = {
  'en-US': {
    assignedToMe: 'Assigned to me',
    billing: 'Billing',
    designReview: 'Design review',
    draftSummary: 'Draft summary',
    needsReview: 'Needs review',
    onboarding: 'Onboarding',
    projectAlpha: 'Project Alpha',
    remindLater: 'Remind later',
    updates: 'Updates',
    urgent: 'Urgent',
  },
  'ru-RU': {
    assignedToMe: 'Назначено мне',
    billing: 'Оплата',
    designReview: 'Ревью дизайна',
    draftSummary: 'Сводка черновика',
    needsReview: 'Нужно ревью',
    onboarding: 'Онбординг',
    projectAlpha: 'Проект Альфа',
    remindLater: 'Напомнить позже',
    updates: 'Обновления',
    urgent: 'Срочно',
  },
}

const props = withDefaults(defineProps<{
  locale?: StorybookLocale
  mode?: 'matrix' | 'filters' | 'inputs'
}>(), {
  locale: DEFAULT_STORYBOOK_LOCALE,
  mode: 'matrix',
})

const text = computed(() => localize(props.locale, messages))

const filterOptions = computed(() => {
  const options: FilterId[] = ['assignedToMe', 'urgent', 'needsReview']
  return options.map(id => ({ id, label: text.value[id] }))
})

const filters = ref<FilterId[]>(['assignedToMe', 'urgent'])
const tokenIds = ref<TokenId[]>(['onboarding', 'billing', 'designReview'])
const tokens = computed(() => tokenIds.value.map(id => ({ id, label: text.value[id] })))

const onToggleFilter = (option: FilterId, selected: boolean) => {
  if (selected) {
    filters.value = [...filters.value, option]
    return
  }

  filters.value = filters.value.filter(value => value !== option)
}

const removeToken = (token: TokenId) => {
  tokenIds.value = tokenIds.value.filter(value => value !== token)
}
</script>

<style scoped>
.m3-chip-showcase {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}
</style>
