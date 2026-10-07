import type { ReactNode } from 'react'

import { useMemo } from 'react'

import defineComponent from '@/utils/component'
import { defineSlot, distinct } from '@/utils/content'
import { useM3Adaptive } from '@/hooks'

export type AdaptiveContent = ReactNode | (() => ReactNode)

export interface M3AdaptiveProps {
  children?: ReactNode;
  regular?: AdaptiveContent;
  compact?: AdaptiveContent;
  medium?: AdaptiveContent;
  expanded?: AdaptiveContent;
  large?: AdaptiveContent;
  extraLarge?: AdaptiveContent;
}

const Compact = defineSlot('M3Adaptive.Compact')
const Medium = defineSlot('M3Adaptive.Medium')
const Expanded = defineSlot('M3Adaptive.Expanded')
const Large = defineSlot('M3Adaptive.Large')
const ExtraLarge = defineSlot('M3Adaptive.ExtraLarge')

export default defineComponent(function M3Adaptive({
  children,
  regular,
  compact,
  medium,
  expanded,
  large,
  extraLarge,
}: M3AdaptiveProps) {
  const adaptive = useM3Adaptive()
  const [slots, content] = useMemo(() => distinct(children, {
    compact: Compact,
    medium: Medium,
    expanded: Expanded,
    large: Large,
    extraLarge: ExtraLarge,
  }), [children])

  const selected = adaptive<AdaptiveContent>(content.length > 0 ? content : regular, {
    compact: slots.compact ?? compact,
    medium: slots.medium ?? medium,
    expanded: slots.expanded ?? expanded,
    large: slots.large ?? large,
    'extra-large': slots.extraLarge ?? extraLarge,
  })

  return typeof selected === 'function' ? selected() : selected
}, {
  slots: { Compact, Medium, Expanded, Large, ExtraLarge },
})
