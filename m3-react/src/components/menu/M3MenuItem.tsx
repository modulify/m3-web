import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { HTMLAttributes } from 'react'
import type { M3LinkExposed } from '@/components/link'
import type { M3RippleExposed } from '@/components/ripple'
import type { Ref } from 'react'

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  addCloserListeners,
  removeCloserListeners,
} from '@modulify/m3-foundation/lib/popper/closer'

import { M3Icon } from '@/components/icon'
import { M3Link } from '@/components/link'
import { M3Ripple } from '@/components/ripple'

import { compose } from '@/utils/events'
import defineComponent from '@/utils/component'
import { defineSlot, distinct } from '@/utils/content'
import { toClassName } from '@/utils/styling'
import { useId, useTimeout } from '@/hooks'

import M3Menu from './M3Menu'

export interface M3MenuItemProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<M3MenuItemExposed>;
  href?: string;
  selected?: boolean;
  selection?: 'single' | 'multiple';
  disabled?: boolean;
}

export interface M3MenuItemExposed extends ElementReference {}

const Leading = defineSlot('M3MenuItem.Leading')
const Trailing = defineSlot('M3MenuItem.Trailing')
const Submenu = defineSlot('M3MenuItem.Submenu')

export default defineComponent(function M3MenuItem({
  ref: _ref,
  href,
  role,
  selected = false,
  selection,
  disabled = false,
  className = '',
  children = [],
  onClick = () => {},
  onBlur = () => {},
  onFocus = () => {},
  onKeyDown = () => {},
  onKeyUp = () => {},
  onMouseEnter = () => {},
  onMouseLeave = () => {},
  ...attrs
}: M3MenuItemProps, { expose }: ComponentSetupContext<M3MenuItemExposed>) {
  const root = useRef<M3LinkExposed | null>(null)
  const ripple = useRef<M3RippleExposed | null>(null)
  const submenuId = useId(undefined, 'm3-submenu')
  const [submenuOpen, setSubmenuOpen] = useState(false)
  const closeSubmenu = useTimeout(() => setSubmenuOpen(false), 200)

  expose({
    get el () { return root.current?.el ?? null },
  })

  const [rippleTarget, setRippleTarget] = useState<HTMLElement | null>(null)

  const [slots, content] = useMemo(() => distinct(children, {
    leading: Leading,
    trailing: Trailing,
    submenu: Submenu,
  }), [children])
  const hasSubmenu = !!slots.submenu

  useEffect(() => {
    const element = root.current?.el
    setRippleTarget(element ?? null)

    if (!element || hasSubmenu || disabled) return

    addCloserListeners(element)
    return () => removeCloserListeners(element)
  }, [disabled, hasSubmenu])

  return (
    <>
      <M3Link
        ref={root}
        href={disabled ? undefined : href}
        disabled={disabled}
        role={role ?? (selection === 'single' ? 'menuitemradio' : selection === 'multiple' ? 'menuitemcheckbox' : 'menuitem')}
        aria-checked={selection ? selected : undefined}
        aria-disabled={disabled ? 'true' : undefined}
        aria-haspopup={hasSubmenu ? 'menu' : undefined}
        aria-expanded={hasSubmenu ? submenuOpen : undefined}
        aria-controls={hasSubmenu ? submenuId : undefined}
        tabIndex={disabled ? -1 : undefined}
        className={toClassName([className, {
          'm3-menu-item': true,
          'm3-menu-item_selected': selected,
          'm3-menu-item_disabled': disabled,
          'm3-menu-item_active': submenuOpen,
        }])}
        {...attrs}
        onBlur={(event) => {
          const next = event.relatedTarget
          if (hasSubmenu && !(next instanceof Node && document.getElementById(submenuId)?.contains(next))) {
            setSubmenuOpen(false)
          }

          onBlur(event)
        }}
        onFocus={onFocus}
        onKeyDown={(event) => {
          if (hasSubmenu && !disabled && event.key === (document.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight')) {
            closeSubmenu.cancel()
            setSubmenuOpen(true)
            event.preventDefault()
          }

          onKeyDown(event)
        }}
        onMouseEnter={(event) => {
          if (hasSubmenu && !disabled) {
            closeSubmenu.cancel()
            setSubmenuOpen(true)
          }

          onMouseEnter(event)
        }}
        onMouseLeave={(event) => {
          if (hasSubmenu) closeSubmenu.schedule()
          onMouseLeave(event)
        }}
        onClick={(event) => {
          if (disabled) {
            event.preventDefault()
            event.stopPropagation()
            return
          }

          if (hasSubmenu) {
            event.preventDefault()
            closeSubmenu.cancel()
            setSubmenuOpen(true)
          }

          onClick(event)
        }}
        onKeyUp={compose(event => {
          if (!disabled && event.code === 'Enter') {
            ripple.current?.activate(event.nativeEvent)
          }
        }, onKeyUp)}
      >
        <M3Ripple ref={ripple} owner={rippleTarget} />

        <span className="m3-menu-item__state" />
        <span className="m3-menu-item__content">
          {slots.leading ? (
            <span className="m3-menu-item__icon">
              {slots.leading}
            </span>
          ) : null}

          <span className="m3-menu-item__body">
            {content}
          </span>

          {slots.trailing || hasSubmenu ? (
            <span className="m3-menu-item__icon">
              {slots.trailing ?? <M3Icon name="chevron_right" aria-hidden />}
            </span>
          ) : null}
        </span>
      </M3Link>
      {hasSubmenu ? <M3Menu
        id={submenuId}
        target={rippleTarget}
        shown={submenuOpen}
        placement={typeof document !== 'undefined' && document.dir === 'rtl' ? 'left-start' : 'right-start'}
        offsetMainAxis={4}
        onToggle={setSubmenuOpen}
        onMouseEnter={() => closeSubmenu.cancel()}
        onMouseLeave={() => closeSubmenu.schedule()}
        onBlur={(event) => {
          const next = event.relatedTarget
          if (next instanceof Node && (root.current?.el?.contains(next) || event.currentTarget.contains(next))) return
          setSubmenuOpen(false)
        }}
      >{slots.submenu}</M3Menu> : null}
    </>
  )
}, {
  slots: { Leading, Trailing, Submenu },
})
