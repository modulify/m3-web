import type {
  FC,
  SVGAttributes,
} from 'react'

import type { Code } from './codes'

import provider from './CountryFlagProvider'

export interface CountryFlagProps extends SVGAttributes<SVGSVGElement> {
  code: Code;
}

const CountryFlag: FC<CountryFlagProps> = ({
  code,
  style,
  ...attrs
}) => {
  const Sprite = provider.get(code)

  return (
    <Sprite
      {...attrs}
      style={{
        ...style,
        borderRadius: '50%',
      }}
    />
  )
}

export default CountryFlag
