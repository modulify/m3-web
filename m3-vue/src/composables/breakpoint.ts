import type {
  Breakpoint,
} from '~types/composables/breakpoint'

import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'

const max = {
  'compact': 600 - 1,
  'medium': 840 - 1,
  'expanded': 1200 - 1,
  'large': 1600 - 1,
  'extra-large': Infinity,
}

class BreakpointValue {
  private readonly _name: Breakpoint

  constructor (name: Breakpoint) {
    this._name = name
  }

  ge (than: Breakpoint) {
    return max[this._name] >= max[than]
  }

  lt (than: Breakpoint) {
    return max[this._name] < max[than]
  }
}

const calculateBreakpoint = (): BreakpointValue => {
  if (window.innerWidth <= max['compact']) return new BreakpointValue('compact')
  if (window.innerWidth <= max['medium']) return new BreakpointValue('medium')
  if (window.innerWidth <= max['expanded']) return new BreakpointValue('expanded')
  if (window.innerWidth <= max['large']) return new BreakpointValue('large')

  return new BreakpointValue('extra-large')
}

export const useBreakpoint = () => {
  const breakpoint = ref<BreakpointValue>(new BreakpointValue('compact'))

  const update = () => breakpoint.value = calculateBreakpoint()

  onMounted(() => {
    update()
    window.addEventListener('resize', update)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', update)
  })

  return computed(() => breakpoint.value)
}