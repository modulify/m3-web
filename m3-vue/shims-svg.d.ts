declare module '*.svg' {
  import type { DefineComponent, SVGAttributes } from 'vue'

  const component: DefineComponent<NonNullable<SVGAttributes>, NonNullable<unknown>, never>

  // noinspection JSUnusedGlobalSymbols
  export default component
}
