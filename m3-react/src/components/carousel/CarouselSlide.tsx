import type { M3CarouselItemProps } from './M3CarouselItem'

import { useRef } from 'react'

import { M3Ripple } from '@/components/ripple'
import { toClassName } from '@/utils/styling'
import { useElementEffect, useTarget } from '@/hooks'

export default function CarouselSlide ({
  'aria-label': label,
  aspect = 1,
  interactive = false,
  disabled = false,
  media,
  children,
  className,
  onClick,
  ...attrs
}: M3CarouselItemProps) {
  const root = useRef<HTMLDivElement | null>(null)
  const [owner, setOwner] = useTarget<HTMLDivElement>()
  useElementEffect(root, setOwner)

  const attributes = {
    ...attrs,
    role: interactive ? 'button' : 'group',
    'aria-roledescription': interactive ? undefined : 'slide',
    'aria-disabled': disabled || undefined,
    tabIndex: disabled ? -1 : 0,
    'data-aspect': aspect,
  }

  return <div
    ref={root}
    className={toClassName([{
      'm3-carousel__item': true,
      'm3-carousel__item_interactive': interactive,
      'm3-carousel__item_disabled': disabled,
    }, className])}
    aria-label={label}
    {...attributes}
    onClick={disabled ? undefined : onClick}
  >
    {media !== undefined && <div className="m3-carousel__media">{media}</div>}
    {interactive && !disabled && <div className="m3-carousel__state">
      <M3Ripple owner={owner} />
    </div>}
    <div className="m3-carousel__content">{children}</div>
  </div>
}
