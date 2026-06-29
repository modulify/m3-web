import makeId from '@/utils/id'
import { useMemo } from 'react'

export default (id: string | null | undefined, prefix: string): string => useMemo(() => id ?? makeId(prefix), [id, prefix])
