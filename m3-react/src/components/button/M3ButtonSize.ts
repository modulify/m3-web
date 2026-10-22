import type { Size } from '@modulify/m3-foundation/types/components/button'

import { createContext, useContext } from 'react'

export const M3ButtonSize = createContext<Size | null>(null)

export const useM3ButtonSize = () => useContext(M3ButtonSize)
