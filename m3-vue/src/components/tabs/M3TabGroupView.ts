import type { Ref } from 'vue'
import type { TabLayout, TabVariant } from '@modulify/m3-foundation/types/components/tabs'
import type { VNode } from 'vue'

import type { TabContent } from './model'

import { h, mergeProps } from 'vue'

import M3TabButton from './M3TabButton'

interface ViewContext {
  id: string;
  tabs: TabContent[];
  selected?: string;
  activate: (value: string) => void;
  variant: TabVariant;
  layout: TabLayout;
  focusedValue: Ref<string | undefined>;
  indicator: Ref<{ offset: number; width: number }>;
  root: Ref<HTMLDivElement | null>;
  track: Ref<HTMLDivElement | null>;
  attrs: Record<string, unknown>;
}

const handleTabGroupKeydown = (track: Ref<HTMLDivElement | null>, event: KeyboardEvent) => {
  const current = event.target as HTMLElement
  if (current.getAttribute('role') !== 'tab') return
  const buttons = Array.from(track.value?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)') ?? [])
  const index = buttons.indexOf(current as HTMLButtonElement)
  if (index < 0) return
  const rtl = getComputedStyle(track.value!).direction === 'rtl'
  const delta = event.key === 'ArrowRight' ? (rtl ? -1 : 1) : event.key === 'ArrowLeft' ? (rtl ? 1 : -1) : 0
  const next = event.key === 'Home' ? buttons[0] : event.key === 'End' ? buttons.at(-1) : delta ? buttons[(index + delta + buttons.length) % buttons.length] : null
  if (!next) return
  event.preventDefault()
  next.focus()
  next.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
}

const renderTabList = (
  context: ViewContext,
  tabs: TabContent[],
  active: TabContent | undefined,
  focusable: string | undefined
): VNode => h('div', { class: 'm3-tab-group__scroll' }, [h('div', {
  ref: context.track,
  class: 'm3-tab-group__track',
  role: 'tablist',
  'aria-label': context.attrs['aria-label'],
  'aria-labelledby': context.attrs['aria-labelledby'],
  style: {
    '--m3-tab-group-indicator-offset': `${context.indicator.value.offset}px`,
    '--m3-tab-group-indicator-width': `${context.indicator.value.width}px`,
  },
}, [
  ...tabs.map(tab => h(M3TabButton, {
    key: tab.value,
    id: `${context.id}-tab-${tab.value}`,
    panelId: `${context.id}-panel-${tab.value}`,
    tab,
    active: tab === active,
    focused: tab.value === focusable,
    onActivate: () => context.activate(tab.value),
    onFocus: () => context.focusedValue.value = tab.value,
  })),
  h('span', { class: 'm3-tab-group__indicator', 'aria-hidden': 'true' }),
])])

export const renderTabGroupView = (context: ViewContext): VNode => {
  const tabs = context.tabs
  const available = tabs.filter(tab => !tab.disabled)
  const selected = context.selected
  const active = tabs.find(tab => tab.value === selected && !tab.disabled)
  const focusable = available.some(tab => tab.value === context.focusedValue.value)
    ? context.focusedValue.value
    : available.find(tab => tab.value === selected)?.value ?? available[0]?.value

  return h('div', mergeProps(context.attrs, {
    id: context.id,
    ref: context.root,
    class: ['m3-tab-group', `m3-tab-group_${context.variant}`, `m3-tab-group_${context.layout}`, { 'm3-tab-group_with-icons': tabs.some(tab => tab.slots.icon) }],
    onKeydown: (event: KeyboardEvent) => { if (!event.defaultPrevented) handleTabGroupKeydown(context.track, event) },
  }), [
    renderTabList(context, tabs, active, focusable),
    ...tabs.map(tab => h('div', {
      key: tab.value,
      id: `${context.id}-panel-${tab.value}`,
      role: 'tabpanel',
      'aria-labelledby': `${context.id}-tab-${tab.value}`,
      tabindex: tab === active ? 0 : -1,
      hidden: tab !== active,
      class: 'm3-tab-group__panel',
    }, tab === active ? tab.slots.default?.() : undefined)),
  ])
}
