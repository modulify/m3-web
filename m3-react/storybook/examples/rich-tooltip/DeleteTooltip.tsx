import type { FC } from 'react'

import type { StorybookLocale } from '../../i18n'

import { M3Button } from '@/components/button'
import { M3RichTooltip } from '@/components/rich-tooltip'

import { useM3PopperCloserEffect } from '@/components/popper'
import { useTarget } from '@/hooks'

import { localize } from '../../i18n'

const DeleteTooltip: FC<{ locale: StorybookLocale }> = ({ locale }) => {
  const [target, setTarget] = useTarget()
  const tooltipId = 'delete-tooltip-description'
  const text = localize(locale, {
    'en-US': { cancel: 'Cancel', confirm: 'Delete', delete: 'Delete', description: 'The item will move to Trash, where you can restore it.', heading: 'Delete item?' },
    'ru-RU': { cancel: 'Отмена', confirm: 'Удалить', delete: 'Удалить', description: 'Элемент переместится в корзину, откуда его можно восстановить.', heading: 'Удалить элемент?' },
  })

  return (
    <>
      <M3Button effects={[setTarget]} aria-describedby={tooltipId}>
        {text.delete}
      </M3Button>

      <M3RichTooltip id={tooltipId} target={target} hideOnMissClick={true}>
        <M3RichTooltip.Heading>
          {text.heading}
        </M3RichTooltip.Heading>

        <div>{text.description}</div>

        <M3RichTooltip.Footer>
          <M3Button appearance="text" effects={[useM3PopperCloserEffect()]}>
            {text.confirm}
          </M3Button>

          <M3Button appearance="text" effects={[useM3PopperCloserEffect()]}>
            {text.cancel}
          </M3Button>
        </M3RichTooltip.Footer>
      </M3RichTooltip>
    </>
  )
}

export default DeleteTooltip
