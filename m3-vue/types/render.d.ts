import type { VNode } from 'vue'

import { h as CreateElement } from 'vue'

export type Content = string | VNode
export type ContentConstructor = (h: typeof CreateElement) => Content | Content[]
export type ContentToRender = Content | ContentConstructor