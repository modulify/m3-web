import type { VNode } from 'vue'

import { Comment, Text } from 'vue'

export const SHAPE_FLAG_ARRAY_CHILDREN = 16
export const SHAPE_FLAG_TEXT = 8

const inlines = ['b', 'i', 'span', 'strong']

export const is = (node: VNode, type: string | symbol) => String(node.type) === type || node.type === type
export const isTextual = (node: VNode) => [
  ...inlines,
  'Symbol(Text)',
  'Symbol()',
  Text,
].some(t => is(node, t)) || node.shapeFlag === SHAPE_FLAG_TEXT

export const isEmptyArray = (v: unknown) => Array.isArray(v) && v.length === 0
export const isEmptyString = (v: unknown) => typeof v === 'string' && (v === '' || !/\S/.test(v))
export const isEmpty = (node: VNode) => {
  const children = node.children

  return children === null
    || isEmptyString(children)
    || isEmptyArray(children)
}

export const normalize = (content: VNode[]): [VNode, boolean][] => {
  const normalized: [VNode, boolean][] = []
  content.forEach(node => {
    if (node.shapeFlag === SHAPE_FLAG_ARRAY_CHILDREN) {
      return normalized.push(...normalize(node.children as VNode[]))
    }

    if (!(is(node, Comment) || is(node, Text) && isEmpty(node))) {
      normalized.push([node, !isTextual(node)])
    }
  })

  return normalized
}