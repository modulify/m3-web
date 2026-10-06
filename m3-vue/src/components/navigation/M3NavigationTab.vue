<template>
    <div
        :id="_id"
        ref="root"
        :class="{
            ['m3-navigation-tab']: true,
            ['m3-navigation-tab_in-' + appearance]: true,
            ['m3-navigation-tab_labelled']: 'label' in $slots || label.length > 0,
            ['m3-navigation-tab_active']: active,
        }"
        v-bind="rootAttrs"
    >
        <M3Link
            ref="button"
            :href="href"
            :aria-current="active ? 'page' : undefined"
            class="m3-navigation-tab__button"
            v-bind="linkAttrs"
            @click="onClick"
        >
            <span class="m3-navigation-tab__state">
                <span class="m3-navigation-tab__icon">
                    <slot />
                </span>

                <M3Badge
                    v-if="'badge' in $slots"
                    :aria-hidden="inDrawer ? 'true' : 'false'"
                    class="m3-navigation-tab__badge m3-navigation-tab__badge_labelled"
                >
                    <slot name="badge" />
                </M3Badge>

                <M3Badge
                    v-else-if="badged"
                    :aria-hidden="inDrawer ? 'true' : 'false'"
                    class="m3-navigation-tab__badge"
                />

                <span
                    v-if="('label' in $slots || label.length > 0)"
                    :id="labelId"
                    class="m3-navigation-tab__label"
                >
                    <slot name="label">{{ label }}</slot>
                </span>

                <span
                    v-if="'badge' in $slots && inDrawer"
                    role="status"
                    class="m3-navigation-tab__badge-label"
                >
                    <slot name="badge" />
                </span>
                <span ref="rippleSurface" class="m3-navigation-tab__ripple-surface">
                    <M3Ripple :owner="ref(buttonElement)" :surface="rippleSurface" centered />
                </span>
            </span>
        </M3Link>
    </div>
</template>

<script lang="ts" setup>
import type { Appearance } from '@modulify/m3-foundation/types/components/navigation'
import type { ElementReference, Interactable } from '@modulify/m3-foundation/types/dom'
import type { M3LinkInstance } from '@/components/link'
import type { PropType, Ref } from 'vue'

import { computed, inject } from 'vue'
import { isId } from '@modulify/m3-foundation/lib/predicates'
import { isUndefined } from '@modulify/validator/predicates'
import { mergeIdRefs } from '@modulify/m3-foundation/lib/dom'
import { Or } from '@modulify/validator/predicates'
import { ref } from 'vue'
import { useAttrs } from 'vue'

import { M3Badge } from '@/components/badge'
import { M3Link } from '@/components/link'
import { M3Ripple } from '@/components/ripple'

import { provideM3IconAppearance } from '@/components/icon/injections'
import { useBreakpoint } from '@/composables/breakpoint'
import { useId } from '@/composables/id'

import { M3NavigationAppearance } from './injections'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  id: {
    type: null as unknown as PropType<string | undefined>,
    validator: Or(isId, isUndefined) as (value: unknown) => boolean,
    default: undefined,
  },

  href: {
    type: String,
    default: undefined,
  },

  label: {
    type: String,
    default: '',
  },

  active: {
    type: Boolean,
    default: false,
  },

  badged: {
    type: Boolean,
    default: false,
  },

  /** Disables default click event handler on button element, useful for programmatic navigation. */
  prevent: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['navigate'])

const _id = useId('m3-navigation-item', computed(() => props.id))

const requestedAppearance = inject<Ref<Appearance>>(M3NavigationAppearance, ref('auto'))
const breakpoint = useBreakpoint()
const appearance = computed(() => requestedAppearance.value === 'auto'
  ? breakpoint.value.ge('large') ? 'rail-expanded' : breakpoint.value.ge('expanded') ? 'rail' : 'bar'
  : requestedAppearance.value)
const button = ref<M3LinkInstance | null>(null)
const root = ref<HTMLDivElement | null>(null)
const rippleSurface = ref<HTMLElement | null>(null)
const buttonElement = computed(() => button.value?.el ?? null)

const inDrawer = computed(() => appearance.value === 'drawer')

const labelId = computed(() => _id.value + '-label')
const attrs = useAttrs()
const linkAttrs = computed(() => {
  const ariaLabel = attrs['aria-label']
  const ariaLabelledBy = attrs['aria-labelledby']

  return {
    'aria-label': ariaLabel,
    'aria-labelledby': typeof ariaLabelledBy === 'string'
      ? mergeIdRefs(ariaLabelledBy, labelId.value)
      : ariaLabel === undefined ? labelId.value : undefined,
  }
})
const rootAttrs = computed(() => {
  const {
    'aria-label': _ariaLabel,
    'aria-labelledby': _ariaLabelledBy,
    ...root
  } = attrs

  return root
})

provideM3IconAppearance(() => props.active ? 'filled' : 'outlined')

defineExpose({
  get el () { return root.value },
  click: () => button.value?.click(),
  focus: () => button.value?.focus(),
  blur: () => button.value?.blur(),
} satisfies ElementReference<HTMLDivElement> & Interactable)

const onClick = (event: MouseEvent) => {
  if (props.prevent) {
    event.preventDefault()
  }

  emit('navigate')
}
</script>
