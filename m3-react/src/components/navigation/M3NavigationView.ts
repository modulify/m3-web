import type { NavigationView } from '@modulify/m3-foundation/types/components/navigation'

import { createContext, useContext } from 'react'

const M3NavigationView = createContext<NavigationView | null>(null)

export const useM3NavigationView = () => useContext(M3NavigationView)

export default M3NavigationView
