import type { ReactNode } from 'react'

import React, { isValidElement } from 'react'

const inlines = ['b', 'i', 'span', 'strong']

const isTextual = (node: ReactNode): boolean => {
  return isValidElement(node) && inlines.includes((node as React.ReactElement).type as string)
    || typeof node === 'number'
    || typeof node === 'string'
}
const isEmptyArray = (v: ReactNode) => React.Children.toArray(v).length === 0
const isEmptyString = (v: ReactNode) => typeof v === 'string' && (v === '' || !/\S/.test(v));
const isEmpty = (children: ReactNode) => {
  return children === null
    || isEmptyString(children)
    || isEmptyArray(children)
}

export const normalize = (children: ReactNode): [ReactNode, boolean][] => {
  const normalized: [ReactNode, boolean][] = []

  React.Children.forEach(React.Children.toArray(children), child => {
    if (!isEmpty(child)) {
      normalized.push([child, !isTextual(child)])
    }
  })

  return normalized
}