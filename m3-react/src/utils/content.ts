import type {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
} from 'react'

import {
  Children,
  cloneElement,
  isValidElement,
} from 'react'

const inlines = ['b', 'i', 'span', 'strong']

export const isNil = (value: unknown): boolean => value === null || value === undefined
export const isTextual = (node: ReactNode): boolean => {
  return isValidElement(node) && inlines.includes((node as ReactElement).type as string)
    || typeof node === 'number'
    || typeof node === 'string'
}
export const isEmptyArray = (v: ReactNode) => Children.toArray(v).length === 0
export const isEmptyString = (v: ReactNode) => typeof v === 'string' && (v === '' || !/\S/.test(v))
export const isEmptyNode = (node: ReactNode) => {
  return isNil(node)
    || isEmptyString(node)
    || isEmptyArray(node)
}

export const normalize = (children: ReactNode): [ReactNode, boolean][] => {
  const normalized: [ReactNode, boolean][] = []

  Children.forEach(Children.toArray(children), child => {
    if (!isEmptyNode(child)) {
      normalized.push([child, !isTextual(child)])
    }
  })

  return normalized
}

export const augment = <
  Props = Record<string, unknown>,
  Type extends string | JSXElementConstructor<unknown> = string | JSXElementConstructor<unknown>,
>(el: ReactElement<Props, Type>, props: Props) => cloneElement(el, { ...props })

export const distinct = <
  Name extends string,
  Type extends string | JSXElementConstructor<unknown> = string | JSXElementConstructor<unknown>
>(children: ReactNode, map: Record<Name, Type>): [
  Record<Name, ReactElement | null>,
  ReactNode[],
  (name: Name) => boolean
] => {
  const names = Object.keys(map) as Name[]
  const named = names.reduce((named, name) => {
    return { ...named, [name]: null }
  }, {} as Record<Name, ReactElement | null>)

  const content: ReactNode[] = []

  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      const name = names.find(n => child.type === map[n])
      if (name) {
        named[name] = child
      } else {
        content.push(child)
      }
    } else {
      content.push(child)
    }
  })

  return [named, content, (name: Name) => !!named[name]]
}