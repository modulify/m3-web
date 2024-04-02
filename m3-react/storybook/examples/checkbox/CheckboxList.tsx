import type { FC } from 'react'

import { M3Checkbox } from '@/components/checkbox'

import {
  Fragment,
  useState,
} from 'react'

import makeId from '@/utils/id'

interface Option {
  label: string;
  value: string;
  subordinates?: Option[];
}

const CheckboxList: FC<{
  options: Option[];
}> = ({ options }) => {
  const id = makeId('m3-checkbox-example')

  const [model, setModel] = useState<string[]>([])

  const isSelected = (option: Option) => {
    return 'subordinates' in option
      ? option.subordinates.every((o) => model.includes(o.value))
      : model.includes(option.value)
  }

  const isIndeterminate = (option: Option) => {
    return 'subordinates' in option
      && option.subordinates.some((o) => model.includes(o.value))
      && !isSelected(option)
  }

  const toggle = (option: Option, checked: boolean) => {
    const values = (option.subordinates ?? []).map(o => o.value)

    if (checked) {
      setModel([...model, ...values.filter(v => !model.includes(v))])
    } else {
      setModel([...model.filter(v => !values.includes(v))])
    }
  }

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
                      model={model}
                      value={s.value}
                      onChange={setModel}
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
                model={model}
                value={o.value}
                onChange={setModel}
              />

              <label htmlFor={`${id}-option-${i}`}>{o.label}</label>
            </div>
          )
      )}
    </div>
  )
}

export default CheckboxList