# @modulify/m3-react

Material Design 3 components for React.

## Installation

```shell
yarn add @modulify/m3-react @modulify/m3-foundation
```

The package expects React, React DOM, `react-transition-group`, and
`react-transition-state` to be provided by the application. Import the shared
foundation stylesheet once in the application entrypoint:

```ts
import '@modulify/m3-foundation/styles.css'
```

Components remain available from the package root and can also be imported from
the dedicated components layer. Hooks are available from their own layer:

```tsx
import { M3Button } from '@modulify/m3-react/components'
import { useBreakpoint } from '@modulify/m3-react/hooks'

export const SaveButton = () => {
  const breakpoint = useBreakpoint()

  return (
    <M3Button appearance="filled">
      Save on {breakpoint.ge('medium') ? 'wide' : 'compact'} layout
    </M3Button>
  )
}
```
