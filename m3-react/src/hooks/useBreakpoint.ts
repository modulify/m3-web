import type { Breakpoint } from '@modulify/m3-foundation'

import {
  useEffect,
  useState,
} from 'react'

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

export default () => {
  const [breakpoint, setBreakpoint] = useState(new BreakpointValue('compact'))
  const update = () => setBreakpoint(calculateBreakpoint())

  useEffect(() => {
    update()
    window.addEventListener('resize', update)

    return () => window.removeEventListener('resize', update)
  }, [])

  return breakpoint
}
