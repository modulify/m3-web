import type { Appearance } from '@modulify/m3-foundation/types/components/icon'
import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { HTMLAttributes, Ref } from 'react'

import { createContext, useContext, useRef } from 'react'

import defineComponent from '@/utils/component'
import { toClassName } from '@/utils/styling'
import { useElementReference } from '@/hooks'

export interface M3IconProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<M3IconExposed>;
  name: string;
  appearance?: Appearance;
}

export interface M3IconExposed extends ElementReference<HTMLSpanElement> {}

export const M3IconAppearance = createContext<Appearance | null>(null)

export default defineComponent(function M3Icon({
  ref: _ref,
  name,
  appearance = 'outlined',
  className = '',
  ...attrs
}: M3IconProps, { expose }: ComponentSetupContext<M3IconExposed>) {
  const root = useRef<HTMLSpanElement | null>(null)
  expose(useElementReference(root))
  const appearanceInherited = useContext(M3IconAppearance)
  const appearanceActual: Appearance = appearanceInherited ?? appearance

  return (
    <span
      ref={root}
      className={toClassName([
        className,
        'm3-icon',
        'm3-icon_' + appearanceActual,
      ])}
      {...attrs}
    >
      {name}
    </span>
  )
})
