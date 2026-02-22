import type {
  FC,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  SVGAttributes,
} from 'react'

import type { Placement } from '@floating-ui/dom'

import {
  M3Menu,
  M3MenuItem,
} from '@/components/menu'
import { M3ScrollRail } from '@/components/scroll-rail'
import { M3TextField } from '@/components/text-field'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  useId,
} from '@/hooks'

import { distinct } from '@/utils/content'
import { toClassName } from '@/utils/styling'

export type M3SelectOption<Value = unknown> = {
  value: Value;
  label: string;
}

type SelectValue<Value> = Value | null
type SlotContext<Value> = {
  active: boolean;
  option: M3SelectOption<Value>;
}

export interface M3SelectProps<Value = unknown> extends HTMLAttributes<HTMLElement> {
  id?: string;
  value?: SelectValue<Value>;
  label?: string;
  options?: Array<M3SelectOption<Value>>;
  equalPredicate?: (a: SelectValue<Value>, b: SelectValue<Value>) => boolean;
  invalid?: boolean;
  placeholder?: string;
  placement?: Placement;
  disabled?: boolean;
  readonly?: boolean;
  outlined?: boolean;
  onUpdate?: (value: Value) => void;
}

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

const Leading: FC<{ children: ReactNode }> = props => <>{props.children}</>
const OptionLeading: FC<{ children: ReactNode }> = props => <>{props.children}</>
const OptionContent: FC<{ children: ReactNode }> = props => <>{props.children}</>

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

const M3Select = <Value,>({
  id,
  value = null,
  label = '',
  options = [],
  equalPredicate = (a, b) => a === b,
  invalid = false,
  placeholder = '',
  placement = 'bottom-start',
  disabled = false,
  readonly = false,
  outlined = false,
  className = '',
  children = [],
  onUpdate = (_: Value) => {},
  ...attrs
}: M3SelectProps<Value>) => {
  const _id = useId(id, 'm3-select')

  const [expanded, setExpanded] = useState(false)
  const [shouldBeExpanded, setShouldBeExpanded] = useState(false)
  const [rootWidth, setRootWidth] = useState(0)

  const root = useRef<HTMLDivElement | null>(null)

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

  useEffect(() => {
    const _root = root.current
    if (!_root) {
      return
    }

    setRootWidth(_root.offsetWidth)

    let frameId: number | null = null
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) {
        return
      }

      if (frameId !== null) {
        cancelAnimationFrame(frameId)
      }

      frameId = requestAnimationFrame(() => setRootWidth(entry.contentRect.width))
    })

    observer.observe(_root)

    return () => {
      observer.disconnect()

      if (frameId !== null) {
        cancelAnimationFrame(frameId)
      }
    }
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
}

export default Object.assign(M3Select, {
  Leading,
  OptionLeading,
  OptionContent,
})
