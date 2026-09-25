import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { ReactNode, Ref } from 'react'

import { createRef } from 'react'
import { render } from '@testing-library/react'
import { useRef } from 'react'

import defineComponent from '@/utils/component'
import { defineSlot } from '@/utils/content'
import { requireComponentSetupContext } from '@/utils/component'

const Header = defineSlot('TestComponent.Header')
interface TestComponentProps {
  children: ReactNode;
  ref?: Ref<TestComponentExposed>;
}

interface TestComponentExposed extends ElementReference<HTMLElement> {}

const Component = defineComponent(function TestComponent(
  props: TestComponentProps,
  { expose }: ComponentSetupContext<TestComponentExposed>
) {
  const root = useRef<HTMLElement | null>(null)
  expose({
    get el () {
      return root.current
    },
  })

  return <section ref={root}>{props.children}</section>
}, {
  slots: { Header },
})

interface GenericComponentExposed<Value> extends ElementReference<HTMLElement> {
  value: Value;
}

interface GenericComponentProps<Value> {
  ref?: Ref<GenericComponentExposed<Value>>;
  value: Value;
}

const GenericComponent = defineComponent(function TestGenericComponent<Value>({
  value,
}: GenericComponentProps<Value>, context?: ComponentSetupContext<GenericComponentExposed<Value>>) {
  const { expose } = requireComponentSetupContext(context)
  const root = useRef<HTMLElement | null>(null)
  expose({
    get el () {
      return root.current
    },
    value,
  })

  return <section ref={root}>{String(value)}</section>
}, { generic: true })

const renderWithMismatchedGenericRef = () => {
  const ref = createRef<GenericComponentExposed<number>>()

  // @ts-expect-error The value and exposed ref must use the same generic type.
  return <GenericComponent ref={ref} value="value" />
}

void renderWithMismatchedGenericRef

describe('m3-react/defineComponent', () => {
  test('attaches typed slots to a component', () => {
    const { container } = render(
      <Component>
        <Component.Header>Header</Component.Header>
      </Component>
    )

    expect(container.innerHTML).toBe('<section>Header</section>')
  })

  test('creates a ref-aware component by default', () => {
    const ref = createRef<TestComponentExposed>()

    const { container } = render(
      <Component ref={ref}>
        <Component.Header>Header</Component.Header>
      </Component>
    )

    expect(ref.current?.el).toBe(container.firstElementChild)
  })

  test('preserves generic props and exposed ref types', () => {
    const ref = createRef<GenericComponentExposed<string>>()

    const { container } = render(<GenericComponent ref={ref} value="value" />)

    expect(ref.current).toMatchObject({
      el: container.firstElementChild,
      value: 'value',
    })
  })
})
