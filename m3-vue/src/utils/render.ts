import type { ContentToRender } from '~types/render'

import { h } from 'vue'

import arraify from '@/utils/arraify'

export default (content: ContentToRender) => arraify(
  typeof content === 'function'
    ? content(h)
    : content
)