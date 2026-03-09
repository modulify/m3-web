import type {
  ButtonHTMLAttributes,
  ForwardRefRenderFunction,
  MouseEventHandler,
  ReactNode,
} from 'react'

import type { Variant } from '@modulify/m3-foundation/types/components/chip'
import type {
  Clickable,
  Focusable,
} from '@modulify/m3-foundation'

import type { M3RippleMethods } from '@/components/ripple'

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'

import { M3Icon } from '@/components/icon'
import { M3Ripple } from '@/components/ripple'

import {
  useElementEffect,
  useTarget,
} from '@/hooks'

import { normalize } from '@/utils/content'
import { toClassName } from '@/utils/styling'

export interface M3ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onToggle'> {
  variant?: Variant;
  selected?: boolean;
  showCheckmark?: boolean;
  dismissible?: boolean;
  dismissLabel?: string;
  onToggle?: (selected: boolean) => void;
  onDismiss?: () => void;
}

export interface M3ChipMethods extends Clickable, Focusable {}

const M3Chip: ForwardRefRenderFunction<M3ChipMethods, M3ChipProps> = ({
  type = 'button',
  variant = 'assist',
  selected = false,
  showCheckmark = true,
  dismissible = false,
  dismissLabel = 'Remove',
  disabled = false,
  className = '',
  style,
  children = [],
  onClick = () => {},
  onKeyUp = () => {},
  onToggle = () => {},
  onDismiss,
  ...actionAttrs
}, ref) => {
  const action = useRef<HTMLButtonElement | null>(null)
  const dismiss = useRef<HTMLButtonElement | null>(null)
  const actionRipple = useRef<M3RippleMethods | null>(null)
  const dismissRipple = useRef<M3RippleMethods | null>(null)

  const [actionRippleTarget, setActionRippleTarget] = useTarget<HTMLButtonElement>()
  const [dismissRippleTarget, setDismissRippleTarget] = useTarget<HTMLButtonElement>()

  useElementEffect(action, setActionRippleTarget)
  useElementEffect(dismiss, setDismissRippleTarget)

  useImperativeHandle(ref, () => ({
    click: () => action.current?.click(),
    focus: () => action.current?.focus(),
    blur: () => action.current?.blur(),
  }))

  const content = useMemo(() => normalize(children), [children])

  const hasText = useMemo(() => content.some(([, isIcon]) => !isIcon), [content])
  const [, hasLeadingIcon] = content[0] ?? [null, false]
  const [, hasTrailingIcon] = content[content.length - 1] ?? [null, false]

  const hasCheckmark = variant === 'filter' && selected && showCheckmark && !hasLeadingIcon
  const hasDismiss = dismissible || typeof onDismiss === 'function'

  const renderItem = useCallback((child: ReactNode, isIcon: boolean, key: string) => (
    <span
      key={key}
      className={toClassName({
        'm3-chip__icon': isIcon,
        'm3-chip__label': !isIcon,
      })}
    >
      {child}
    </span>
  ), [])

  return (
    <span
      className={toClassName([className, {
        'm3-chip': true,
        ['m3-chip_' + variant]: true,
        'm3-chip_selected': selected,
        'm3-chip_disabled': disabled,
        'm3-chip_dismissible': hasDismiss,
        'm3-chip_has-leading-icon': hasText && hasLeadingIcon,
        'm3-chip_has-trailing-icon': hasText && hasTrailingIcon,
        'm3-chip_has-checkmark': hasCheckmark,
      }])}
      style={style}
    >
      <button
        ref={action}
        type={type}
        className="m3-chip__action"
        disabled={disabled}
        aria-pressed={variant === 'filter' ? selected : undefined}
        onClick={(event) => {
          onClick(event)

          if (!event.defaultPrevented && variant === 'filter') {
            onToggle(!selected)
          }
        }}
        onKeyUp={event => {
          if (event.code === 'Enter') {
            actionRipple.current?.activate(event.nativeEvent)
          }

          onKeyUp(event)
        }}
        {...actionAttrs}
      >
        <M3Ripple ref={actionRipple} owner={actionRippleTarget} />
        <span className="m3-chip__state" />
        <span className="m3-chip__content">
          {hasCheckmark ? (
            <span className="m3-chip__icon m3-chip__icon_selection">
              <M3Icon name="check" />
            </span>
          ) : null}

          {content.map(([child, isIcon], index) => renderItem(child, isIcon, `chip-content-${index}`))}
        </span>
      </button>

      {hasDismiss ? (
        <button
          ref={dismiss}
          type="button"
          className="m3-chip__dismiss"
          disabled={disabled}
          aria-label={dismissLabel}
          onClick={(event) => {
            event.stopPropagation()
            onDismiss?.()
          }}
          onKeyUp={event => {
            if (event.code === 'Enter') {
              dismissRipple.current?.activate(event.nativeEvent)
            }
          }}
        >
          <M3Ripple ref={dismissRipple} owner={dismissRippleTarget} centered={true} />
          <span className="m3-chip__state" />
          <span className="m3-chip__content">
            <span className="m3-chip__icon">
              <M3Icon name="close" />
            </span>
          </span>
        </button>
      ) : null}
    </span>
  )
}

export default forwardRef(M3Chip)
