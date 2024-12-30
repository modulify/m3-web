import type { Predicate } from '@modulify/validator/types'

import {
  isArray,
  isString,
} from '@modulify/validator/predicates'

export type { Predicate }

export {
  isArray,
  isNull,
  isString,
  isUndefined,
  Or,
} from '@modulify/validator/predicates'

export const isArrayOf = <T>(predicate: Predicate<T>): Predicate<T[]> => {
  return (value: unknown) => isArray(value) && value.every(predicate)
}

export const isId = (x: unknown): x is string => isString(x) && x.length > 0 && /^[A-Za-z]/.test(x)

export const isElement = (value: unknown) => value instanceof Element

export const isHTMLElement = (value: unknown) => value instanceof HTMLElement

export const isNumeric: Predicate<number | string> = (value: unknown): value is number | string => !isNaN(Number(value))

export type Shape<T extends object> = {
  [K in keyof T]: [Predicate<T[K]>, boolean] | Predicate<T[K]>
}

export type IsRequired<T extends Shape<object>, K extends keyof T> =
  T[K] extends [unknown, infer R extends boolean]
    ? R
    : false

type ShapeRequired<S extends Shape<object>> = {
  [K in keyof S as IsRequired<S, K> extends true ? K : never]: S[K]
}

type ShapeOptional<S extends Shape<object>> = {
  [K in keyof S as IsRequired<S, K> extends false ? K : never]: S[K]
}

type ExtractType<S> = S extends Shape<infer T> ? T : never

export type ExtractRequired<S extends Shape<object>> = ExtractType<ShapeRequired<S>>
export type ExtractOptional<S extends Shape<object>> = Partial<ExtractType<ShapeOptional<S>>>

type TypeOf<S extends Shape<object>> = ExtractRequired<S> & ExtractOptional<S>

export const isShape = <S extends Shape<object>>(shape: S) => {
  const properties = Object.keys(shape)

  return (value: unknown): value is TypeOf<S> => typeof value === 'object' && value !== null && properties.every(p => {
    const config = shape[p]
    const [predicate, required] = isArray(config) ? config : [config, false]
    if (!(p in value)) {
      return !required
    }

    return predicate(value[p])
  })
}
