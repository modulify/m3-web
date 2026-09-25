import type { ButtonHTMLAttributes } from 'react'
import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { Interactable } from '@modulify/m3-foundation/types/dom'
import type { M3RippleExposed } from '@/components/ripple'
import type { ReactNode, Ref } from 'react'
import type { Variant } from '@modulify/m3-foundation/types/components/chip'

import { useCallback, useMemo, useRef } from 'react'

import { M3Icon } from '@/components/icon'
import { M3Ripple } from '@/components/ripple'

import defineComponent from '@/utils/component'
import { normalize } from '@/utils/content'
import { toClassName } from '@/utils/styling'
import { useElementEffect, useInteractable, useTarget } from '@/hooks'

export interface M3ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onToggle'> {
  ref?: Ref<M3ChipExposed>;
  variant?: Variant;
  selected?: boolean;
  showCheckmark?: boolean;
  dismissible?: boolean;
  dismissLabel?: string;
  onToggle?: (selected: boolean) => void;
  onDismiss?: () => void;
}

export interface M3ChipExposed extends M3ChipMethods, ElementReference<HTMLSpanElement> {}

export interface M3ChipMethods extends Interactable {}

export default defineComponent(function M3Chip({
  ref: _ref,
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
}: M3ChipProps, { expose }: ComponentSetupContext<M3ChipExposed>) {
  const root = useRef<HTMLSpanElement | null>(null)
  const action = useRef<HTMLButtonElement | null>(null)
  const dismiss = useRef<HTMLButtonElement | null>(null)
  const actionRipple = useRef<M3RippleExposed | null>(null)
  const dismissRipple = useRef<M3RippleExposed | null>(null)

  const [actionRippleTarget, setActionRippleTarget] = useTarget<HTMLButtonElement>()
  const [dismissRippleTarget, setDismissRippleTarget] = useTarget<HTMLButtonElement>()
  const interactable = useInteractable(root, action)

  useElementEffect(action, setActionRippleTarget)
  useElementEffect(dismiss, setDismissRippleTarget)

  expose(interactable)

  const content = useMemo(() => normalize(children), [children])

  const hasText = useMemo(() => content.some(([, isIcon]) => !isIcon), [content])
  const [, hasLeadingIcon] = content[0] ?? [null, false]
  const [, hasTrailingIcon] = content[content.length - 1] ?? [null, false]

  const hasCheckmark = variant === 'filter' && selected && showCheckmark && !hasLeadingIcon
  const hasDismiss = dismissible || typeof onDismiss === 'function'

  const renderItem = useCallback((child: ReactNode, isIcon: boolean, key: string) => (
    <span
      ref={root}
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
})
