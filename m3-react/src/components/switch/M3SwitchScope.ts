import {
  createContext,
  useContext,
} from 'react'

const M3SwitchScope = createContext<{
  checked: boolean;
  disabled: boolean;
}>({
  checked: false,
  disabled: false,
})

export const useM3SwitchScope = () => useContext(M3SwitchScope)

export default M3SwitchScope