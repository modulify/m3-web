import type { ComputedRef } from 'vue'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { LineCount, Lines } from '@modulify/m3-foundation/types/components/list'
import type { M3LinkInstance } from '@/components/link'
import type { PropType, Ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type { Slots, VNode } from 'vue'

import {
  computed,
  defineComponent,
  h,
  ref,
} from 'vue'

import { M3Link } from '@/components/link'
import { M3Ripple } from '@/components/ripple'

import { normalize } from '@/utils/runtime'

type Root = HTMLElement | M3LinkInstance | null
type ListItemProps = Readonly<{
  type: HTMLButtonElement['type'];
  to?: RouteLocationRaw;
  href: string;
  headline: string;
  overline: string;
  supportingText: string;
  lines?: Lines;
  interactive: boolean;
  selected: boolean;
  disabled: boolean;
}>
type CollectedSlots = {
  content: VNode[];
  headline: VNode[];
  leading: VNode[];
  overline: VNode[];
  supportingText: VNode[];
  trailing: VNode[];
}
type CollectedAttrs = {
  className: unknown;
  onClick: unknown;
  onKeyup: unknown;
  rootAttrs: Record<string, unknown>;
  style: unknown;
}
type ListItemState = {
  hasHeadline: boolean;
  hasOverline: boolean;
  hasSupportingText: boolean;
  interactive: boolean;
  lines: LineCount;
  supportingLines: number;
}

const lineCounts: LineCount[] = [1, 2, 3]

const toElement = (root: Root) => {
  if (typeof HTMLElement !== 'undefined' && root instanceof HTMLElement) {
    return root
  }

  return root && 'el' in root ? root.el : null
}

const call = (handler: unknown, event: Event) => {
  if (Array.isArray(handler)) {
    handler.forEach(item => call(item, event))
    return
  }

  if (typeof handler === 'function') {
    (handler as ((event: Event) => void))(event)
  }
}

const toNodes = (nodes: VNode[] | undefined) => normalize(nodes ?? []).map(([node]) => node)

const resolveLines = (overline: boolean, supportingText: boolean): LineCount => {
  if (overline && supportingText) {
    return 3
  }

  if (overline || supportingText) {
    return 2
  }

  return 1
}

const normalizeLines = (lines: Lines | undefined, fallback: LineCount): LineCount => {
  const normalized = Number(lines ?? fallback)

  return lineCounts.includes(normalized as LineCount)
    ? normalized as LineCount
    : fallback
}

const isLines = (value: unknown) => lineCounts.includes(Number(value) as LineCount)

const getSupportingLines = (lines: LineCount) => lines === 3 ? 2 : 1

const collectAttrs = (attrs: Record<string, unknown>): CollectedAttrs => {
  const {
    class: className,
    onClick,
    onKeyup,
    style,
    ...rootAttrs
  } = attrs

  return {
    className,
    onClick,
    onKeyup,
    rootAttrs,
    style,
  }
}

const collectSlots = (slots: Slots): CollectedSlots => ({
  content: toNodes(slots.default?.()),
  headline: toNodes(slots.headline?.()),
  leading: toNodes(slots.leading?.()),
  overline: toNodes(slots.overline?.()),
  supportingText: toNodes(slots.supportingText?.()),
  trailing: toNodes(slots.trailing?.()),
})

const getState = (props: ListItemProps, slots: CollectedSlots, onClick: unknown): ListItemState => {
  const hasOverline = slots.overline.length > 0 || props.overline.length > 0
  const hasHeadline = slots.headline.length > 0 || props.headline.length > 0 || slots.content.length > 0
  const hasSupportingText = slots.supportingText.length > 0 || props.supportingText.length > 0
  const linesActual = normalizeLines(props.lines, resolveLines(hasOverline, hasSupportingText))

  return {
    hasHeadline,
    hasOverline,
    hasSupportingText,
    interactive: props.interactive || props.href.length > 0 || !!props.to || !!onClick,
    lines: linesActual,
    supportingLines: getSupportingLines(linesActual),
  }
}

const renderBody = (props: ListItemProps, slots: CollectedSlots, state: ListItemState) => h('span', {
  class: 'm3-list-item__body',
}, [
  state.hasOverline ? h('span', { class: 'm3-list-item__overline' }, slots.overline.length > 0 ? slots.overline : props.overline) : null,
  state.hasHeadline ? h('span', { class: 'm3-list-item__headline' }, slots.headline.length > 0 ? slots.headline : props.headline.length > 0 ? props.headline : slots.content) : null,
  state.hasSupportingText ? h('span', { class: 'm3-list-item__supporting-text' }, slots.supportingText.length > 0 ? slots.supportingText : props.supportingText) : null,
])

const renderItemContent = (
  props: ListItemProps,
  slots: CollectedSlots,
  state: ListItemState,
  ripple: Ref<InstanceType<typeof M3Ripple> | null>,
  rootElement: ComputedRef<HTMLElement | null>
) => [
  state.interactive ? h(M3Ripple, { ref: ripple, owner: rootElement }) : null,
  h('span', {
    'aria-hidden': 'true',
    class: 'm3-list-item__state',
  }),
  slots.leading.length > 0 ? h('span', { class: 'm3-list-item__leading' }, slots.leading) : null,
  renderBody(props, slots, state),
  slots.trailing.length > 0 ? h('span', { class: 'm3-list-item__trailing' }, slots.trailing) : null,
]

const renderContainer = (
  props: ListItemProps,
  state: ListItemState,
  attrs: CollectedAttrs,
  root: Ref<Root>,
  onKeyup: (event: KeyboardEvent, handler: unknown) => void,
  content: (VNode | null)[]
) => state.interactive
  ? h(M3Link, {
    ref: root,
    'aria-disabled': props.disabled ? 'true' : undefined,
    href: props.href,
    to: props.disabled ? undefined : props.to,
    type: props.type,
    disabled: props.disabled,
    tabindex: props.disabled ? -1 : undefined,
    class: 'm3-list-item__content',
    onClick: (event: MouseEvent) => {
      if (props.disabled) {
        event.preventDefault()
        return
      }

      call(attrs.onClick, event)
    },
    onKeyup: (event: KeyboardEvent) => onKeyup(event, attrs.onKeyup),
  }, () => content)
  : h('div', {
    ref: root,
    class: 'm3-list-item__content',
  }, content)

const renderListItem = (
  props: ListItemProps,
  state: ListItemState,
  attrs: CollectedAttrs,
  root: Ref<HTMLDivElement | null>,
  container: VNode
) => h('div', {
  role: 'listitem',
  ...attrs.rootAttrs,
  ref: root,
  class: [attrs.className, {
    'm3-list-item': true,
    'm3-list-item_multiline': state.lines > 1,
    'm3-list-item_interactive': state.interactive,
    'm3-list-item_selected': props.selected,
    'm3-list-item_disabled': props.disabled,
  }],
  style: state.lines === 1
    ? attrs.style
    : [
      attrs.style,
      { '--m3-list-item-supporting-lines': state.supportingLines },
    ],
}, container)

export default defineComponent({
  name: 'M3ListItem',

  inheritAttrs: false,

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
      default: '',
    },

    headline: {
      type: String,
      default: '',
    },

    overline: {
      type: String,
      default: '',
    },

    supportingText: {
      type: String,
      default: '',
    },

    lines: {
      type: [String, Number] as PropType<Lines | undefined>,
      validator: isLines,
      default: undefined,
    },

    interactive: {
      type: Boolean,
      default: false,
    },

    selected: {
      type: Boolean,
      default: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  setup (props, { attrs, expose, slots }) {
    const listItem = ref<HTMLDivElement | null>(null)
    const root = ref<Root>(null)
    const rootElement = computed(() => toElement(root.value))
    const ripple = ref<InstanceType<typeof M3Ripple> | null>(null)

    expose({
      get el () { return listItem.value },
    } satisfies ElementReference<HTMLDivElement>)

    const onKeyup = (event: KeyboardEvent, handler: unknown) => {
      if (event.code === 'Enter') {
        ripple.value?.activate(event)
      }

      call(handler, event)
    }

    return () => {
      const $attrs = collectAttrs(attrs)
      const $slots = collectSlots(slots)
      const state = getState(props, $slots, $attrs.onClick)

      return renderListItem(
        props,
        state,
        $attrs,
        listItem,
        renderContainer(
          props,
          state,
          $attrs,
          root,
          onKeyup,
          renderItemContent(props, $slots, state, ripple, rootElement)
        )
      )
    }
  },
})
