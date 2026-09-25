<template>
    <section ref="root" role="group" class="m3-navigation__section">
        <div v-if="'header' in $slots" class="m3-navigation__section-header">
            <slot name="header" />
        </div>

        <slot />
    </section>
</template>

<script lang="ts" setup>
import type { ElementReference } from '@modulify/m3-foundation/types/dom'

import { ref } from 'vue'

const root = ref<HTMLElement | null>(null)

defineExpose({
  get el () { return root.value },
} satisfies ElementReference<HTMLElement>)
</script>
