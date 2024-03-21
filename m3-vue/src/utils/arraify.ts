type A<T> = T extends unknown[] ? T : T[]

export default <T> (value: T): A<T> => Array.isArray(value)
  ? [...value] as A<T>
  : [value] as A<T>