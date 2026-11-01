import type { CarouselController } from '@modulify/m3-foundation/lib/carousel'
import type {
  CarouselScroll,
  CarouselVariant,
} from '@modulify/m3-foundation/types/components/carousel'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { PropType, VNode } from 'vue'

import {
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  watch,
} from 'vue'

import { attachCarousel } from '@modulify/m3-foundation/lib/carousel'

import { flattenVNodes } from '@/utils/runtime'

import CarouselSlide from './CarouselSlide'
import M3CarouselItem from './M3CarouselItem'

export interface M3CarouselExposed extends ElementReference<HTMLDivElement> {
  goTo(index: number, smooth?: boolean): void;
}

function renderItems (items: VNode[], positionLabel: (position: number, total: number) => string) {
  return items.map((node, itemIndex) => {
    const itemAttrs = node.props ?? {}
    const position = positionLabel(itemIndex + 1, items.length)
    const label = itemAttrs['aria-label'] ? `${itemAttrs['aria-label']}, ${position}` : position
    const itemSlots = (node.children ?? {}) as { default?: () => VNode[]; media?: () => VNode[] }

    return h(CarouselSlide, {
      key: node.key ?? itemIndex,
      ...itemAttrs,
      label,
    }, itemSlots)
  })
}

export default defineComponent({
  name: 'M3Carousel',

  inheritAttrs: false,

  props: {
    variant: {
      type: String as PropType<CarouselVariant>,
      default: 'multi-browse',
    },

    scroll: {
      type: String as PropType<CarouselScroll>,
      default: undefined,
    },

    preferred: {
      type: Number,
      default: 280,
    },

    height: {
      type: [Number, String],
      default: undefined,
    },

    index: {
      type: Number,
      default: undefined,
    },

    positionLabel: {
      type: Function as PropType<(position: number, total: number) => string>,
      default: (position: number, total: number) => `${position} of ${total}`,
    },
  },

  emits: { change: (_index: number) => true },

  setup (props, { attrs, slots, emit, expose }) {
    const root = ref<HTMLDivElement | null>(null)

    let controller: CarouselController | null = null

    const options = () => ({
      variant: props.variant,
      scroll: props.scroll ?? (props.variant.startsWith('uncontained') ? 'auto' : 'snap'),
      preferred: props.preferred,
      onChange: (index: number) => emit('change', index),
    }) satisfies Parameters<typeof attachCarousel>[1]

    expose({
      get el () { return root.value },
      goTo: (index: number, smooth?: boolean) => controller?.goTo(index, smooth),
    } satisfies M3CarouselExposed)

    onMounted(() => {
      if (!root.value) return

      controller = attachCarousel(root.value, options())
      if (props.index !== undefined) controller.goTo(props.index, false)
    })

    onUpdated(() => controller?.update(options()))
    onBeforeUnmount(() => controller?.dispose())

    watch(() => props.index, index => {
      if (index !== undefined) controller?.goTo(index, false)
    })

    return () => {
      const items = flattenVNodes(slots.default?.() ?? []).filter(node => node.type === M3CarouselItem)
      const height = typeof props.height === 'number' ? `${props.height}px` : props.height
      const stage = h('div', { class: 'm3-carousel__stage' }, renderItems(items, props.positionLabel))
      const track = h('div', { class: 'm3-carousel__track' }, stage)
      const scroll = h('div', { class: 'm3-carousel__scroll' }, track)

      return h('div', {
        ...attrs,
        ref: root,
        class: ['m3-carousel', `m3-carousel_${props.variant}`, attrs.class],
        style: [attrs.style, height === undefined ? undefined : { height }],
        role: 'region',
        'aria-roledescription': 'carousel',
        'aria-label': attrs['aria-label'] ?? 'Carousel',
      }, scroll)
    }
  },
})
