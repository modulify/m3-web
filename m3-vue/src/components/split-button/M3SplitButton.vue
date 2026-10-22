<template>
    <div
        :id="uid"
        ref="root"
        :class="{
            ['m3-split-button']: true,
            ['m3-split-button_' + size]: true,
            ['m3-split-button_open']: state.open && !disabled,
        }"
        role="group"
    >
        <span class="m3-split-button__segment" @click.self="!disabled && main?.click()">
            <M3Button
                ref="main"
                :appearance="appearance"
                :size="size"
                :disabled="disabled"
                class="m3-split-button__main"
                @click="$emit('action', $event)"
            >
                <slot />
            </M3Button>
        </span>

        <span class="m3-split-button__segment" @click.self="!disabled && trailing?.click()">
            <M3Button
                ref="trailing"
                :appearance="appearance"
                :size="size"
                :disabled="disabled"
                :aria-label="menuLabel"
                :aria-expanded="state.open && !disabled"
                :aria-controls="uid + '-menu'"
                class="m3-split-button__trailing"
                aria-haspopup="menu"
            >
                <M3Icon name="expand_more" />
            </M3Button>
        </span>
    </div>

    <M3Menu
        :id="uid + '-menu'"
        :target="() => trailing?.el ?? null"
        :shown="state.open"
        :disabled="disabled"
        :offset-main-axis="4"
        placement="bottom-end"
        @update:shown="toggle"
    >
        <slot :close="() => toggle(false)" name="menu" />
    </M3Menu>
</template>

<script lang="ts" setup>
import type { Appearance } from '@modulify/m3-foundation/types/components/button'
import type { ElementReference, Interactable } from '@modulify/m3-foundation/types/dom'
import type { PropType } from 'vue'
import type { Size } from '@modulify/m3-foundation/types/components/button'

import { reactive, ref, watch } from 'vue'

import { isId } from '@modulify/m3-foundation/lib/predicates'
import { isUndefined } from '@modulify/validator/predicates'
import { Or } from '@modulify/validator/predicates'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3Menu } from '@/components/menu'
import { useId } from '@/composables/id'

const props = defineProps({
  id: {
    type: null as unknown as PropType<string | undefined>,
    validator: Or(isId, isUndefined) as (value: unknown) => boolean,
    default: undefined,
  },

  appearance: {
    type: String as PropType<Appearance>,
    default: 'filled',
  },

  size: {
    type: String as PropType<Size>,
    default: 'sm',
  },

  menuLabel: {
    type: String,
    required: true,
  },

  open: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined,
  },

  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  'action': [event: MouseEvent];
  'toggle': [value: boolean];
  'update:open': [value: boolean];
}>()

const uid = useId('m3-split-button', () => props.id)

const root = ref<HTMLDivElement | null>(null)
const main = ref<(ElementReference & Interactable) | null>(null)
const trailing = ref<(ElementReference & Interactable) | null>(null)

const state = reactive({
  open: props.open ?? false,
})

watch(() => props.open, open => {
  if (open !== undefined && open !== state.open) {
    state.open = open
  }
})

const toggle = (open: boolean) => {
  state.open = open
  emit('update:open', open)
  emit('toggle', open)
}

defineExpose({
  get el () { return root.value },
} satisfies ElementReference<HTMLDivElement>)
</script>
