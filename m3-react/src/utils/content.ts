import type {
  ComponentProps,
  FC,
  JSX,
  ReactElement,
  ReactNode,
} from 'react'

import {
  Children,
  cloneElement,
  createElement,
  Fragment,
  isValidElement,
} from 'react'

const inlines = ['b', 'i', 'span', 'strong']
const CONFIG_KEYS = [
  'collections',
  'flattenFragments',
  'onDuplicateSlot',
  'slots',
]
const SLOT_ID = Symbol.for('@modulify/m3-react.slot')

type DuplicateSlotPolicy = 'error' | 'ignore' | 'warn'
type AnyComponent = Exclude<ReactElement['type'], string>
type SlotComponent = keyof JSX.IntrinsicElements | AnyComponent
type SlotComponents = Record<string, SlotComponent>
type SlotElements<Components extends SlotComponents> = {
  [Name in keyof Components]: ReactElement<ComponentProps<Components[Name]>, Components[Name]> | null;
}
type SlotElementCollections<Components extends SlotComponents> = {
  [Name in keyof Components]: Array<ReactElement<ComponentProps<Components[Name]>, Components[Name]>>;
}
type SlottedComponent = AnyComponent & {
  [SLOT_ID]?: string;
}
type DefaultSlotProps = {
  children: ReactNode;
}

export type DistinctConfig<
  Slots extends SlotComponents = Record<never, never>,
  Collections extends SlotComponents = Record<never, never>,
> = {
  slots?: Slots;
  collections?: Collections;
  flattenFragments?: boolean;
  onDuplicateSlot?: DuplicateSlotPolicy;
}

export type DistinctResult<
  Slots extends SlotComponents = Record<never, never>,
  Collections extends SlotComponents = Record<never, never>,
> = {
  slots: SlotElements<Slots>;
  collections: SlotElementCollections<Collections>;
  content: ReactNode[];
  hasSlot: (name: Extract<keyof Slots, string>) => boolean;
  hasCollection: (name: Extract<keyof Collections, string>) => boolean;
}

export const isNil = (value: unknown): boolean => value === null || value === undefined
export const isTextual = (node: ReactNode): boolean => {
  return isValidElement(node) && inlines.includes((node as ReactElement).type as string)
    || typeof node === 'number'
    || typeof node === 'string'
}
export const isEmptyArray = (v: ReactNode) => Children.toArray(v).length === 0
export const isEmptyString = (v: ReactNode) => typeof v === 'string' && (v === '' || !/\S/.test(v))
export const isEmptyNode = (node: ReactNode) => {
  return isNil(node)
    || typeof node === 'boolean'
    || isEmptyString(node)
    || isEmptyArray(node)
}

export const normalize = (children: ReactNode): [ReactNode, boolean][] => {
  const normalized: [ReactNode, boolean][] = []

  Children.forEach(Children.toArray(children), child => {
    if (!isEmptyNode(child)) {
      normalized.push([child, !isTextual(child)])
    }
  })

  return normalized
}

export const augment = <
  Props = Record<string, unknown>,
  Type extends string | AnyComponent = string | AnyComponent,
>(el: ReactElement<Props, Type>, props: Props) => cloneElement(el, { ...props } as Partial<Props>)

const createDefaultSlot = (): FC<DefaultSlotProps> => {
  const DefaultSlot: FC<DefaultSlotProps> = props => createElement(Fragment, null, props.children)

  return DefaultSlot
}

export function defineSlot(id: string): FC<DefaultSlotProps>
export function defineSlot<Component extends AnyComponent>(id: string, component: Component): Component
export function defineSlot(
  id: string,
  component?: AnyComponent
): AnyComponent {
  const slot = component ?? createDefaultSlot()

  Object.defineProperty(slot, SLOT_ID, {
    configurable: true,
    value: id,
  })

  return slot
}

const getSlotId = (component: unknown): string | null => {
  if (typeof component !== 'function') {
    return null
  }

  return (component as SlottedComponent)[SLOT_ID] ?? null
}

