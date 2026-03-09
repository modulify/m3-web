import { M3Radio } from '@/components/radio'

import { useId } from '@/hooks'
import { useState } from 'react'

export interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  legend?: string;
  options: RadioOption[];
  invalid?: boolean;
}

const RadioGroup = ({
  legend = 'Selection',
  options,
  invalid = false,
}: RadioGroupProps) => {
  const name = useId(null, 'm3-radio-group')
  const [model, setModel] = useState(options[0]?.value)

  return (
    <fieldset style={{
      margin: 0,
      padding: 0,
      border: 'none',
      display: 'grid',
      gap: '12px',
      minWidth: '280px',
    }}
    >
      <legend style={{
        padding: 0,
        marginBottom: '8px',
        fontSize: '14px',
        lineHeight: '20px',
        color: 'var(--m3-sys-on-surface-variant)',
      }}
      >
        {legend}
      </legend>

      {options.map(option => {
        const id = `${name}-${option.value}`

        return (
          <label
            key={option.value}
            htmlFor={id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <M3Radio
              id={id}
              name={name}
              model={model}
              value={option.value}
              invalid={invalid}
              disabled={option.disabled}
              onChange={setModel}
            />

            <span>{option.label}</span>
          </label>
        )
      })}
    </fieldset>
  )
}

export default RadioGroup
