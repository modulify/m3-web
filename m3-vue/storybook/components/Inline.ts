import React from 'react'
import ReactDOM from 'react-dom'

import { v4 } from 'uuid'

import { createApp, h } from 'vue'

const normalizeIdSegment = (value: string): string => {
  return value.replace(/[^a-zA-Z0-9_-]/g, '')
}

const buildInlineIdPrefix = (reactId: string, uuid: string): string => {
  return `m3-inline-${normalizeIdSegment(reactId)}-${normalizeIdSegment(uuid)}-`
}

const mountInlineApp = ({ appIdPrefix, children, is, props, root }) => {
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

export default ({ is, children, tag, ...props }) => {
  const ref = React.useRef(null)
  const reactId = React.useId()
  const uuidRef = React.useRef(v4())
  const appIdPrefix = React.useMemo(
    () => buildInlineIdPrefix(reactId, uuidRef.current),
    [reactId]
  )

  React.useEffect(() => {
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
