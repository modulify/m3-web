import type { ContentToRender } from '~types/render'
import type { PopperOptions } from '@modulify/m3-foundation/types/components/popper'

export type Definition = PopperOptions & {
  content: ContentToRender | null;
  class?: unknown;
  style?: unknown;
}

export type Entry = {
  content: ContentToRender | null;
  options: Omit<Definition, 'content'>;
}