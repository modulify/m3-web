import type { HTMLAttributes, ReactNode } from 'react'

export interface M3CarouselItemProps extends HTMLAttributes<HTMLDivElement> {
  aspect?: number;
  interactive?: boolean;
  disabled?: boolean;
  media?: ReactNode;
  children?: ReactNode;
}

// M3Carousel reads this descriptor and places its content in the scrolling stage.
export const M3CarouselItem = (_props: M3CarouselItemProps): null => null
