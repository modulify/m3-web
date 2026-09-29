<template>
    <M3Card interactive>
        <template #heading>
            <h3 class="mb-0">
                {{ text.title }}
            </h3>
        </template>

        <img
            src="../../assets/piano-640x427.jpg"
            alt=""
            class="m3-card__image"
        />

        {{ text.description }}
    </M3Card>
</template>

<script lang="ts" setup>
import type { StorybookLocale } from '../../i18n'

import { computed } from 'vue'

import { M3Card } from '@/components/card'

import { localize } from '../../i18n'

const props = defineProps<{ locale: StorybookLocale }>()
const text = computed(() => localize(props.locale, {
  'en-US': {
    description: 'Watch exclusive live performances at The Hideout every Saturday at 7 p.m.',
    title: 'Live music coming soon to The Hideout',
  },
  'ru-RU': {
    description: 'Смотрите эксклюзивные живые выступления в The Hideout каждую субботу в 19:00.',
    title: 'Скоро живая музыка в The Hideout',
  },
}))
</script>