const isSameSlotComponent = (actual: unknown, expected: SlotComponent): boolean => {
  if (actual === expected) {
    return true
  }

  const actualSlotId = getSlotId(actual)
  const expectedSlotId = getSlotId(expected)

  return actualSlotId !== null && actualSlotId === expectedSlotId
}

const createRecord = <Name extends string, Value>(names: Name[], value: () => Value): Record<Name, Value> => {
  return names.reduce((record, name) => ({
    ...record,
    [name]: value(),
  }), {} as Record<Name, Value>)
}

const isConfig = (value: Record<string, unknown>): boolean => {
  return CONFIG_KEYS.some(key => key in value)
}

const shouldWarn = (): boolean => {
  return import.meta.env.DEV
}

const handleDuplicateSlot = (name: string, policy: DuplicateSlotPolicy) => {
  if (policy === 'error') {
    throw new Error(`Duplicate slot "${name}" was provided.`)
  }

  if (policy === 'warn' && shouldWarn()) {
    console.warn(`Duplicate slot "${name}" was provided. The last slot will be used.`)
  }
}

const flattenChildren = (children: ReactNode, flattenFragments: boolean): ReactNode[] => {
  const flattened: ReactNode[] = []

  Children.forEach(children, child => {
    if (isEmptyNode(child)) {
      return
    }

    if (flattenFragments && isValidElement(child) && child.type === Fragment) {
      flattened.push(...flattenChildren((child.props as { children?: ReactNode }).children, flattenFragments))
      return
    }

    flattened.push(child)
  })

  return flattened
}

const parseDistinct = <
  Slots extends SlotComponents = Record<never, never>,
  Collections extends SlotComponents = Record<never, never>,
>(children: ReactNode, config: DistinctConfig<Slots, Collections>): DistinctResult<Slots, Collections> => {
  type SlotName = Extract<keyof Slots, string>
  type CollectionName = Extract<keyof Collections, string>

  const slots = config.slots ?? {} as Slots
  const collections = config.collections ?? {} as Collections
  const slotNames = Object.keys(slots) as SlotName[]
  const collectionNames = Object.keys(collections) as CollectionName[]
  const namedSlots = createRecord(slotNames, () => null as ReactElement | null)
  const namedCollections = createRecord(collectionNames, () => [] as ReactElement[])
  const content: ReactNode[] = []
  const flattenFragments = config.flattenFragments ?? true
  const onDuplicateSlot = config.onDuplicateSlot ?? 'warn'

  flattenChildren(children, flattenFragments).forEach(child => {
    if (isValidElement(child)) {
      const slotName = slotNames.find(name => isSameSlotComponent(child.type, slots[name]))

      if (slotName) {
        if (namedSlots[slotName]) {
          handleDuplicateSlot(slotName, onDuplicateSlot)
        }

        namedSlots[slotName] = child
        return
      }

      const collectionName = collectionNames.find(name => isSameSlotComponent(child.type, collections[name]))

      if (collectionName) {
        namedCollections[collectionName].push(child)
        return
      }
    }

    content.push(child)
  })

  return {
    slots: namedSlots,
    collections: namedCollections,
    content,
    hasSlot: name => !!namedSlots[name],
    hasCollection: name => namedCollections[name].length > 0,
  } as DistinctResult<Slots, Collections>
}

export function distinct<
  Components extends SlotComponents,
>(children: ReactNode, map: Components): [
  SlotElements<Components>,
  ReactNode[],
  (name: Extract<keyof Components, string>) => boolean
]
export function distinct<
  Slots extends SlotComponents = Record<never, never>,
  Collections extends SlotComponents = Record<never, never>,
>(children: ReactNode, config: DistinctConfig<Slots, Collections>): DistinctResult<Slots, Collections>
export function distinct<
  Slots extends SlotComponents = Record<never, never>,
  Collections extends SlotComponents = Record<never, never>,
>(
  children: ReactNode,
  configOrMap: DistinctConfig<Slots, Collections> | Slots
) {
  if (isConfig(configOrMap)) {
    return parseDistinct(children, configOrMap as DistinctConfig<Slots, Collections>)
  }

  const result = parseDistinct(children, {
    slots: configOrMap as Slots,
  })

  return [
    result.slots,
    result.content,
    result.hasSlot,
  ]
}
