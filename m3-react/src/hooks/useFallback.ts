import { useMemo } from 'react'

export default <T>(value: T, fallback: () => T) => useMemo(() => value ?? fallback(), [value])
