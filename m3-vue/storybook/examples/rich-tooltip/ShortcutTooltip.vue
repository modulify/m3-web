<template>
    <span ref="target" :style="{ display: 'inline-block' }">
        <M3Button appearance="text" :aria-describedby="tooltipId">
            Keyboard shortcut
        </M3Button>

        <M3RichTooltip :id="tooltipId" :target="() => target" hide-on-miss-click>
            <template #heading>
                Jump to inbox
            </template>

            Press <strong>G</strong>, then <strong>I</strong> to open the inbox from anywhere in the workspace.
        </M3RichTooltip>
    </span>
</template>

<script lang="ts" setup>
import { M3Button } from '@/components/button'
import { M3RichTooltip } from '@/components/rich-tooltip'

import { ref } from 'vue'

const target = ref<HTMLElement | null>(null)
const tooltipId = 'shortcut-tooltip-description'
</script>
