import type { Appearance } from '@modulify/m3-foundation/types/components/navigation'

import {
  createContext,
  useContext,
} from 'react'

const M3NavigationAppearance = createContext<Appearance>('auto')

export const useM3NavigationAppearance = () => useContext(M3NavigationAppearance)

export default M3NavigationAppearance