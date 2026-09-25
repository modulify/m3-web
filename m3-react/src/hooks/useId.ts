import { useId as useReactId } from 'react'

export default (id: string | null | undefined, prefix: string): string => {
  const fallback = prefix + '-' + useReactId()

  return id ?? fallback
}
