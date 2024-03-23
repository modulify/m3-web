import type { Appearance } from '~types/components/icon'

import React, { useContext } from 'react'

import { toClassName } from '@/utils/styling'

export interface M3IconProps extends React.HTMLAttributes<HTMLElement> {
  name: string;
  appearance?: Appearance;
}

export const M3IconAppearance = React.createContext<Appearance | null>(null)

const M3Icon: React.FC<M3IconProps> = ({
  name,
  appearance = 'outlined',
  className = '',
  ...attrs
}) => {
  const appearanceInherited: Appearance = useContext(M3IconAppearance)
  const appearanceActual: Appearance = appearanceInherited ?? appearance

  return (
    <span
      className={toClassName([
        className,
        'm3-icon',
        'm3-icon_' + appearanceActual
      ])}
      {...attrs}
    >
      {name}
    </span>
  )
}

export default M3Icon