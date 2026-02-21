import type { Entry } from './types'

import { M3Popper } from '../popper'

import { defineComponent, h, ref } from 'vue'
import render from '@/utils/render'
import { useCollection } from './collection'

type Methods = ReturnType<typeof useCollection>

const M3PlaneTooltipCollector = defineComponent({
  name: 'M3PlaneTooltipCollector',

  setup (_, { expose }) {
    const collection = ref([] as [Element, Entry][])

    expose(useCollection(collection))

    return () => collection.value.map(([el, { content, options }]) => {
      return content ? h(M3Popper, {
        targetTriggers: ['hover'],
        delay: { hide: 150 },
        ...options,
        class: [options.class, { 'm3-plane-tooltip': true }],
        role: 'tooltip',
        target: ref(el),
        'onUpdate:shown': (shown: boolean) => el.classList.toggle('m3-plane-tooltip-target_active', shown),
      }, {
        default: () => render(content),
      }) : undefined
    })
  },
})

export type M3PlaneTooltipCollectorMethods = Methods

export default M3PlaneTooltipCollector
