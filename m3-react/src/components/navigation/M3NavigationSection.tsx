import type {
  FC,
  HTMLAttributes,
} from 'react'

import { distinct } from '@/utils/content'
import { toClassName } from '@/utils/styling'

const Header: FC<HTMLAttributes<HTMLElement>> = ({
  className = '',
  children = [],
  ...attrs
}) => (
  <div className={toClassName(['m3-navigation__section-header', className])} {...attrs}>
    {children}
  </div>
)

const M3NavigationSection: FC<HTMLAttributes<HTMLElement>> = ({
  role = 'group',
  className = '',
  children,
  ...attrs
}) => {
  const [{ header }, content] = distinct(children, {
    header: Header,
  })

  return (
    <section
      role={role}
      className={toClassName(['m3-navigation__section', className])}
      {...attrs}
    >
      {header}
      {content}
    </section>
  )
}

export default Object.assign(M3NavigationSection, {
  Header,
})