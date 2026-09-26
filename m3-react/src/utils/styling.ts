import { isRecord } from '@modulify/validator/predicates'

export type CssClass = false | null | undefined | string | Record<string, unknown> | CssClass[]

const filter = (classes: Record<string, unknown>): string[] => Object.keys(classes).filter(key => classes[key])

export const toClassNameList = (classes: CssClass): string[] => {
  const result: string[] = []

  if (Array.isArray(classes)) {
    classes.forEach(classes => {
      if (typeof classes === 'string') {
        result.push(classes)
      } else if (Array.isArray(classes)) {
        result.push(...toClassNameList(classes))
      } else if (isRecord(classes)) {
        result.push(...filter(classes))
      }
    })
  } else if (isRecord(classes)) {
    result.push(...filter(classes))
  } else if (typeof classes === 'string') {
    result.push(classes)
  }

  return result.filter(t => t.length > 0)
}

export const toClassName = (classes: CssClass) => toClassNameList(classes).join(' ')
