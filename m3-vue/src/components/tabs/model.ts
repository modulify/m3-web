import type { M3TabSlots } from './M3Tab'
import type { VNode } from 'vue'

import { flattenVNodes } from '@/utils/runtime'

import M3Tab from './M3Tab'

export interface TabContent {
  value: string;
  label: string;
  slots: M3TabSlots;
  disabled: boolean;
  badge?: string | number;
  accessibleLabel?: string;
}

export const collectTabs = (nodes: VNode[]): TabContent[] => flattenVNodes(nodes)
  .filter(node => node.type === M3Tab)
  .map(node => {
    const props = node.props ?? {}
    return {
      value: String(props.value),
      label: String(props.label ?? ''),
      slots: (node.children ?? {}) as TabContent['slots'],
      disabled: props.disabled === true || props.disabled === '',
      badge: props.badge as string | number | undefined,
      accessibleLabel: props['aria-label'] as string | undefined,
    }
  })
