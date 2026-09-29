<template>
    <span ref="target" :style="{ display: 'inline-block' }">
        <M3Button :aria-describedby="uid + '-tooltip'" appearance="text">
            {{ text.trigger }}
        </M3Button>

        <M3RichTooltip
            :id="uid + '-tooltip'"
            :target="() => target"
            hide-on-miss-click
        >
            <template #heading>
                {{ text.heading }}
            </template>

            <div>
                {{ text.press }} <strong>G</strong>, {{ text.then }} <strong>I</strong>{{ text.description }}
            </div>
        </M3RichTooltip>
    </span>
</template>

<script lang="ts" setup>
import type { StorybookLocale } from '../../i18n'

import { ref, useId } from 'vue'

import { M3Button } from '@/components/button'
import { M3RichTooltip } from '@/components/rich-tooltip'

import { localize } from '../../i18n'

const props = defineProps<{ locale: StorybookLocale }>()
const text = localize(props.locale, {
  'en-US': { description: ' to open the inbox from anywhere in the workspace.', heading: 'Jump to inbox', press: 'Press', then: 'then', trigger: 'Keyboard shortcut' },
  'ru-RU': { description: ', чтобы открыть входящие из любой части рабочего пространства.', heading: 'Перейти к входящим', press: 'Нажмите', then: 'затем', trigger: 'Сочетание клавиш' },
})

const uid = useId()
const target = ref<HTMLElement | null>(null)
</script>
