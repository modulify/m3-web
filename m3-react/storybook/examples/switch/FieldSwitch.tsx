import type { FC } from 'react'

import { M3Switch } from '@/components/switch'

import { useState } from 'react'

import makeId from '@/utils/id'
import { toClassName } from '@/utils/styling'

const FieldSwitch: FC<{
  className?: string;
  label?: string;
  disabled?: boolean
}> = ({
  className = '',
  label = '',
  disabled = false,
}) => {
  const id = makeId('m3-switch')
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

export default FieldSwitch
