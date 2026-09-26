<template>
    <M3Link
        ref="root"
        :href="href"
        :to="to"
        :class="{
            'm3-menu-item': true,
            'm3-menu-item_selected': selected,
            'm3-menu-item_disabled': disabled,
        }"
        @keyup.enter="onKeyUp"
    >
        <M3Ripple ref="ripple" :owner="ref(rootElement)" />

        <span class="m3-menu-item__state" />
        <span class="m3-menu-item__content">
            <span
                v-if="'leading' in $slots"
                class="m3-menu-item__icon"
            >
                <slot name="leading" />
            </span>

            <span class="m3-menu-item__body">
                <slot />
            </span>

            <span
                v-if="'trailing' in $slots"
                class="m3-menu-item__icon"
            >
                <slot name="trailing" />
            </span>
        </span>
    </M3Link>
</template>

<script lang="ts" setup>
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { M3LinkInstance } from '@/components/link'
import type { PropType } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import { computed, ref } from 'vue'

import { isString, isUndefined, Or } from '@modulify/validator/predicates'

import { M3Link } from '@/components/link'
import { M3Ripple } from '@/components/ripple'

defineProps({
  to: {
    type: null as unknown as PropType<RouteLocationRaw>,
    default: undefined,
  },

  href: {
    type: null as unknown as PropType<string | undefined>,
    validator: Or(isString, isUndefined) as (value: unknown) => boolean,
    default: undefined,
  },

  selected: {
    type: Boolean,
    default: false,
  },

  disabled: {
    type: Boolean,
    default: false,
  },
})

const root = ref<M3LinkInstance | null>(null)
const rootElement = computed(() => root.value?.el ?? null)
const ripple = ref<InstanceType<typeof M3Ripple> | null>(null)

defineExpose({
  get el () { return rootElement.value },
} satisfies ElementReference<HTMLElement>)

const onKeyUp = (event: KeyboardEvent) => ripple.value?.activate(event)
</script>
