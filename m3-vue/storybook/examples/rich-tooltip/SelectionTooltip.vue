<template>
    <span ref="target" :style="{ display: 'inline-block' }">
        <M3Button :aria-describedby="uid + '-tooltip'">
            {{ text.review }}
        </M3Button>

        <M3RichTooltip
            :id="uid + '-tooltip'"
            :target="() => target"
            hide-on-miss-click
        >
            <template #heading>
                {{ text.heading }}
            </template>

            <div>{{ text.description }}</div>

            <template #footer>
                <M3Button v-m3-popper-closer appearance="text">
                    {{ text.edit }}
                </M3Button>

                <M3Button v-m3-popper-closer appearance="text">
                    {{ text.apply }}
                </M3Button>
            </template>
        </M3RichTooltip>
    </span>
</template>

<script lang="ts" setup>
import type { StorybookLocale } from '../../i18n'

import { ref, useId } from 'vue'

import { M3Button } from '@/components/button'
import { M3RichTooltip } from '@/components/rich-tooltip'

import { vM3PopperCloser } from '@/components/popper'

import { localize } from '../../i18n'

const props = defineProps<{ locale: StorybookLocale }>()
const text = localize(props.locale, {
  'en-US': { apply: 'Apply', description: 'Continue editing the selected items or apply labels to them.', edit: 'Continue', heading: '3 items selected', review: 'Review selection' },
  'ru-RU': { apply: 'Применить', description: 'Продолжите редактирование выбранных элементов или примените к ним метки.', edit: 'Продолжить', heading: 'Выбрано 3 элемента', review: 'Проверить выбор' },
})

const uid = useId()
const target = ref<HTMLElement | null>(null)
</script>
