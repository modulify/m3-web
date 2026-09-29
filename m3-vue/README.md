# @modulify/m3-vue

<p align="center"><img src="https://raw.githubusercontent.com/modulify/m3-web/main/m3-vue/assets/logo.png" alt="Modulify M3 Vue logo" width="128" /></p>

Material Design 3 components for Vue.

The logo is included in this package as `@modulify/m3-vue/assets/logo.svg`
and `@modulify/m3-vue/assets/logo.png`.
[Artwork attribution and usage terms](assets/NOTICE.md).

## Installation

```shell
yarn add @modulify/m3-vue @modulify/m3-foundation
```

The package expects Vue and Vue Router to be provided by the application.
Import the shared foundation stylesheet once in the application entrypoint:

```ts
import '@modulify/m3-foundation/styles.css'
```

Components remain available from the package root and can also be imported from
the dedicated components layer. Public composables are available from their own
layer:

```vue
<script setup lang="ts">
import { M3Button } from '@modulify/m3-vue/components'
import { useBreakpoint } from '@modulify/m3-vue/composables'

const breakpoint = useBreakpoint()
</script>

<template>
  <M3Button appearance="filled">
    Save on {{ breakpoint.ge('medium') ? 'wide' : 'compact' }} layout
  </M3Button>
</template>
```
