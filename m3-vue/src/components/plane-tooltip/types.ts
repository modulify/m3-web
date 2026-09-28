import type { PopperOptions } from '@modulify/m3-foundation/types/components/popper'

import type { ContentToRender } from '@/utils/render'

export type Definition = PopperOptions & {
  content: ContentToRender | null;
  class?: unknown;
  style?: unknown;
}

export type Entry = {
  content: ContentToRender | null;
  options: Omit<Definition, 'content'>;
}
