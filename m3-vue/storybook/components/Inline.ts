import type { Component } from 'vue'
import type { ElementType, ReactNode } from 'react'

import { createApp, h } from 'vue'
import React from 'react'
import ReactDOM from 'react-dom'
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

  const app = createApp({
    mounted () {
      if (children) {
        ReactDOM.render(
          React.createElement(React.Fragment, {}, children),
          document.getElementById(id)
        )
      }
    },

    render: () => h(is, props),
  })

  app.config.idPrefix = appIdPrefix
  app.mount(root)

  return () => app.unmount()
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
