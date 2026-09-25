<template>
    <span ref="target" :style="{ display: 'inline-block' }">
        <M3Button :aria-describedby="uid + '-tooltip'">
            Review selection
        </M3Button>

        <M3RichTooltip
            :id="uid + '-tooltip'"
            :target="() => target"
            hide-on-miss-click
        >
            <template #heading>
                3 items selected
            </template>

            Continue with a bulk action or refine the selection before applying changes.

            <template #footer>
                <M3Button v-m3-popper-closer appearance="text">
                    Keep editing
                </M3Button>

                <M3Button v-m3-popper-closer appearance="text">
                    Apply labels
                </M3Button>
            </template>
        </M3RichTooltip>
    </span>
</template>

<script lang="ts" setup>
import { ref, useId } from 'vue'

import { M3Button } from '@/components/button'
import { M3RichTooltip } from '@/components/rich-tooltip'

import { vM3PopperCloser } from '@/components/popper'

const uid = useId()
const target = ref<HTMLElement | null>(null)
</script>
