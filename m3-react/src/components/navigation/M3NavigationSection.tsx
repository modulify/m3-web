import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { FC, HTMLAttributes, Ref } from 'react'

import { useRef } from 'react'

import defineComponent from '@/utils/component'
import { defineSlot, distinct } from '@/utils/content'
import { toClassName } from '@/utils/styling'
import { useElementReference } from '@/hooks'

export interface M3NavigationSectionProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<M3NavigationSectionExposed>;
}

export interface M3NavigationSectionExposed extends ElementReference<HTMLElement> {}

const Header: FC<HTMLAttributes<HTMLElement>> = defineSlot('M3NavigationSection.Header', ({
  className = '',
  children = [],
  ...attrs
}) => (
  <div className={toClassName(['m3-navigation__section-header', className])} {...attrs}>
    {children}
  </div>
))

export default defineComponent(function M3NavigationSection({
  ref: _ref,
  role = 'group',
  className = '',
  children,
  ...attrs
}: M3NavigationSectionProps, { expose }: ComponentSetupContext<M3NavigationSectionExposed>) {
  const root = useRef<HTMLElement | null>(null)
  expose(useElementReference(root))
  const [{ header }, content] = distinct(children, {
    header: Header,
  })

  return (
    <section
      ref={root}
      role={role}
      className={toClassName(['m3-navigation__section', className])}
      {...attrs}
    >
      {header}
      {content}
    </section>
  )
}, {
  slots: { Header },
})
