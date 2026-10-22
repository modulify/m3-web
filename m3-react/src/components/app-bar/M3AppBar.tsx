import type {
  AppBarAlignment,
  AppBarAppearance,
  AppBarScroll,
  AppBarScrollState,
} from '@modulify/m3-foundation/types/components/app-bar'
import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { HTMLAttributes, ReactNode, Ref } from 'react'

import {
  getAppBarScrollState,
  getFlexibleAppBarHeight,
} from '@modulify/m3-foundation/lib/appBar'
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import defineComponent from '@/utils/component'
import { defineSlot, distinct } from '@/utils/content'
import { toClassName } from '@/utils/styling'
import { useElementReference, useResizeObserver } from '@/hooks'

export interface M3AppBarProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<M3AppBarExposed>;
  appearance?: AppBarAppearance;
  alignment?: AppBarAlignment;
  scroll?: AppBarScroll;
  scrollTarget?: HTMLElement | Window | null;
  headline?: ReactNode;
  subtitle?: ReactNode;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  tag?: 'header' | 'div';
}

export interface M3AppBarExposed extends ElementReference {}

const Leading = defineSlot('M3AppBar.Leading')
const Headline = defineSlot('M3AppBar.Headline')
const Image = defineSlot('M3AppBar.Image')
const Subtitle = defineSlot('M3AppBar.Subtitle')
const Trailing = defineSlot('M3AppBar.Trailing')
const Search = defineSlot('M3AppBar.Search')

const EMPTY_SCROLL_STATE: AppBarScrollState = { under: false, hidden: false, collapsed: false }

export default defineComponent(function M3AppBar({
  ref: _ref,
  appearance = 'small',
  alignment = 'start',
  scroll = 'pinned',
  scrollTarget,
  headline,
  subtitle,
  headingLevel = 1,
  tag: Tag = 'header',
  className = '',
  children = [],
  ...attrs
}: M3AppBarProps, { expose }: ComponentSetupContext<M3AppBarExposed>) {
  const root = useRef<HTMLElement | null>(null)
  const title = useRef<HTMLDivElement | null>(null)
  const [scrollState, setScrollState] = useState(EMPTY_SCROLL_STATE)
  const [slots, content] = useMemo(() => distinct(children, {
    leading: Leading,
    headline: Headline,
    image: Image,
    subtitle: Subtitle,
    trailing: Trailing,
    search: Search,
  }), [children])

  expose(useElementReference(root))

  useEffect(() => {
    const target = scrollTarget ?? window
    const position = () => target === window ? window.scrollY : (target as HTMLElement).scrollTop
    const controller = new AbortController()
    let previous = position()

    const update = () => {
      const current = position()
      setScrollState(state => {
        const next = getAppBarScrollState(previous, current, state.hidden, scroll)
        return state.under === next.under && state.hidden === next.hidden && state.collapsed === next.collapsed
          ? state
          : next
      })
      previous = current
    }

    update()
    target.addEventListener('scroll', update, { passive: true, signal: controller.signal })
    return () => controller.abort('App bar scroll listener disposed')
  }, [scroll, scrollTarget])

  const isFlexible = appearance === 'medium-flexible' || appearance === 'large-flexible'
  const isCollapsed = isFlexible && scrollState.collapsed
  const heading = slots.headline ?? headline ?? content
  const supporting = slots.subtitle ?? subtitle
  const hasSubtitle = appearance !== 'search' && appearance !== 'medium' && appearance !== 'large'
    && supporting !== undefined && supporting !== null
  const HeadingTag = `h${headingLevel}` as const

  const syncExpandedHeight = () => {
    if (!isFlexible || isCollapsed || !root.current || !title.current) return
    const height = getFlexibleAppBarHeight(appearance, hasSubtitle, title.current.scrollHeight)
    root.current.style.setProperty('--m3-app-bar-measured-height', `${height}px`)
  }

  useResizeObserver(title, syncExpandedHeight)
  useLayoutEffect(syncExpandedHeight, [appearance, hasSubtitle, isCollapsed])

  return (
    <Tag
      ref={element => { root.current = element }}
      className={toClassName([className, {
        'm3-app-bar': true,
        [`m3-app-bar_${appearance}`]: true,
        [`m3-app-bar_${alignment}`]: true,
        'm3-app-bar_has-subtitle': hasSubtitle,
        'm3-app-bar_under': scrollState.under,
        'm3-app-bar_hidden': scrollState.hidden,
        'm3-app-bar_collapsed': isCollapsed,
        'm3-app-bar_transparent': scroll === 'transparent',
      }])}
      {...attrs}
    >
      {slots.leading && <div className="m3-app-bar__leading">{slots.leading}</div>}
      {appearance === 'search'
        ? <div className="m3-app-bar__search">{slots.search ?? content}</div>
        : <div ref={title} className="m3-app-bar__title">
          {isFlexible && !isCollapsed && slots.image && <div className="m3-app-bar__image">{slots.image}</div>}
          {heading != null && <HeadingTag className="m3-app-bar__headline">{heading}</HeadingTag>}
          {hasSubtitle && <div className="m3-app-bar__subtitle">{supporting}</div>}
        </div>}
      {slots.trailing && <div className="m3-app-bar__trailing">{slots.trailing}</div>}
    </Tag>
  )
}, {
  slots: { Leading, Headline, Image, Subtitle, Trailing, Search },
})
