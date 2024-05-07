import type { FC } from 'react'

import { M3Checkbox } from '@/components/checkbox'

import {
  Fragment,
  useCallback,
} from 'react'

import {
  useId,
  useRecord,
} from '@/hooks'

interface Option {
  label: string;
  value: string;
  subordinates?: Option[];
}

const CheckboxList: FC<{
  options: Option[];
}> = ({ options }) => {
  const id = useId(null, 'm3-checkbox-example')
  const state = useRecord({
    model: [] as string[],
  }, ['model'])

  const isSelected = useCallback((option: Option) => {
    return 'subordinates' in option
      ? option.subordinates.every((o) => state.model.includes(o.value))
      : state.model.includes(option.value)
  }, [])

  const isIndeterminate = useCallback((option: Option) => {
    return 'subordinates' in option
      && option.subordinates.some((o) => state.model.includes(o.value))
      && !isSelected(option)
  }, [])

  const toggle = useCallback((option: Option, checked: boolean) => {
    const values = (option.subordinates ?? []).map(o => o.value)

    if (checked) {
      state.model = [...state.model, ...values.filter(v => !state.model.includes(v))]
    } else {
      state.model = [...state.model.filter(v => !values.includes(v))]
    }
  }, [])

  return (
    <div className="m3-panel m3-panel_elevated-1">
      {options.map((o, i) =>
        o.subordinates?.length
          ? (
            <Fragment key={`option-${i}`}>
              <div className="flex-row">
                <M3Checkbox
                  id={`${id}-option-${i}`}
                  model={isSelected(o)}
                  indeterminate={isIndeterminate(o)}
                  onChange={(checked: boolean) => toggle(o, checked)}
                />

                <label htmlFor={`${id}-option-${i}`}>{o.label}</label>
              </div>

              <div className="pl-8">
                {o.subordinates.map((s, j) =>
                  <div key={`option-${i}-${j}`} className="flex-row">
                    <M3Checkbox
                      id={`${id}-option-${i}-${j}`}
                      model={state.model}
                      value={s.value}
                      onChange={(model: string[]) => state.model = model}
                    />

                    <label htmlFor={`${id}-option-${i}-${j}`}>{s.label}</label>
                  </div>
                )}
              </div>
            </Fragment>
          )
          : (
            <div key={`option-${i}`} className="flex-row">
              <M3Checkbox
                id={`${id}-option-${i}`}
                model={state.model}
                value={o.value}
                onChange={(model: string[]) => state.model = model}
              />

              <label htmlFor={`${id}-option-${i}`}>{o.label}</label>
            </div>
          )
      )}
    </div>
  )
}

export default CheckboxList