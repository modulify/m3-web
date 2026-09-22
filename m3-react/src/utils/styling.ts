export type CssClass = false | null | undefined | string | Record<string, unknown> | CssClass[]

const isCssClassRecord = (value: CssClass): value is Record<string, unknown> => (
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value)
)

const filter = (classes: Record<string, unknown>): string[] => Object.keys(classes).filter(key => classes[key])

export const toClassNameList = (classes: CssClass): string[] => {
  const result: string[] = []

  if (Array.isArray(classes)) {
    classes.forEach(classes => {
      if (typeof classes === 'string') {
        result.push(classes)
      } else if (Array.isArray(classes)) {
        result.push(...toClassNameList(classes))
      } else if (isCssClassRecord(classes)) {
        result.push(...filter(classes))
      }
    })
  } else if (isCssClassRecord(classes)) {
    result.push(...filter(classes))
  } else if (typeof classes === 'string') {
    result.push(classes)
  }

  return result.filter(t => t.length > 0)
}

export const toClassName = (classes: CssClass) => toClassNameList(classes).join(' ')
