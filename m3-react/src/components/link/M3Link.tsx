import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { HTMLAttributes } from 'react'
import type { Interactable } from '@modulify/m3-foundation/types/dom'
import type { Ref } from 'react'

import { useRef } from 'react'

import defineComponent from '@/utils/component'
import { useInteractable } from '@/hooks'

type RootElement = HTMLAnchorElement | HTMLButtonElement

export interface M3LinkProps extends HTMLAttributes<RootElement> {
  ref?: Ref<M3LinkExposed>;
  type?: HTMLButtonElement['type'];
  href?: string;
  target?: HTMLAnchorElement['target'];
  rel?: string;
}

export interface M3LinkExposed extends M3LinkMethods, ElementReference<RootElement> {}

export interface M3LinkMethods extends Interactable {}

export default defineComponent(function M3Link({
  ref: _ref,
  type = 'button',
  href = '',
  children = [],
  ...attrs
}: M3LinkProps, { expose }: ComponentSetupContext<M3LinkExposed>) {
  const root = useRef<RootElement | null>(null)
  const interactable = useInteractable(root)

  const setAnchor = (el: HTMLAnchorElement | null) => {
    root.current = el
  }

  const setButton = (el: HTMLButtonElement | null) => {
    root.current = el
  }

  expose(interactable)

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
})
