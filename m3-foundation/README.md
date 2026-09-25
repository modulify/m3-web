# @modulify/m3-foundation

CSS stylesheet, SCSS resources for Material Design v3 components.

## Installation

Using Yarn:

```shell
yarn add @modulify/m3-foundation
```

Using npm:

```shell
npm install @modulify/m3-foundation
```

## Styles

Import the complete compiled stylesheet once in the application entrypoint:

```ts
import '@modulify/m3-foundation/styles.css'
```

SCSS sources and component assets remain available below
`@modulify/m3-foundation/assets/` for applications that need to assemble a
custom stylesheet.

## Utilities and types

Runtime utilities are published as explicit package subpaths:

```ts
import { CalendarDay } from '@modulify/m3-foundation/lib/calendar'
import type { Appearance } from '@modulify/m3-foundation/types/components/button'
```
