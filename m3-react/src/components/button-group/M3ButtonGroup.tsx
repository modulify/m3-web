import type { Appearance } from '@modulify/m3-foundation/types/components/button-group'
import type { ButtonHTMLAttributes } from 'react'
import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { HTMLAttributes } from 'react'
import type { Interactable } from '@modulify/m3-foundation/types/dom'
import type { Kind } from '@modulify/m3-foundation/types/components/button-group'
import type { M3ButtonExposed } from '@/components/button'
import type { Ref } from 'react'
import type {
  Rounding,
  Selection,
  Size,
  Value,
  Variant,
} from '@modulify/m3-foundation/types/components/button-group'
import type { Width } from '@modulify/m3-foundation/types/components/button'

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import { M3Button } from '@/components/button'
import { M3ButtonSize } from '@/components/button/M3ButtonSize'

import defineComponent from '@/utils/component'
import { normalize } from '@/utils/content'
import { toClassName } from '@/utils/styling'
import { useElementReference } from '@/hooks'

interface GroupContext {
  variant: Variant;
  size: Size;
  rounding: Rounding;
  selection: Selection;
  selected: (value: string) => boolean;
  activate: (value: string) => void;
}

const context = createContext<GroupContext | null>(null)

export interface M3ButtonGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  ref?: Ref<M3ButtonGroupExposed>;
  variant?: Variant;
  size?: Size;
  rounding?: Rounding;
  selection?: Selection;
  required?: boolean;
  value?: Value;
  defaultValue?: Value;
  onChange?: (value: Value) => void;
}

export interface M3ButtonGroupExposed extends ElementReference<HTMLDivElement> {}

export const M3ButtonGroup = defineComponent(function M3ButtonGroup({
  ref: _ref,
  variant = 'standard',
  size = 'sm',
  rounding = 'round',
  selection: selectionProp,
  required = false,
  value,
  defaultValue = null,
  onChange = () => {},
  className = '',
  children,
  onFocusCapture = () => {},
  onKeyDown = () => {},
  ...attrs
}: M3ButtonGroupProps, { expose }: ComponentSetupContext<M3ButtonGroupExposed>) {
  const root = useRef<HTMLDivElement | null>(null)
  const [internalValue, setInternalValue] = useState<Value>(defaultValue)
  const selection = selectionProp ?? (variant === 'connected' ? 'single' : 'none')
  const currentValue = value === undefined ? internalValue : value

  useLayoutEffect(() => {
    const buttons = Array.from(root.current?.querySelectorAll<HTMLButtonElement>(':scope > .m3-button-group__wrapper > .m3-button-group__item:not(:disabled)') ?? [])
    const focused = buttons.find(button => button === document.activeElement)
    const selectedButton = buttons.find(button => button.getAttribute('aria-pressed') === 'true')
    const tabStop = focused ?? selectedButton ?? buttons[0]
    buttons.forEach(button => button.tabIndex = button === tabStop ? 0 : -1)
  })

  expose(useElementReference(root))

  const selected = useCallback((itemValue: string) => selection === 'multiple'
    ? Array.isArray(currentValue) && currentValue.includes(itemValue)
    : selection === 'single' && currentValue === itemValue, [selection, currentValue])

  const activate = useCallback((itemValue: string) => {
    if (selection === 'none') return

    let nextValue: Value

    if (selection === 'multiple') {
      const previous = Array.isArray(currentValue) ? currentValue : []
      nextValue = previous.includes(itemValue)
        ? previous.filter(item => item !== itemValue)
        : [...previous, itemValue]
      if (required && nextValue.length === 0) return
    } else {
      nextValue = currentValue === itemValue ? null : itemValue
      if (required && nextValue === null) return
    }

    if (value === undefined) setInternalValue(nextValue)
    onChange(nextValue)
  }, [selection, currentValue, required, value, onChange])

  const moveFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { key } = event
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) return

    const buttons = Array.from(root.current?.querySelectorAll<HTMLButtonElement>(':scope > .m3-button-group__wrapper > .m3-button-group__item:not(:disabled)') ?? [])
    const index = buttons.indexOf(event.target as HTMLButtonElement)
    if (index < 0 || buttons.length === 0) return

    const rtl = getComputedStyle(root.current!).direction === 'rtl'
    const previous = key === 'ArrowUp' || (key === 'ArrowLeft' && !rtl) || (key === 'ArrowRight' && rtl)
    const next = (index + (previous ? -1 : 1) + buttons.length) % buttons.length
    buttons.forEach(button => button.tabIndex = button === buttons[next] ? 0 : -1)
    buttons[next]?.focus()
    event.preventDefault()
  }

  return (
    <M3ButtonSize.Provider value={size}>
      <context.Provider value={{ variant, size, rounding, selection, selected, activate }}>
        <div
          ref={root}
          role="group"
          className={toClassName([className, 'm3-button-group', `m3-button-group_${variant}`, `m3-button-group_${size}`, `m3-button-group_${rounding}`])}
          {...attrs}
          onFocusCapture={event => {
            onFocusCapture(event)
            const button = event.target
            if (!(button instanceof HTMLButtonElement) || !button.matches('.m3-button-group__item:not(:disabled)')) return
            root.current?.querySelectorAll<HTMLButtonElement>('.m3-button-group__item:not(:disabled)').forEach(item => item.tabIndex = item === button ? 0 : -1)
          }}
          onKeyDown={event => {
            onKeyDown(event)
            if (!event.defaultPrevented) moveFocus(event)
          }}
        >
          {children}
        </div>
      </context.Provider>
    </M3ButtonSize.Provider>
  )
})

