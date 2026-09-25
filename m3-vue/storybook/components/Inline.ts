import type { Component } from 'vue'
import type { ElementType, ReactNode } from 'react'
import type { Root } from 'react-dom/client'

import { createApp } from 'vue'
import { createRoot } from 'react-dom/client'
import { h } from 'vue'
import React from 'react'
import { v4 } from 'uuid'

interface InlineProps {
  is: Component;
  children?: ReactNode;
  tag?: ElementType;
  [prop: string]: unknown;
}

interface MountInlineAppOptions {
  appIdPrefix: string;
  children?: ReactNode;
  is: Component;
  props: Record<string, unknown>;
  root: Element;
}

const normalizeIdSegment = (value: string): string => {
  return value.replace(/[^a-zA-Z0-9_-]/g, '')
}

const buildInlineIdPrefix = (reactId: string, uuid: string): string => {
  return `m3-inline-${normalizeIdSegment(reactId)}-${normalizeIdSegment(uuid)}-`
}

const mountInlineApp = ({
  appIdPrefix,
  children,
  is,
  props,
  root,
}: MountInlineAppOptions) => {
  const id = v4()
  let reactRoot: Root | null = null

  const app = createApp({
    mounted () {
      if (children) {
        const container = document.getElementById(id)

        if (container) {
          reactRoot = createRoot(container)
          reactRoot.render(React.createElement(React.Fragment, {}, children))
        }
      }
    },

    render: () => h(is, props),
  })

  app.config.idPrefix = appIdPrefix
  app.mount(root)

  return () => {
    reactRoot?.unmount()
    app.unmount()
  }
}

const Inline = ({ is, children, tag, ...props }: InlineProps) => {
  const ref = React.useRef<HTMLElement | null>(null)
  const reactId = React.useId()
  const uuidRef = React.useRef(v4())
  const appIdPrefix = React.useMemo(
    () => buildInlineIdPrefix(reactId, uuidRef.current),
    [reactId]
  )

  React.useEffect(() => {
    if (!ref.current) {
      return
    }

    return mountInlineApp({
      appIdPrefix,
      children,
      is,
      props,
      root: ref.current,
    })
  })

  return React.createElement(tag ?? 'div', {
    className: 'sb-unstyled',
    ref,
  })
}

export default Inline
