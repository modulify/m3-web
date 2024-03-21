import type { ContentToRender } from '~types/render'

import arraify from '@/utils/arraify'
import { h } from 'vue'

export default (content: ContentToRender) => arraify(
  typeof content === 'function'
    ? content(h)
    : content
)