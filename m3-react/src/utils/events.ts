import type { SyntheticEvent } from 'react'

type SyntheticEventHandler<T = Element, E = Event, S extends SyntheticEvent<T, E> = SyntheticEvent<T, E>> = (event: S) => void

export const compose = <T = Element, E = Event, S extends SyntheticEvent<T, E> = SyntheticEvent<T, E>>(
  a: SyntheticEventHandler<T, E, S>,
  b: SyntheticEventHandler<T, E, S>
) => (event: S) => {
  a(event)
  b(event)
}