export interface M3ButtonGroupItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  ref?: Ref<M3ButtonGroupItemExposed>;
  value: string;
  appearance?: Appearance;
  kind?: Kind;
  size?: Size;
  width?: Exclude<Width, 'auto'>;
}

export interface M3ButtonGroupItemExposed extends Interactable, ElementReference<HTMLButtonElement> {}

export const M3ButtonGroupItem = defineComponent(function M3ButtonGroupItem({
  ref: _ref,
  value,
  appearance = 'tonal',
  kind = 'button',
  size,
  width = 'medium',
  disabled = false,
  type = 'button',
  className = '',
  children,
  onClick = () => {},
  ...attrs
}: M3ButtonGroupItemProps, { expose }: ComponentSetupContext<M3ButtonGroupItemExposed>) {
  const group = useContext(context)
  if (!group) throw new Error('M3ButtonGroupItem must be inside M3ButtonGroup')
  if (group.variant === 'connected' && size && size !== group.size) {
    throw new Error('Connected M3ButtonGroup items must use the group size')
  }

  const root = useRef<M3ButtonExposed | null>(null)
  expose({
    get el () { return root.current?.el ?? null },
    click: () => root.current?.click(),
    focus: () => root.current?.focus(),
    blur: () => root.current?.blur(),
  })

  const isSelected = group.selected(value)
  const toggle = group.selection !== 'none'
  const content = normalize(children)
  const iconOnly = content.length === 1 && content[0]![1]
  const itemClass = toClassName([className, 'm3-button-group__item', {
    'm3-button-group__item_icon-only': iconOnly,
    'm3-button-group__item_selected': isSelected,
  }])
  const itemProps = {
    ...attrs,
    ref: root,
    type,
    disabled,
    size,
    rounding: group.rounding,
    toggleable: toggle,
    selected: isSelected,
    className: itemClass,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick(event)
      if (!event.defaultPrevented && !disabled) group.activate(value)
    },
  }

  return (
    <span
      className={toClassName(['m3-button-group__wrapper', {
        'm3-button-group__wrapper_icon-only': iconOnly,
        [`m3-button-group__wrapper_${size}`]: size && size !== group.size,
      }])}
      onClick={event => {
        if (event.target === event.currentTarget && !disabled) root.current?.click()
      }}
    >
      {kind === 'icon'
        ? <M3Button appearance={appearance} {...{ ...itemProps, width }}>
          {children}
        </M3Button>
        : <M3Button appearance={appearance} {...itemProps}>
          {children}
        </M3Button>}
    </span>
  )
})
