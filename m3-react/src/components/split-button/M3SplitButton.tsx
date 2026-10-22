import type { Appearance } from '@modulify/m3-foundation/types/components/button'
import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type {
  HTMLAttributes,
  MouseEventHandler,
  ReactNode,
  Ref,
} from 'react'
import type { Size } from '@modulify/m3-foundation/types/components/button'

import type { M3ButtonExposed } from '@/components/button'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { M3Button } from '@/components/button'

import { M3Icon } from '@/components/icon'
import { M3Menu } from '@/components/menu'

import defineComponent from '@/utils/component'
import { toClassName } from '@/utils/styling'
import { useElementReference, useId } from '@/hooks'

export interface M3SplitButtonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'onToggle'> {
  ref?: Ref<M3SplitButtonExposed>;
  appearance?: Appearance;
  size?: Size;
  disabled?: boolean;
  /** Accessible name of the trailing control, such as "More save options". */
  menuLabel: string;
  menu: ReactNode | ((controls: { close: () => void }) => ReactNode);
  open?: boolean;
  onToggle?: (open: boolean) => void;
  onAction?: MouseEventHandler<HTMLButtonElement>;
}

export interface M3SplitButtonExposed extends ElementReference<HTMLDivElement> {}

export default defineComponent(function M3SplitButton({
  ref: _ref,
  id,
  appearance = 'filled',
  size = 'sm',
  disabled = false,
  menuLabel,
  menu,
  open,
  onToggle = () => {},
  onAction = () => {},
  className = '',
  children,
  ...attrs
}: M3SplitButtonProps, { expose }: ComponentSetupContext<M3SplitButtonExposed>) {
  const root = useRef<HTMLDivElement | null>(null)
  const main = useRef<M3ButtonExposed | null>(null)
  const [menuTarget, setMenuTarget] = useState<HTMLButtonElement | null>(null)
  const [internalOpen, setInternalOpen] = useState(open ?? false)
  const uid = useId(id, 'm3-split-button')
  const menuId = uid + '-menu'
  const isOpen = !disabled && internalOpen
  useEffect(() => {
    if (open !== undefined) setInternalOpen(open)
  }, [open])
  const captureMenuTarget = useCallback((instance: { el: HTMLButtonElement | null } | null) => {
    setMenuTarget(current => current === instance?.el ? current : instance?.el ?? null)
  }, [])

  expose(useElementReference(root))

  const toggle = (next: boolean) => {
    setInternalOpen(next)
    onToggle(next)
  }

  return <>
    <div
      ref={root}
      id={uid}
      role="group"
      className={toClassName([className, 'm3-split-button', `m3-split-button_${size}`, {
        'm3-split-button_open': isOpen,
      }])}
      {...attrs}
    >
      <span className="m3-split-button__segment" onClick={event => {
        if (event.target === event.currentTarget && !disabled) main.current?.click()
      }}>
        <M3Button ref={main} className="m3-split-button__main" appearance={appearance} size={size} disabled={disabled} onClick={onAction}>
          {children}
        </M3Button>
      </span>
      <span className="m3-split-button__segment" onClick={event => {
        if (event.target === event.currentTarget && !disabled) menuTarget?.click()
      }}>
        <M3Button
          ref={captureMenuTarget}
          className="m3-split-button__trailing"
          appearance={appearance}
          size={size}
          disabled={disabled}
          aria-label={menuLabel}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-controls={menuId}
        >
          <M3Icon name="expand_more" />
        </M3Button>
      </span>
    </div>
    <M3Menu id={menuId} target={menuTarget} shown={isOpen} disabled={disabled} placement="bottom-end" offsetMainAxis={4} onToggle={toggle}>
      {typeof menu === 'function' ? menu({ close: () => toggle(false) }) : menu}
    </M3Menu>
  </>
})
