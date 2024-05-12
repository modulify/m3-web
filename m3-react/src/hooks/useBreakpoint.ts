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

type Subscriber = (value: BreakpointValue) => void

const subscribers = new Set<Subscriber>()
const subscribe = (subscriber: Subscriber): () => void => {
  if (!subscribers.has(subscriber)) {
    subscribers.add(subscriber)
  }

  return () => { subscribers.delete(subscriber) }
}

let _breakpoint = new BreakpointValue('compact')

if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    _breakpoint = calculateBreakpoint()
    subscribers.forEach(s => s(_breakpoint))
  })
}

export default () => {
  const [breakpoint, setBreakpoint] = useState(_breakpoint)

  useEffect(() => subscribe(setBreakpoint), [])

  return breakpoint
}
