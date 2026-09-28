import type { h as CreateElement, VNode } from 'vue'

import { h } from 'vue'

import arraify from '@/utils/arraify'

export type Content = string | VNode
export type ContentConstructor = (h: typeof CreateElement) => Content | Content[]
export type ContentToRender = Content | ContentConstructor

export default (content: ContentToRender) => arraify(
  typeof content === 'function'
    ? content(h)
    : content
)
