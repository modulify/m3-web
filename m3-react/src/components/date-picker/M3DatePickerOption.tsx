import type {
  ButtonHTMLAttributes,
  FC,
  ReactNode,
} from 'react'

import {
  useState,
} from 'react'

import { M3Ripple } from '@/components/ripple'
import { toClassName } from '@/utils/styling'

export type M3DatePickerOptionAppearance = 'circle' | 'pill'

interface M3DatePickerOptionProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'className' | 'onClick' | 'onSelect' | 'type'
> {
  appearance: M3DatePickerOptionAppearance;
  current?: boolean;
  selected?: boolean;
  outside?: boolean;
  inRange?: boolean;
  rangeStart?: boolean;
  rangeEnd?: boolean;
  children: ReactNode;
  onSelect: () => void;
}

const M3DatePickerOption: FC<M3DatePickerOptionProps> = ({
  appearance,
  current = false,
  selected = false,
  outside = false,
  inRange = false,
  rangeStart = false,
  rangeEnd = false,
  disabled = false,
  children,
  onSelect,
  ...attrs
}) => {
  const [root, setRoot] = useState<HTMLButtonElement | null>(null)

  return (
    <button
      {...attrs}
      ref={setRoot}
      type="button"
      disabled={disabled}
      className={toClassName({
        'm3-date-picker-option': true,
        [`m3-date-picker-option_${appearance}`]: true,
        'm3-date-picker-option_current': current,
        'm3-date-picker-option_selected': selected,
        'm3-date-picker-option_outside': outside,
        'm3-date-picker-option_in-range': inRange,
        'm3-date-picker-option_range-start': rangeStart,
        'm3-date-picker-option_range-end': rangeEnd,
      })}
      aria-current={current ? 'date' : attrs['aria-current']}
      onClick={disabled ? undefined : onSelect}
    >
      <M3Ripple owner={root} />
      <span className="m3-date-picker-option__content">
        {children}
      </span>
    </button>
  )
}

export default M3DatePickerOption
