<template>
    <span ref="target" :style="{ display: 'inline-block' }">
        <M3Button>
            Delete
        </M3Button>

        <M3RichTooltip :target="() => target" hide-on-miss-click>
            <template #heading>
                Deleting item
            </template>

            This action can not be undone

            <template #footer>
                <M3Button v-m3-popper-closer appearance="text">
                    Proceed
                </M3Button>

                <M3Button v-m3-popper-closer appearance="text">
                    Cancel
                </M3Button>
            </template>
        </M3RichTooltip>
    </span>
</template>

<script lang="ts" setup>
import { M3Button } from '@/components/button'
import { M3RichTooltip } from '@/components/rich-tooltip'

import { vM3PopperCloser } from '@/components/popper'

import { ref } from 'vue'

const target = ref<HTMLElement | null>(null)
</script>
