<template>
    <div
        ref="root"
        :aria-controls="_id + '-menu'"
        :aria-expanded="expanded ? 'true' : 'false'"
        :aria-disabled="disabled ? 'true' : 'false'"
        :aria-readonly="readonly ? 'true' : 'false'"
        :class="{
            'm3-select': true,
            'm3-select_expanded': shouldBeExpanded,
        }"
        aria-haspopup="listbox"
        role="combobox"
    >
        <M3TextField
            :id="_id"
            :value="text"
            :label="label"
            :placeholder="placeholder"
            :invalid="invalid"
            :readonly="readonly"
            :outlined="outlined"
            class="m3-select__field"
        >
            <template v-if="'leading' in $slots" #leading-icon>
                <slot name="leading" :active="shouldBeExpanded" />
            </template>

            <template #trailing-icon>
                <SpriteCaret
                    aria-hidden="true"
                    class="m3-select__caret"
                />
            </template>
        </M3TextField>

        <M3Menu
            :id="_id + '-menu'"
            v-model:shown="shouldBeExpanded"
            :target="ref(root)"
            :placement="placement"
            :aria-hidden="expanded ? 'false' : 'true'"
            :disabled="disabled || readonly"
            :style="{ width: rootWidth + 'px' }"
            role="listbox"
            @shown="expanded = true"
            @hide="expanded = false"
        >
            <div class="m3-select__scroll-box">
                <M3ScrollRail />

                <M3MenuItem
                    v-for="(option, index) in options"
                    :key="index"
                    :selected="equalPredicate.call(null, option.value, value as Maybe<T>)"
                    role="option"
                    @click="pick(option)"
                >
                    <template v-if="'option-leading' in $slots" #leading>
                        <slot
                            name="option-leading"
                            :option="option"
                            :active="shouldBeExpanded"
                        />
                    </template>

                    <slot
                        name="option-content"
                        :option="option"
                        :active="shouldBeExpanded"
                    >
                        {{ option.label }}
                    </slot>
                </M3MenuItem>
            </div>
        </M3Menu>
    </div>
</template>

<script lang="ts" generic="T" setup>
import type { PropType } from 'vue'
import type { Placement } from '@floating-ui/dom'

import SpriteCaret from './caret.svg'
import {
  M3Menu,
  M3MenuItem,
} from '../menu'
import { M3ScrollRail } from '../scroll-rail'
import { M3TextField } from '../text-field'

import {
  computed,
  onMounted,
  onBeforeUnmount,
  ref,
} from 'vue'

import {
  isId,
  isUndefined,
  Or,
} from '@modulify/m3-foundation/lib/predicates'

import useId from '@/composables/id'

type Maybe<T> = T | null

interface Option {
  value: T,
  label: string,
}

const props = defineProps({
  id: {
    type: null as unknown as PropType<string | undefined>,
    validator: Or(isId, isUndefined),
    default: undefined,
  },

  value: {
    type: null as unknown as PropType<Maybe<T>>,
    default: null,
  },

  label: {
    type: String,
    default: '',
  },

  options: {
    type: Array as PropType<Option[]>,
    default: () => [],
  },

  equalPredicate: {
    type: Function as PropType<(a: Maybe<T>, b: Maybe<T>) => boolean>,
    default: (a: Maybe<T>, b: Maybe<T>) => a === b,
  },

  invalid: {
    type: Boolean,
    default: false,
  },

  placeholder: {
    type: String,
    default: '',
  },

  placement: {
    type: String as PropType<Placement>,
    default: 'bottom-start',
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  readonly: {
    type: Boolean,
    default: false,
  },

  outlined: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'update:value',
])

const _id = useId('m3-select', computed(() => props.id))

const root = ref<HTMLElement | null>(null)
const rootWidth = ref(0)

const expanded = ref(false)
const shouldBeExpanded = ref(false)

const text = computed(() => props.options.find((option: Option) => {
  return props.equalPredicate.call(null, option.value, props.value as unknown as Maybe<T>)
})?.label ?? '')

const pick = (option: Option) => {
  emit('update:value', option.value)
  shouldBeExpanded.value = false
}

let resizeObserver: ResizeObserver | null = null
let resizeUpdateId: number | null = null

const requestResizeUpdate = (entry: ResizeObserverEntry) => {
  requestAnimationFrame(() => {
    rootWidth.value = entry.contentRect.width
  })
}

const cancelResizeUpdate = () => {
  if (resizeUpdateId) {
    cancelAnimationFrame(resizeUpdateId)
    resizeUpdateId = null
  }
}

onMounted(() => {
  resizeObserver = new ResizeObserver(([entry]) => {
    cancelResizeUpdate()
    requestResizeUpdate(entry)
  })
  resizeObserver.observe(root.value as HTMLElement)

  rootWidth.value = root.value?.offsetWidth ?? 0
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null

  if (resizeUpdateId) {
    cancelAnimationFrame(resizeUpdateId)
    resizeUpdateId = null
  }
})
</script>