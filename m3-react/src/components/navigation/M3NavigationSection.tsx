import React from 'react'

import { distribute } from '@/utils/content'
import { toClassName } from '@/utils/styling'

const Header: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  className = '',
  children = [],
  ...attrs
}) => (
  <div className={toClassName(['m3-navigation__section-header', className])} {...attrs}>
    {children}
  </div>
)

const M3NavigationSection: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  role = 'group',
  className = '',
  children,
  ...attrs
}) => {
  const [{ header }, content] = distribute(children, {
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