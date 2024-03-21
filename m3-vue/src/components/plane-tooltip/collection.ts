import type { Ref } from 'vue'
import type { Definition, Entry } from './types'

import isEqual from 'lodash.isequal'

const update = (entry: Entry, { content, ...options }: Definition) => {
  if (entry.content !== content) {
    entry.content = content
  }

  if (!isEqual(entry.options, options)) {
    entry.options = options
  }
}

export const useCollection = (collection: Ref<[Element, Entry][]>) => {
  return ({
    has: (el: Element) => collection.value.some(([_el]) => _el === el),
    add: ([el, { content, ...options }]: [Element, Definition]) => {
      collection.value.push([el, { content, options }])

      el.classList.toggle('m3-plane-tooltip-target', true)
      el.classList.toggle('m3-plane-tooltip-target_active', options.shown)
    },
    update: ([el, definition]: [Element, Definition]) => {
      const [, _entry] = collection.value.find(([_el]) => _el === el) ?? []
      if (_entry) {
        update(_entry, definition)
      }
    },
    release: (el: Element) => {
      collection.value = collection.value.filter(([_el]) => _el !== el)

      if (el.classList) {
        el.classList.toggle('m3-plane-tooltip-target', false)
        el.classList.toggle('m3-plane-tooltip-target_active', false)
      }
    },
  })
}