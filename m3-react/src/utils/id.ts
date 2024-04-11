import { next } from './sequence'

export default (name: string): string => name + '-' + next(name)
