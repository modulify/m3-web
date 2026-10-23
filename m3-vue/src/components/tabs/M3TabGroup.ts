import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { PropType } from 'vue'
import type {
  TabLayout,
  TabNavigation,
  TabVariant,
} from '@modulify/m3-foundation/types/components/tabs'

import type { TabContent } from './model'

import { defineComponent, ref } from 'vue'

import { useId } from '@/composables/id'

import { collectTabs } from './model'
import { renderTabGroupView } from './M3TabGroupView'
import { useTabGroupIndicator } from './useTabGroupIndicator'
import { useTabGroupSelection } from './useTabGroupSelection'

export default defineComponent({
  name: 'M3TabGroup',
  inheritAttrs: false,
  props: {
    variant: { type: String as PropType<TabVariant>, default: 'primary' },
    layout: { type: String as PropType<TabLayout>, default: 'fixed' },
    value: { type: String, default: undefined },
    navigation: { type: String as PropType<TabNavigation>, default: undefined },
    queryKey: { type: String, default: 'tab' },
  },

  emits: {
    'update:value': (_value: string) => true,
    change: (_value: string) => true,
  },

  setup (props, { attrs, slots, emit, expose }) {
    const id = useId('m3-tab-group', () => attrs.id as string | undefined)
    const root = ref<HTMLDivElement | null>(null)
    const track = ref<HTMLDivElement | null>(null)

    let tabs: TabContent[] = []

    const { selected, activate } = useTabGroupSelection(
      props,
      () => tabs.filter(tab => !tab.disabled).map(tab => tab.value),
      (name, value) => {
        if (name === 'change') emit('change', value)
        else emit('update:value', value)
      }
    )
    const focusedValue = ref<string>()
    const indicator = useTabGroupIndicator(track, () => props.variant)

    expose({ get el () { return root.value } } satisfies ElementReference<HTMLDivElement>)

    return () => {
      tabs = collectTabs(slots.default?.() ?? [])

      return renderTabGroupView({
        id: id.value,
        tabs,
        selected: selected(),
        activate,
        variant: props.variant,
        layout: props.layout,
        focusedValue,
        indicator,
        root,
        track,
        attrs,
      })
    }
  },
})
