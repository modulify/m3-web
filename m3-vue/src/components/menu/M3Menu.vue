<template>
    <M3Popper
        ref="root"
        :target="target"
        :shown="shown"
        :target-triggers="['click']"
        :disabled="disabled"
        :delay="delay"
        :detach-timeout="detachTimeout"
        :placement="placement"
        :strategy="strategy"
        :boundary="boundary"
        :container="container"
        :overflow="overflow"
        :offset-main-axis="offsetMainAxis"
        :offset-cross-axis="offsetCrossAxis"
        :class="['m3-menu', {
            'm3-menu_vibrant': color === 'vibrant',
            [`m3-menu_density-${density}`]: density !== 0,
        }]"
        :role="$attrs.role ?? 'menu'"
        animated
        hide-on-miss-click
        v-bind="$attrs"
        @keydown="onKeyDown"
        @shown="$emit('shown')"
        @hide="onHide"
        @hidden="$emit('hidden')"
        @update:shown="onToggle"
    >
        <slot />
    </M3Popper>
</template>

<script lang="ts" setup>
import type { Boundary } from '@floating-ui/dom'
import type { Color } from '@modulify/m3-foundation/types/components/menu'
import type { Delay } from '@modulify/m3-foundation/types/components/popper'
import type { Density } from '@modulify/m3-foundation/types/components/menu'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { M3PopperInstance } from '@/components/popper'
import type { OverflowBehavior } from '@modulify/m3-foundation/types/components/popper'
import type { Placement } from '@floating-ui/dom'
import type { PropType, Ref } from 'vue'
import type { Strategy } from '@floating-ui/dom'

import { isBoundary, isDelay } from '@modulify/m3-foundation/lib/popper/predicates'
import { isHTMLElement } from '@modulify/m3-foundation/lib/predicates'
import { isNull } from '@modulify/validator/predicates'
import { isNumeric } from '@modulify/m3-foundation/lib/predicates'
import { isPlacement } from '@modulify/m3-foundation/lib/popper/predicates'
import { isString } from '@modulify/validator/predicates'
import { Or } from '@modulify/validator/predicates'

import { nextTick, ref, useAttrs } from 'vue'

import { M3Popper } from '@/components/popper'

const props = defineProps({
  color: {
    type: String as PropType<Color>,
    validator: (value: string) => ['standard', 'vibrant'].includes(value),
    default: 'standard',
  },

  density: {
    type: Number as PropType<Density>,
    validator: (value: number) => [0, -1, -2, -3].includes(value),
    default: 0,
  },

  target: {
    type: [Function, Object] as PropType<(() => Element | null) | Ref<Element | null>>,
    required: true,
  },

  shown: {
    type: Boolean,
    default: false,
  },

  placement: {
    type: String as PropType<Placement>,
    validator: isPlacement,
    default: 'bottom',
  },

  strategy: {
    type: String as PropType<Strategy>,
    default: 'absolute',
  },

  boundary: {
    type: null as unknown as PropType<Boundary>,
    validator: isBoundary,
    default: 'clippingAncestors',
  },

  container: {
    type: null as unknown as PropType<string | HTMLElement>,
    validator: Or(isString, isHTMLElement) as (value: unknown) => boolean,
    default: undefined,
  },

  offsetMainAxis: {
    type: [Number, String],
    validator: isNumeric,
    default: 0,
  },

  offsetCrossAxis: {
    type: [Number, String],
    validator: isNumeric,
    default: 0,
  },

  overflow: {
    type: Array as PropType<OverflowBehavior[]>,
    default: (): OverflowBehavior[] => ['flip', 'shift', 'hide'],
  },

  delay: {
    type: [Number, String, Object] as PropType<number | string | Delay>,
    validator: isDelay,
    default: () => ({ hide: 200 }),
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  detachTimeout: {
    type: null as unknown as PropType<number | string | null>,
    validator: Or(isNull, isNumeric) as (value: unknown) => boolean,
    default: 5000,
  },
})

const emit = defineEmits([
  'shown',
  'hide',
  'hidden',
  'update:shown',
])

const attrs = useAttrs()
const root = ref<M3PopperInstance | null>(null)

const targetElement = () => typeof props.target === 'function' ? props.target() : props.target?.value

const onToggle = (open: boolean) => {
  emit('update:shown', open)

  if (open && (attrs.role ?? 'menu') === 'menu' && document.activeElement === targetElement()) {
    nextTick(() => requestAnimationFrame(() => {
      root.value?.el?.querySelector<HTMLElement>('.m3-menu > .m3-menu-item:not([aria-disabled="true"])')?.focus()
    }))
  }
}

const onHide = (reason: string) => {
  const anchor = targetElement()
  if (reason === 'generic' && root.value?.el?.contains(document.activeElement) && anchor instanceof HTMLElement) {
    requestAnimationFrame(() => anchor.focus())
  }

  emit('hide')
}

const onKeyDown = (event: KeyboardEvent) => {
  if ((attrs.role ?? 'menu') !== 'menu') return

  const items = Array.from((event.currentTarget as HTMLElement).querySelectorAll<HTMLElement>(
    ':scope > .m3-menu-item:not([aria-disabled="true"])'
  ))
  const current = items.indexOf(document.activeElement as HTMLElement)
  const anchor = targetElement()
  let next = current
  let handled = false

  switch (event.key) {
    case 'ArrowDown': next = items.length ? (current + 1) % items.length : current; handled = true; break
    case 'ArrowUp': next = items.length ? (current + items.length - 1) % items.length : current; handled = true; break
    case 'Home': next = 0; handled = true; break
    case 'End': next = items.length - 1; handled = true; break
    case 'Escape':
      root.value?.hide()
      handled = true
      break
    case 'ArrowLeft':
    case 'ArrowRight':
      if (anchor instanceof HTMLElement
        && anchor.getAttribute('aria-haspopup') === 'menu'
        && event.key === (props.placement.startsWith('left') ? 'ArrowRight' : 'ArrowLeft')) {
        root.value?.hide()
        handled = true
      }
      break
  }

  if (next !== current && items[next]) {
    items[next].focus()
  }

  if (handled) {
    event.preventDefault()
    event.stopPropagation()
  }
}

defineExpose({
  get el () { return root.value?.el ?? null },
} satisfies ElementReference)

</script>
