import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { FC, HTMLAttributes } from 'react'
import type { Placement } from '@floating-ui/dom'
import type {
  ReactElement,
  ReactNode,
  Ref,
  SVGAttributes,
} from 'react'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { M3Menu, M3MenuItem } from '@/components/menu'
import { M3ScrollRail } from '@/components/scroll-rail'
import { M3TextField } from '@/components/text-field'

import defineComponent from '@/utils/component'
import { defineSlot, distinct } from '@/utils/content'
import { requireComponentSetupContext } from '@/utils/component'
import { toClassName } from '@/utils/styling'
import {
  useAnimationFrame,
  useElementReference,
  useId,
  useResizeObserver,
} from '@/hooks'

export type M3SelectOption<Value = unknown> = {
  value: Value;
  label: string;
}

type SelectValue<Value> = Value | null
type SlotContext<Value> = {
  option: M3SelectOption<Value>;
  active: boolean;
}
type SlotChildren<Context> = ReactNode | ((context: Context) => ReactNode)
type SelectSlot = <Value>(props: {
  children: SlotChildren<SlotContext<Value>>;
}) => ReactElement | null

export interface M3SelectProps<Value = unknown> extends HTMLAttributes<HTMLElement> {
  ref?: Ref<M3SelectExposed>;
  id?: string;
  value?: SelectValue<Value>;
  options?: Array<M3SelectOption<Value>>;
  equalPredicate?: (a: SelectValue<Value>, b: SelectValue<Value>) => boolean;
  label?: string;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  outlined?: boolean;
  placement?: Placement;
  onUpdate?: (value: Value) => void;
}

export interface M3SelectExposed extends ElementReference<HTMLDivElement> {}

const CaretIcon: FC<SVGAttributes<SVGSVGElement>> = (attrs) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    {...attrs}
  >
    <path d="M9.5 17L14.5 12L9.5 7V17Z" fill="currentColor" />
  </svg>
)

const Leading: FC<{ children: SlotChildren<{ active: boolean }> }> = defineSlot(
  'M3Select.Leading',
  props => <>{props.children as ReactNode}</>
)
const OptionLeading = defineSlot(
  'M3Select.OptionLeading',
  props => <>{props.children as ReactNode}</>
) as SelectSlot
const OptionContent = defineSlot(
  'M3Select.OptionContent',
  props => <>{props.children as ReactNode}</>
) as SelectSlot

const asRenderProp = <Context,>(value: unknown): null | ((context: Context) => ReactNode) => {
  return typeof value === 'function' ? value as (context: Context) => ReactNode : null
}

const renderSlot = <Context,>(slot: ReactElement | null, context: Context): ReactNode => {
  if (!slot) {
    return null
  }

  const child = (slot.props as { children?: unknown }).children
  const renderProp = asRenderProp<Context>(child)

  return renderProp ? renderProp(context) : child as ReactNode
}

export default defineComponent(function M3Select<Value = unknown>({
  ref: _ref,
  id,
  value = null,
  options = [],
  equalPredicate = (a, b) => a === b,
  label = '',
  placeholder = '',
  invalid = false,
  disabled = false,
  readonly = false,
  outlined = false,
  placement = 'bottom-start',
  className = '',
  children = [],
  onUpdate = (_: Value) => {},
  ...attrs
}: M3SelectProps<Value>, context?: ComponentSetupContext<M3SelectExposed>) {
  const { expose } = requireComponentSetupContext(context)
  const _id = useId(id, 'm3-select')

  const [expanded, setExpanded] = useState(false)
  const [shouldBeExpanded, setShouldBeExpanded] = useState(false)
  const [rootWidth, setRootWidth] = useState(0)

  const root = useRef<HTMLDivElement | null>(null)
  expose(useElementReference(root))
  const resizeUpdate = useAnimationFrame()

  const [slots] = useMemo(() => distinct(children, {
    leading: Leading,
    optionLeading: OptionLeading,
    optionContent: OptionContent,
  }), [children])

  const text = useMemo(() => {
    return options.find(option => equalPredicate(option.value, value))?.label ?? ''
  }, [
    options,
    value,
    equalPredicate,
  ])

  const pick = useCallback((option: M3SelectOption<Value>) => {
    onUpdate(option.value)
    setShouldBeExpanded(false)
  }, [
    onUpdate,
  ])

  useResizeObserver(root, ([entry]) => {
    if (!entry) {
      return
    }

    resizeUpdate.request(() => {
      setRootWidth(entry.contentRect.width)
    })
  })

  useEffect(() => {
    setRootWidth(root.current?.offsetWidth ?? 0)
  }, [])

  return (
    <div
      ref={root}
      aria-controls={_id + '-menu'}
      aria-expanded={expanded ? 'true' : 'false'}
      aria-disabled={disabled ? 'true' : 'false'}
      aria-readonly={readonly ? 'true' : 'false'}
      aria-haspopup="listbox"
      role="combobox"
      className={toClassName([className, {
        'm3-select': true,
        'm3-select_expanded': shouldBeExpanded,
      }])}
      {...attrs}
    >
      <M3TextField
        id={_id}
        value={text}
        label={label}
        placeholder={placeholder}
        invalid={invalid}
        readonly={readonly}
        outlined={outlined}
        className="m3-select__field"
      >
        {slots.leading ? (
          <M3TextField.LeadingIcon>
            {renderSlot(slots.leading, { active: shouldBeExpanded })}
          </M3TextField.LeadingIcon>
        ) : null}

        <M3TextField.TrailingIcon>
          <CaretIcon
            aria-hidden="true"
            className="m3-select__caret"
          />
        </M3TextField.TrailingIcon>
      </M3TextField>

      <M3Menu
        id={_id + '-menu'}
        shown={shouldBeExpanded}
        target={root.current}
        placement={placement}
        aria-hidden={expanded ? 'false' : 'true'}
        disabled={disabled || readonly}
        style={{ width: rootWidth + 'px' }}
        role="listbox"
        onToggle={(shown) => {
          setExpanded(shown)
          setShouldBeExpanded(shown)
        }}
      >
        <div className="m3-select__scroll-box">
          <M3ScrollRail />

          {options.map((option, index) => (
            <M3MenuItem
              key={index}
              selected={equalPredicate(option.value, value)}
              role="option"
              onClick={() => pick(option)}
            >
              {slots.optionLeading ? (
                <M3MenuItem.Leading>
                  {renderSlot<SlotContext<Value>>(slots.optionLeading, {
                    option,
                    active: shouldBeExpanded,
                  })}
                </M3MenuItem.Leading>
              ) : null}

              {slots.optionContent ? (
                renderSlot<SlotContext<Value>>(slots.optionContent, {
                  option,
                  active: shouldBeExpanded,
                })
              ) : option.label}
            </M3MenuItem>
          ))}
        </div>
      </M3Menu>
    </div>
  )
}, {
  generic: true,
  slots: { Leading, OptionLeading, OptionContent },
})
