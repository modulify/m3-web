declare module '*.svg' {
  import type { DefineComponent, SVGAttributes } from 'vue'

  const sprite: DefineComponent<
    NonNullable<SVGAttributes>,
    NonNullable<unknown>,
    unknown
  >

  // noinspection JSUnusedGlobalSymbols
  export default sprite
}
