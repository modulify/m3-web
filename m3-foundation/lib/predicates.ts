import { isArray, isString } from '@modulify/validator/predicates'

export type Predicate<T = unknown> = (value: unknown) => value is T

export const isArrayOf = <T>(predicate: Predicate<T>): Predicate<T[]> => {
  return (value: unknown) => isArray(value) && value.every(predicate)
}

export const isId = (x: unknown): x is string => isString(x) && x.length > 0 && /^[A-Za-z]/.test(x)

export const isElement = (value: unknown): value is Element => value instanceof Element

export const isHTMLElement = (value: unknown): value is HTMLElement => value instanceof HTMLElement

export const isNumeric: Predicate<number | string> = (value: unknown): value is number | string => !isNaN(Number(value))
