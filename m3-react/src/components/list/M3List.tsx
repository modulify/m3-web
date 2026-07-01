import type {
  FC,
  HTMLAttributes,
} from 'react'

import { toClassName } from '@/utils/styling'

export interface M3ListProps extends HTMLAttributes<HTMLUListElement> {
  divided?: boolean;
}

const M3List: FC<M3ListProps> = ({
  divided = false,
  className = '',
  children = [],
  ...attrs
}) => (
  <ul
    className={toClassName([className, {
      'm3-list': true,
      'm3-list_divided': divided,
    }])}
    {...attrs}
  >
    {children}
  </ul>
)

export default M3List
