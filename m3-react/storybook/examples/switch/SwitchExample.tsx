import type { FC } from 'react'

import { M3Switch } from '@/components/switch'

import { useState } from 'react'

import { toClassName } from '@/utils/styling'
import useId from '@/hooks/useId'

const SwitchExample: FC<{
  className?: string;
  label?: string;
  disabled?: boolean
}> = ({
  className = '',
  label = '',
  disabled = false,
}) => {
  const id = useId(null, 'm3-switch')
  const [checked, toggle] = useState(false)

  return (
    <div className={toClassName([className, 'flex-row'])}>
      {label.length > 0 ? (
        <label htmlFor={id} className="mr-2">
          {label}
        </label>
      ) : null}

      <M3Switch
        id={id}
        checked={checked}
        disabled={disabled}
        className="ml-auto"
        onToggle={toggle}
      />
    </div>
  )
}

export default SwitchExample
