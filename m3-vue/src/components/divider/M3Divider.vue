<template>
    <hr
        ref="root"
        :class="{
            'm3-divider': true,
            'm3-divider_vertical': orientation === 'vertical',
            [`m3-divider_inset-${inset}`]: inset !== 'none',
        }"
        :role="$attrs.role === 'separator' ? 'separator' : 'presentation'"
        :aria-orientation="$attrs.role === 'separator' && orientation === 'vertical' ? 'vertical' : undefined"
        v-bind="$attrs"
    />
</template>

<script lang="ts" setup>
import type {
  DividerInset,
  DividerOrientation,
} from '@modulify/m3-foundation/types/components/divider'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { PropType } from 'vue'

import { ref } from 'vue'

defineOptions({ inheritAttrs: false })

defineProps({
  orientation: {
    type: String as PropType<DividerOrientation>,
    default: 'horizontal',
  },

  inset: {
    type: String as PropType<DividerInset>,
    default: 'none',
  },
})

const root = ref<HTMLHRElement | null>(null)

defineExpose({
  get el () { return root.value },
} satisfies ElementReference<HTMLHRElement>)
</script>
