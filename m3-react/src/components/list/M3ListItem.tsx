import type { ComponentSetupContext } from '@/utils/component'
import type { CSSProperties } from 'react'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { HTMLAttributes, KeyboardEventHandler } from 'react'
import type { LineCount, Lines } from '@modulify/m3-foundation/types/components/list'
import type { M3RippleExposed } from '@/components/ripple'
import type { MouseEventHandler, Ref } from 'react'

import { useMemo, useRef, useState } from 'react'

import { M3Ripple } from '@/components/ripple'

import defineComponent from '@/utils/component'
import { defineSlot, distinct } from '@/utils/content'
import { toClassName } from '@/utils/styling'
import { useElementReference } from '@/hooks'

type RootElement = HTMLAnchorElement | HTMLButtonElement
type M3ListItemStyle = CSSProperties & {
  '--m3-list-item-supporting-lines'?: number;
}

export interface M3ListItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'onClick' | 'onKeyUp'> {
  ref?: Ref<M3ListItemExposed>;
  type?: HTMLButtonElement['type'];
  href?: string;
  headline?: string;
  overline?: string;
  supportingText?: string;
  lines?: Lines;
  interactive?: boolean;
  selected?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<RootElement>;
  onKeyUp?: KeyboardEventHandler<RootElement>;
}

export interface M3ListItemExposed extends ElementReference<HTMLLIElement> {}

const Leading = defineSlot('M3ListItem.Leading')
const Overline = defineSlot('M3ListItem.Overline')
const Headline = defineSlot('M3ListItem.Headline')
const SupportingText = defineSlot('M3ListItem.SupportingText')
const Trailing = defineSlot('M3ListItem.Trailing')

const resolveLines = (overline: boolean, supportingText: boolean): LineCount => {
  if (overline && supportingText) {
    return 3
  }

  if (overline || supportingText) {
    return 2
  }

  return 1
}

const lineCounts: LineCount[] = [1, 2, 3]

const normalizeLines = (lines: Lines | undefined, fallback: LineCount): LineCount => {
  const normalized = Number(lines ?? fallback)

  return lineCounts.includes(normalized as LineCount)
    ? normalized as LineCount
    : fallback
}

const getSupportingLines = (lines: LineCount) => lines === 3 ? 2 : 1

export default defineComponent(function M3ListItem({
  ref: _ref,
  type = 'button',
  href = '',
  headline = '',
  overline = '',
  supportingText = '',
  lines,
  interactive = false,
  selected = false,
  disabled = false,
  className = '',
  style,
  children = [],
  onClick,
  onKeyUp,
  ...attrs
}: M3ListItemProps, { expose }: ComponentSetupContext<M3ListItemExposed>) {
  const root = useRef<HTMLLIElement | null>(null)
  const ripple = useRef<M3RippleExposed | null>(null)
  expose(useElementReference(root))
  const [rippleTarget, setRippleTarget] = useState<RootElement | null>(null)

  const [slots, content, hasSlot] = useMemo(() => distinct(children, {
    headline: Headline,
    leading: Leading,
    overline: Overline,
    supportingText: SupportingText,
    trailing: Trailing,
  }), [children])

  const hasOverline = hasSlot('overline') || overline.length > 0
  const hasHeadline = hasSlot('headline') || headline.length > 0 || content.length > 0
  const hasSupportingText = hasSlot('supportingText') || supportingText.length > 0
  const linesActual = normalizeLines(lines, resolveLines(hasOverline, hasSupportingText))
  const interactiveActual = interactive || href.length > 0 || typeof onClick === 'function'
  const itemStyle: M3ListItemStyle | undefined = linesActual === 1
    ? style
    : {
      ...style,
      '--m3-list-item-supporting-lines': getSupportingLines(linesActual),
    }

  const body = (
    <>
      {hasOverline ? (
        <span className="m3-list-item__overline">
          {slots.overline ?? overline}
        </span>
      ) : null}

      {hasHeadline ? (
        <span className="m3-list-item__headline">
          {slots.headline ?? (headline.length > 0 ? headline : content)}
        </span>
      ) : null}

      {hasSupportingText ? (
        <span className="m3-list-item__supporting-text">
          {slots.supportingText ?? supportingText}
        </span>
      ) : null}
    </>
  )

  const itemContent = (
    <>
      {interactiveActual ? <M3Ripple ref={ripple} owner={rippleTarget} /> : null}
      <span className="m3-list-item__state" aria-hidden={true} />

      {slots.leading ? (
        <span className="m3-list-item__leading">
          {slots.leading}
        </span>
      ) : null}

      <span className="m3-list-item__body">
        {body}
      </span>

      {slots.trailing ? (
        <span className="m3-list-item__trailing">
          {slots.trailing}
        </span>
      ) : null}
    </>
  )

  const handleClick: MouseEventHandler<RootElement> = event => {
    if (disabled) {
      event.preventDefault()
      return
    }

    ripple.current?.activate(event.nativeEvent)
    onClick?.(event)
  }

  const handleKeyUp: KeyboardEventHandler<RootElement> = event => {
    if (event.code === 'Enter') {
      ripple.current?.activate(event.nativeEvent)
    }

    onKeyUp?.(event)
  }

  const actionProps = {
    className: 'm3-list-item__content',
    onClick: handleClick,
    onKeyUp: handleKeyUp,
    ref: setRippleTarget,
  }

  return (
    <li
      ref={root}
      className={toClassName([className, {
        'm3-list-item': true,
        'm3-list-item_multiline': linesActual > 1,
        'm3-list-item_interactive': interactiveActual,
        'm3-list-item_selected': selected,
        'm3-list-item_disabled': disabled,
      }])}
      style={itemStyle}
      {...attrs}
    >
      {interactiveActual
        ? href.length > 0
          ? (
            <a
              {...actionProps}
              href={disabled ? undefined : href}
              aria-disabled={disabled ? 'true' : undefined}
              tabIndex={disabled ? -1 : undefined}
            >
              {itemContent}
            </a>
          )
          : (
            <button
              {...actionProps}
              type={type}
              disabled={disabled}
            >
              {itemContent}
            </button>
          )
        : (
          <div className="m3-list-item__content">
            {itemContent}
          </div>
        )}
    </li>
  )
}, {
  slots: { Headline, Leading, Overline, SupportingText, Trailing },
})
