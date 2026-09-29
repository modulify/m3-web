import type { FC } from 'react'

import type { StorybookLocale } from '../../i18n'

import { useState } from 'react'

import { M3Button } from '@/components/button'
import { M3RichTooltip } from '@/components/rich-tooltip'

import { localize } from '../../i18n'

const ShortcutTooltip: FC<{ locale: StorybookLocale }> = ({ locale }) => {
  const [target, setTarget] = useState<HTMLElement | null>(null)
  const tooltipId = 'shortcut-tooltip-description'
  const text = localize(locale, {
    'en-US': { description: <>Press <strong>G</strong>, then <strong>I</strong> to open the inbox from anywhere in the workspace.</>, heading: 'Jump to inbox', trigger: 'Keyboard shortcut' },
    'ru-RU': { description: <>Нажмите <strong>G</strong>, затем <strong>I</strong>, чтобы открыть входящие из любой части рабочего пространства.</>, heading: 'Перейти к входящим', trigger: 'Сочетание клавиш' },
  })

  return (
    <>
      <span ref={setTarget} style={{ display: 'inline-block' }}>
        <M3Button appearance="text" aria-describedby={tooltipId}>
          {text.trigger}
        </M3Button>
      </span>

      <M3RichTooltip id={tooltipId} target={target} hideOnMissClick={true}>
        <M3RichTooltip.Heading>
          {text.heading}
        </M3RichTooltip.Heading>

        <div>{text.description}</div>
      </M3RichTooltip>
    </>
  )
}

export default ShortcutTooltip
