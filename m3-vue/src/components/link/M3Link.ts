import type {
  ComponentPublicInstance,
  DefineComponent,
  PropType,
  Ref,
} from 'vue'

import {
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  ref,
  resolveComponent,
} from 'vue'

import type { Interactable } from '@modulify/m3-foundation'

import type { RouteLocationRaw } from 'vue-router'

type None = Record<string, never>
type Root = ComponentPublicInstance | HTMLElement | null

function componentExists(name) {
  const instance = getCurrentInstance()

  if (!instance) {
    throw new Error('componentExists must be called within a setup function')
  }

  return !!instance.appContext.components[name]
}

const resolveLinkComponent = () => {
  if (!componentExists('RouterLink')) {
    return null
  }

  const RouterLink = resolveComponent('RouterLink')
  return typeof RouterLink === 'object'
    ? RouterLink
    : null
}

const toElement = (ref: Ref<Root>) => {
  if (typeof HTMLElement !== 'undefined') { // SSR
    return ref.value instanceof HTMLElement
      ? ref.value
      : (ref.value?.$el as HTMLElement | undefined) ?? null
  }

  return null
}

export type M3LinkProps = {
  type?: HTMLButtonElement['type'];
  to?: RouteLocationRaw;
  href?: string;
}

export interface M3LinkMethods extends Interactable {
  el (): HTMLElement | null;
}

const M3Link = defineComponent({
  name: 'M3Link',

  props: {
    type: {
      type: String as PropType<HTMLButtonElement['type']>,
      default: 'button',
    },

    to: {
      type: null as unknown as PropType<RouteLocationRaw>,
      default: undefined,
    },

    href: {
      type: String,
      default: undefined,
    },
  },

  setup (props, { attrs, slots, expose }) {
    const root = ref<Root>(null)
    const el = computed(() => toElement(root))

    expose({
      el: () => el.value,
      click: () => el.value?.click(),
      focus: () => el.value?.focus(),
      blur: () => el.value?.blur(),
    } satisfies M3LinkMethods)

    const LinkComponent = resolveLinkComponent()

    return () => props.to && LinkComponent
      ? h(LinkComponent, {
        ...attrs,
        to: props.to,
        ref: root,
      }, slots)
      : h(props.href ? 'a' : 'button', {
        ...attrs,
        ...(props.href ? { href: props.href } : { type: props.type }),
        ref: root,
      }, slots)
  },
}) as DefineComponent<M3LinkProps, None, None, None, M3LinkMethods>

export default M3Link
