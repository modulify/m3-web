import type { SyntheticEvent } from 'react'

type SyntheticEventHandler<T = Element, E = Event, S extends SyntheticEvent<T, E> = SyntheticEvent<T, E>> = (event: S) => void

export const compose = <T = Element, E = Event, S extends SyntheticEvent<T, E> = SyntheticEvent<T, E>>(
  ...handlers: SyntheticEventHandler<T, E, S>[]
) => {
  return (event: S) => handlers.forEach(handle => handle(event))
}