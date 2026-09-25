import type { ReactElement, ReactNode, Ref } from 'react'

import { useImperativeHandle } from 'react'

type Component = Exclude<ReactElement['type'], string>
type Slots = Record<string, Component>
type WithSlots<Root, ComponentSlots extends Slots> = [keyof ComponentSlots] extends [never]
  ? Root
  : Root & ComponentSlots
type ComponentOptions<ComponentSlots extends Slots = Record<never, never>> = {
  slots?: ComponentSlots;
  generic?: false;
}
type GenericComponentOptions<ComponentSlots extends Slots = Record<never, never>> = {
  slots?: ComponentSlots;
  generic: true;
}

export interface ComponentSetupContext<Exposed> {
  expose: (value: Exposed) => void;
}

export const requireComponentSetupContext = <Exposed>(
  context: ComponentSetupContext<Exposed> | undefined
): ComponentSetupContext<Exposed> => {
  if (!context) {
    throw new Error('Component setup context is only available inside defineComponent')
  }

  return context
}

type ComponentSetup<Props, Exposed> = (
  props: Props,
  context: ComponentSetupContext<Exposed>
) => ReactNode
function defineComponent<
  Props,
  Exposed,
  ComponentSlots extends Slots = Record<never, never>,
>(
  setup: ComponentSetup<Props, Exposed>,
  options?: ComponentOptions<ComponentSlots>
): WithSlots<
  (props: Props) => ReactNode,
  ComponentSlots
>

function defineComponent<
  Setup extends (...args: never[]) => ReactNode,
  ComponentSlots extends Slots = Record<never, never>,
>(
  setup: Setup,
  options: GenericComponentOptions<ComponentSlots>
): WithSlots<Setup, ComponentSlots>

function defineComponent<ComponentSlots extends Slots>(
  setup: (...args: never[]) => ReactNode,
  options: ComponentOptions<ComponentSlots> | GenericComponentOptions<ComponentSlots> = {}
): WithSlots<Component, ComponentSlots> {
  const component = function DefinedComponent({
    ref,
    ...props
  }: { ref?: Ref<unknown> } & Record<string, unknown>) {
    let exposed: unknown
    const content = (setup as ComponentSetup<unknown, unknown>)(props, {
      expose: value => exposed = value,
    })

    useImperativeHandle(ref, () => exposed, [exposed])

    return content
  }

  return Object.assign(component, { displayName: setup.name }, options.slots ?? {}) as unknown as WithSlots<Component, ComponentSlots>
}

export default defineComponent
