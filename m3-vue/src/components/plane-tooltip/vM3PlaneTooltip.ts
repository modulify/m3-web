import type { App } from 'vue'
import type { Definition } from './types'
import type { DirectiveHook } from 'vue'
import type { M3PlaneTooltipCollectorMethods } from './M3PlaneTooltipCollector'
import type { ObjectDirective, VNode } from 'vue'

import { createApp } from 'vue'

import M3PlaneTooltipCollector from './M3PlaneTooltipCollector'

let app: App | null = null
let vm: M3PlaneTooltipCollectorMethods | null = null

// getCurrentInstance().appContext.app
const init = () => {
  if (app === null && typeof document !== 'undefined') {
    app = createApp(M3PlaneTooltipCollector)
    vm = app.mount(document.createElement('div')) as unknown as M3PlaneTooltipCollectorMethods
  }
}

const bind: DirectiveHook<Element, VNode|null, Partial<Definition>> = (
  el,
  binding
) => {
  const definition: Definition = {
    content: null,
    disabled: false,
    ...binding.value,
  }

  if (!definition.content || definition.disabled) {
    vm?.release(el)
  } else {
    if (vm?.has(el)) {
      vm?.update([el, definition])
    } else {
      init()
      vm?.add([el, definition])
    }
  }
}

export default {
  beforeMount: bind,
  updated: bind,
  beforeUnmount (el: Element) {
    vm?.release(el)
  },
} as ObjectDirective<Element, Definition>
