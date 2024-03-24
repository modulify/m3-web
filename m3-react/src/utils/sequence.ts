const sequences = new Map<string, number>()

const current = (name: string): number => sequences.get(name) ?? 0

const next = (name: string): number => {
  const value = current(name) + 1

  sequences.set(name, value)

  return value
}

export {
  current,
  next,
}