import type { CarouselController } from '@modulify/m3-foundation/lib/carousel'
import type {
  CarouselScroll,
  CarouselVariant,
} from '@modulify/m3-foundation/types/components/carousel'
import type { ComponentSetupContext } from '@/utils/component'
import type { CSSProperties } from 'react'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { HTMLAttributes, ReactNode, Ref } from 'react'

import type { M3CarouselItemProps } from './M3CarouselItem'

import {
  Children,
  isValidElement,
  useLayoutEffect,
  useRef,
} from 'react'

import { attachCarousel } from '@modulify/m3-foundation/lib/carousel'

import defineComponent from '@/utils/component'
import { toClassName } from '@/utils/styling'

import CarouselSlide from './CarouselSlide'
import { M3CarouselItem } from './M3CarouselItem'

export interface M3CarouselProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  ref?: Ref<M3CarouselExposed>;
  variant?: CarouselVariant;
  scroll?: CarouselScroll;
  preferred?: number;
  height?: number | string;
  index?: number;
  positionLabel?: (position: number, total: number) => string;
  onChange?: (index: number) => void;
  children?: ReactNode;
}

export interface M3CarouselExposed extends ElementReference<HTMLDivElement> {
  goTo(index: number, smooth?: boolean): void;
}

export default defineComponent(function M3Carousel({
  ref: _ref,
  variant = 'multi-browse',
  scroll,
  preferred = 280,
  height,
  index,
  positionLabel = (position, total) => `${position} of ${total}`,
  onChange,
  children,
  className = '',
  style,
  ...attrs
}: M3CarouselProps, { expose }: ComponentSetupContext<M3CarouselExposed>) {
  const root = useRef<HTMLDivElement | null>(null)
  const controller = useRef<CarouselController | null>(null)
  const items = Children.toArray(children).filter(
    (child): child is React.ReactElement<M3CarouselItemProps> =>
      isValidElement(child) && child.type === M3CarouselItem
  )
  const mode = scroll ?? (variant.startsWith('uncontained') ? 'auto' : 'snap')

  expose({
    get el () { return root.current },
    goTo: (next, smooth) => controller.current?.goTo(next, smooth),
  })

  useLayoutEffect(() => {
    if (!root.current) return

    const active = attachCarousel(root.current, { variant, scroll: mode, preferred, onChange })
    controller.current = active

    return () => {
      active.dispose()
      if (controller.current === active) controller.current = null
    }
  }, [])

  useLayoutEffect(() => controller.current?.update({ variant, scroll: mode, preferred, onChange }))
  useLayoutEffect(() => {
    if (index !== undefined) controller.current?.goTo(index, false)
  }, [index])

  const rootStyle: CSSProperties = { ...style, ...(height !== undefined ? { height } : {}) }

  return <div
    ref={root}
    className={toClassName(['m3-carousel', `m3-carousel_${variant}`, className])}
    style={rootStyle}
    role="region"
    aria-roledescription="carousel"
    aria-label="Carousel"
    {...attrs}
  >
    <div className="m3-carousel__scroll">
      <div className="m3-carousel__track">
        <div className="m3-carousel__stage">
          {items.map((item, itemIndex) => {
            const { 'aria-label': itemLabel, ...itemAttrs } = item.props
            const position = positionLabel(itemIndex + 1, items.length)
            const label = itemLabel ? `${itemLabel}, ${position}` : position

            return <CarouselSlide
              key={item.key ?? itemIndex}
              aria-label={label}
              {...itemAttrs}
            />
          })}
        </div>
      </div>
    </div>
  </div>
})
