type CSSClass = string
type CSSClassRecord = Record<CSSClass, boolean>
type CSSClassDeclaration = (CSSClass | CSSClassRecord)[]|CSSClassRecord

const filter = (classes: CSSClassRecord): CSSClass[] => Object.keys(classes).filter(k => classes[k])

export const toClassNameList = (classes: CSSClassDeclaration): CSSClass[] => {
  const result: string[] = []

  if (Array.isArray(classes)) {
    classes.forEach(classes => {
      if (typeof classes === 'string') {
        result.push(classes)
      } else {
        result.push(...filter(classes))
      }
    })
  } else {
    result.push(...filter(classes))
  }

  return result.filter(t => t.length > 0)
}

export const toClassName = (classes: CSSClassDeclaration) => toClassNameList(classes).join(' ')