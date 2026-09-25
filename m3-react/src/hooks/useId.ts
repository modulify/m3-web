import { useMemo } from 'react'

import makeId from '@/utils/id'

export default (id: string | null | undefined, prefix: string): string => useMemo(() => id ?? makeId(prefix), [id, prefix])
