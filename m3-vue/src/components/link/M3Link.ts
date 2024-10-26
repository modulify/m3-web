import type {
  ComponentPublicInstance,
  DefineComponent,
  PropType,
  Ref,
} from 'vue'

import type { RouteLocationRaw } from 'vue-router'

import {
  defineComponent,
  getCurrentInstance,
  h,
  ref,
  resolveComponent,
} from 'vue'

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

export default defineComponent({
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

    expose({
      getElement: () => toElement(root),
      focus: () => toElement(root)?.focus(),
      blur: () => toElement(root)?.blur(),
    })

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
}) as DefineComponent<{
  type?: HTMLButtonElement['type'];
  to?: RouteLocationRaw;
  href?: string;
}, None, None, None, {
  getElement (): HTMLElement | null;
  getChildren (): HTMLCollection;
  focus (): void;
  blur (): void;
}>