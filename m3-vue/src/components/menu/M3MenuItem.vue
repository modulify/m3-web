<template>
    <M3Link
        v-bind="linkAttrs"
        ref="root"
        v-m3-popper-closer="!disabled && !$slots.submenu"
        :href="disabled ? undefined : href"
        :to="disabled ? undefined : to"
        :disabled="disabled"
        :role="$attrs.role ?? (selection === 'single' ? 'menuitemradio' : selection === 'multiple' ? 'menuitemcheckbox' : 'menuitem')"
        :aria-checked="selection ? selected : undefined"
        :aria-disabled="disabled ? 'true' : undefined"
        :tabindex="disabled ? -1 : undefined"
        :class="{
            'm3-menu-item': true,
            'm3-menu-item_selected': selected,
            'm3-menu-item_disabled': disabled,
            'm3-menu-item_active': submenuOpen,
        }"
        :aria-haspopup="$slots.submenu ? 'menu' : undefined"
        :aria-expanded="$slots.submenu ? submenuOpen : undefined"
        :aria-controls="$slots.submenu ? submenuId : undefined"
        @blur="onBlur"
        @keydown="onKeyDown"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        @keyup.enter="onKeyUp"
        @click="onClick"
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
                v-if="'trailing' in $slots || 'submenu' in $slots"
                class="m3-menu-item__icon"
            >
                <slot v-if="'trailing' in $slots" name="trailing" />
                <M3Icon v-else name="chevron_right" aria-hidden="true" />
            </span>
        </span>
    </M3Link>

    <M3Menu
        v-if="$slots.submenu"
        :id="submenuId"
        :target="() => rootElement"
        :shown="submenuOpen"
        :placement="submenuPlacement"
        :offset-main-axis="4"
        @update:shown="submenuOpen = $event"
        @mouseenter="closeSubmenu.cancel()"
        @mouseleave="closeSubmenu.schedule()"
        @focusout="onSubmenuFocusOut"
    >
        <slot name="submenu" />
    </M3Menu>
</template>

<script lang="ts" setup>
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { M3LinkInstance } from '@/components/link'
import type { PropType } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import {
  computed,
  ref,
  useAttrs,
  useSlots,
} from 'vue'

import { isString, isUndefined, Or } from '@modulify/validator/predicates'

import { M3Icon } from '@/components/icon'
import { M3Link } from '@/components/link'
import { M3Ripple } from '@/components/ripple'
import { vM3PopperCloser } from '@/components/popper'

import { useId } from '@/composables/id'
import { useTimeout } from '@/composables/timing'

import M3Menu from './M3Menu.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
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

  selection: {
    type: String as PropType<'single' | 'multiple'>,
    validator: (value: string) => ['single', 'multiple'].includes(value),
    default: undefined,
  },

  disabled: {
    type: Boolean,
    default: false,
  },
})

const root = ref<M3LinkInstance | null>(null)
const attrs = useAttrs()
const slots = useSlots()
const linkAttrs = computed(() => {
  const { onClick: _onClick, ...rest } = attrs
  return rest
})
const rootElement = computed(() => root.value?.el ?? null)
const ripple = ref<InstanceType<typeof M3Ripple> | null>(null)
const submenuId = useId('m3-submenu')
const submenuOpen = ref(false)
const submenuPlacement = computed(() => typeof document !== 'undefined' && document.dir === 'rtl' ? 'left-start' : 'right-start')
const closeSubmenu = useTimeout(() => submenuOpen.value = false, 200)

defineExpose({
  get el () { return rootElement.value },
} satisfies ElementReference)

const onKeyUp = (event: KeyboardEvent) => {
  if (!props.disabled) ripple.value?.activate(event)
}

const onClick = (event: MouseEvent) => {
  if (props.disabled) {
    event.preventDefault()
    event.stopPropagation()
    return
  }

  if ('submenu' in slots) {
    event.preventDefault()
    closeSubmenu.cancel()
    submenuOpen.value = true
  }

  for (const handler of [attrs.onClick].flat()) {
    if (typeof handler === 'function') handler(event)
  }
}

const onBlur = (event: FocusEvent) => {
  const next = event.relatedTarget
  if ('submenu' in slots && !(next instanceof Node && document.getElementById(submenuId.value)?.contains(next))) {
    submenuOpen.value = false
  }
}

const onSubmenuFocusOut = (event: FocusEvent) => {
  const next = event.relatedTarget
  if (next instanceof Node && (rootElement.value?.contains(next) || (event.currentTarget as HTMLElement).contains(next))) return
  submenuOpen.value = false
}

const onKeyDown = (event: KeyboardEvent) => {
  if (!('submenu' in slots) || props.disabled) return
  if (event.key !== (document.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight')) return

  closeSubmenu.cancel()
  submenuOpen.value = true
  event.preventDefault()
}

const onMouseEnter = () => {
  if (!('submenu' in slots) || props.disabled) return

  closeSubmenu.cancel()
  submenuOpen.value = true
}

const onMouseLeave = () => {
  if ('submenu' in slots) closeSubmenu.schedule()
}
</script>
