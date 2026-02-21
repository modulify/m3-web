import type {
  ForwardRefRenderFunction,
  HTMLAttributes,
} from 'react'

import type {
  Clickable,
  Focusable,
} from '@modulify/m3-foundation'

import {
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react'

type RootElement = HTMLAnchorElement | HTMLButtonElement

export interface M3LinkProps extends HTMLAttributes<RootElement> {
  type?: HTMLButtonElement['type'];
  href?: string;
}

export interface M3LinkMethods extends Clickable, Focusable {
  el (): HTMLElement | null;
}

const M3Link: ForwardRefRenderFunction<
  M3LinkMethods,
  M3LinkProps
> = ({
  type = 'button',
  href = '',
  children = [],
  ...attrs
}, ref) => {
  const root = useRef<RootElement | null>(null)

  const setAnchor = (el: HTMLAnchorElement | null) => {
    root.current = el
  }

  const setButton = (el: HTMLButtonElement | null) => {
    root.current = el
  }

  useImperativeHandle(ref, () => ({
    el: () => root.current,
    click: () => root.current?.click(),
    focus: () => root.current?.focus(),
    blur: () => root.current?.blur(),
  }))

  return href.length > 0
    ? (
      <a
        ref={setAnchor}
        href={href}
        {...attrs}
      >
        {children}
      </a>
    )
    : (
      <button
        ref={setButton}
        type={type}
        {...attrs}
      >
        {children}
      </button>
    )
}

export default forwardRef(M3Link)
