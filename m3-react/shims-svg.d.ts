declare module "*.svg?react" {
  import { FunctionComponent, SVGProps } from 'react'

  const sprite: FunctionComponent<SVGProps<SVGSVGElement>>

  export default sprite
}