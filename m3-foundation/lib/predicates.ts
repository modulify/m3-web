export type Predicate = (value: unknown) => boolean

export const arrayOf = (predicate: Predicate) => {
  return (value: unknown) => isArray(value) && value.every(predicate)
}

export const isArray = Array.isArray

export const isElement = (value: unknown) => value instanceof Element

export const isExactly = <T>(subject: T) => (value: unknown) => value === subject

export const isHTMLElement = (value: unknown) => value instanceof HTMLElement

export const isNull = (value: unknown) => value === null
export const isNumeric = (value: unknown) => !isNaN(Number(value))

export const isShape = (shape: Record<string, [Predicate, boolean] | Predicate>) => {
  const properties = Object.keys(shape)

  return (value: unknown) => typeof value === 'object' && value !== null && properties.every(p => {
    const config = shape[p]
    const [predicate, required] = isArray(config) ? config : [config, false]
    if (!(p in value)) {
      return !required
    }

    return predicate(value[p])
  })
}

export const isString = (value: unknown) => typeof value === 'string'

export const oneOf = (...predicates: Predicate[]): Predicate => {
  return (value: unknown) => predicates.some(p => p(value))
}
