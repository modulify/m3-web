import type {
  FC,
  HTMLAttributes,
} from 'react'

import { toClassName } from '@/utils/styling'

export interface M3TextFieldSupportTextProps extends HTMLAttributes<HTMLElement> {
  text?: string;
  danger?: boolean;
  muted?: boolean;
}

const M3TextFieldSupportText: FC<M3TextFieldSupportTextProps> = ({
  text = '',
  danger = false,
  muted = false,
  className = '',
  children = null,
  ...attrs
}) => (
  <div
    className={toClassName([className, {
      'm3-text-field-support-text': true,
      'm3-text-field-support-text_danger': danger,
      'm3-text-field-support-text_muted': muted,
    }])}
    {...attrs}
  >
    {children ?? text}
  </div>
)

export default M3TextFieldSupportText
