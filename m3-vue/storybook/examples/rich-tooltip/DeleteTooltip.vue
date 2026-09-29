<template>
    <span ref="target" :style="{ display: 'inline-block' }">
        <M3Button :aria-describedby="uid + '-tooltip'">
            {{ text.delete }}
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
                    {{ text.confirm }}
                </M3Button>

                <M3Button v-m3-popper-closer appearance="text">
                    {{ text.cancel }}
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
  'en-US': { cancel: 'Cancel', confirm: 'Delete', delete: 'Delete', description: 'The item will move to Trash, where you can restore it.', heading: 'Delete item?' },
  'ru-RU': { cancel: 'Отмена', confirm: 'Удалить', delete: 'Удалить', description: 'Элемент переместится в корзину, откуда его можно восстановить.', heading: 'Удалить элемент?' },
})

const uid = useId()
const target = ref<HTMLElement | null>(null)
</script>
