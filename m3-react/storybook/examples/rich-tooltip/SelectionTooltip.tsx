import type { FC } from 'react'

import type { StorybookLocale } from '../../i18n'

import { useState } from 'react'

import { M3Button } from '@/components/button'
import { M3RichTooltip } from '@/components/rich-tooltip'

import { useM3PopperCloserEffect } from '@/components/popper'

import { localize } from '../../i18n'

const SelectionTooltip: FC<{ locale: StorybookLocale }> = ({ locale }) => {
  const [target, setTarget] = useState<HTMLElement | null>(null)
  const tooltipId = 'selection-tooltip-description'
  const text = localize(locale, {
    'en-US': { apply: 'Apply', description: 'Continue editing the selected items or apply labels to them.', edit: 'Continue', heading: '3 items selected', review: 'Review selection' },
    'ru-RU': { apply: 'Применить', description: 'Продолжите редактирование выбранных элементов или примените к ним метки.', edit: 'Продолжить', heading: 'Выбрано 3 элемента', review: 'Проверить выбор' },
  })

  return (
    <>
      <span ref={setTarget} style={{ display: 'inline-block' }}>
        <M3Button aria-describedby={tooltipId}>
          {text.review}
        </M3Button>
      </span>

      <M3RichTooltip id={tooltipId} target={target} hideOnMissClick={true}>
        <M3RichTooltip.Heading>
          {text.heading}
        </M3RichTooltip.Heading>

        <div>{text.description}</div>

        <M3RichTooltip.Footer>
          <M3Button appearance="text" effects={[useM3PopperCloserEffect()]}>
            {text.edit}
          </M3Button>

          <M3Button appearance="text" effects={[useM3PopperCloserEffect()]}>
            {text.apply}
          </M3Button>
        </M3RichTooltip.Footer>
      </M3RichTooltip>
    </>
  )
}

export default SelectionTooltip
