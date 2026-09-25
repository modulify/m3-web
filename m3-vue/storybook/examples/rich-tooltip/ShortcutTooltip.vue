<template>
    <span ref="target" :style="{ display: 'inline-block' }">
        <M3Button :aria-describedby="uid + '-tooltip'" appearance="text">
            Keyboard shortcut
        </M3Button>

        <M3RichTooltip
            :id="uid + '-tooltip'"
            :target="() => target"
            hide-on-miss-click
        >
            <template #heading>
                Jump to inbox
            </template>

            Press <strong>G</strong>, then <strong>I</strong> to open the inbox from anywhere in the workspace.
        </M3RichTooltip>
    </span>
</template>

<script lang="ts" setup>
import { ref, useId } from 'vue'

import { M3Button } from '@/components/button'
import { M3RichTooltip } from '@/components/rich-tooltip'

const uid = useId()
const target = ref<HTMLElement | null>(null)
</script>
