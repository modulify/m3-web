<template>
    <component
        :is="tag"
        ref="root"
        v-bind="$attrs"
        :class="{
            'm3-app-bar': true,
            ['m3-app-bar_' + appearance]: true,
            ['m3-app-bar_' + alignment]: true,
            'm3-app-bar_has-subtitle': hasSubtitle,
            'm3-app-bar_under': scrollState.under,
            'm3-app-bar_hidden': scrollState.hidden,
            'm3-app-bar_collapsed': isCollapsed,
            'm3-app-bar_transparent': scroll === 'transparent',
        }"
    >
        <div v-if="'leading' in $slots" class="m3-app-bar__leading">
            <slot name="leading" />
        </div>

        <div v-if="appearance === 'search'" class="m3-app-bar__search">
            <slot name="search">
                <slot />
            </slot>
        </div>
        <div v-else ref="title" class="m3-app-bar__title">
            <div v-if="(appearance === 'medium-flexible' || appearance === 'large-flexible') && !isCollapsed && 'image' in $slots" class="m3-app-bar__image">
                <slot name="image" />
            </div>

            <component :is="'h' + headingLevel" v-if="headline != null || 'headline' in $slots || 'default' in $slots" class="m3-app-bar__headline">
                <slot name="headline">
                    <slot>{{ headline }}</slot>
                </slot>
            </component>

            <div v-if="hasSubtitle" class="m3-app-bar__subtitle">
                <slot name="subtitle">
                    {{ subtitle }}
                </slot>
            </div>
        </div>

        <div v-if="'trailing' in $slots" class="m3-app-bar__trailing">
            <slot name="trailing" />
        </div>
    </component>
</template>

<script lang="ts" setup>
import type {
  AppBarAlignment,
  AppBarAppearance,
  AppBarScroll,
  AppBarScrollState,
} from '@modulify/m3-foundation/types/components/app-bar'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { PropType } from 'vue'

import { computed } from 'vue'
import {
  getAppBarScrollState,
  getFlexibleAppBarHeight,
} from '@modulify/m3-foundation/lib/appBar'
import { nextTick } from 'vue'
import {
  onBeforeUnmount,
  onMounted,
  ref,
  useSlots,
  watch,
} from 'vue'

import { useResizeObserver } from '@/composables/observer'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  appearance: {
    type: String as PropType<AppBarAppearance>,
    default: 'small',
  },

  alignment: {
    type: String as PropType<AppBarAlignment>,
    default: 'start',
  },

  scroll: {
    type: String as PropType<AppBarScroll>,
    default: 'pinned',
  },

  scrollTarget: {
    type: Object as PropType<HTMLElement | Window | null>,
    default: null,
  },

  headline: {
    type: String,
    default: undefined,
  },

  subtitle: {
    type: String,
    default: undefined,
  },

  headingLevel: {
    type: Number as PropType<1 | 2 | 3 | 4 | 5 | 6>,
    default: 1,
  },

  tag: {
    type: String as PropType<'header' | 'div'>,
    default: 'header',
  },
})

const slots = useSlots()
const root = ref<HTMLElement | null>(null)
const title = ref<HTMLElement | null>(null)
const scrollState = ref<AppBarScrollState>({ under: false, hidden: false, collapsed: false })
const hasSubtitle = computed(() =>
  props.appearance !== 'search' && props.appearance !== 'medium' && props.appearance !== 'large'
  && (props.subtitle != null || 'subtitle' in slots)
)
const isCollapsed = computed(() =>
  (props.appearance === 'medium-flexible' || props.appearance === 'large-flexible')
  && scrollState.value.collapsed
)

const syncExpandedHeight = () => {
  if (isCollapsed.value || !root.value || !title.value) return
  if (props.appearance !== 'medium-flexible' && props.appearance !== 'large-flexible') return
  const height = getFlexibleAppBarHeight(props.appearance, hasSubtitle.value, title.value.scrollHeight)
  root.value.style.setProperty('--m3-app-bar-measured-height', `${height}px`)
}

const titleObserver = useResizeObserver(title, syncExpandedHeight)

let listeners: AbortController | null = null

const observeScroll = () => {
  listeners?.abort('App bar scroll listener replaced')
  const target = props.scrollTarget ?? window
  const position = () => target === window ? window.scrollY : (target as HTMLElement).scrollTop
  const controller = new AbortController()
  let previous = position()

  const update = () => {
    const current = position()
    scrollState.value = getAppBarScrollState(previous, current, scrollState.value.hidden, props.scroll)
    previous = current
  }

  update()
  target.addEventListener('scroll', update, { passive: true, signal: controller.signal })
  listeners = controller
}

defineExpose({ get el () { return root.value } } satisfies ElementReference<HTMLElement>)

onMounted(() => {
  observeScroll()
  titleObserver.observe()
  syncExpandedHeight()
})
onBeforeUnmount(() => listeners?.abort('App bar scroll listener disposed'))
watch([() => props.scroll, () => props.scrollTarget], observeScroll, { flush: 'post' })
watch([() => props.appearance, hasSubtitle, isCollapsed, title], (_, __, onCleanup) => {
  let active = true
  onCleanup(() => { active = false })
  void nextTick(() => {
    if (!active) return
    titleObserver.unobserve()
    titleObserver.observe()
    syncExpandedHeight()
  })
}, { flush: 'post' })
</script>
