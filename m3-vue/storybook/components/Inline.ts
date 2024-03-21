import React from 'react'
import ReactDOM from 'react-dom'

import { v4 } from 'uuid'

import { createApp, h } from 'vue'

export default ({ is, children, tag, ...props }) => {
  const ref = React.useRef(null)

  React.useEffect(() => {
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

    app.mount(ref.current)

    return () => app.unmount()
  })

  return React.createElement(tag ?? 'div', {
    className: 'sb-unstyled',
    ref,
  })
}
