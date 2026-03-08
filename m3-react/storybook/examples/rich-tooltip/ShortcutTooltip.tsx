import type { FC } from 'react'

import { M3Button } from '@/components/button'
import { M3RichTooltip } from '@/components/rich-tooltip'

import { useState } from 'react'

const ShortcutTooltip: FC = () => {
  const [target, setTarget] = useState<HTMLElement | null>(null)
  const tooltipId = 'shortcut-tooltip-description'

  return (
    <>
      <span ref={setTarget} style={{ display: 'inline-block' }}>
        <M3Button appearance="text" aria-describedby={tooltipId}>
          Keyboard shortcut
        </M3Button>
      </span>

      <M3RichTooltip id={tooltipId} target={target} hideOnMissClick={true}>
        <M3RichTooltip.Heading>
          Jump to inbox
        </M3RichTooltip.Heading>

        Press <strong>G</strong>, then <strong>I</strong> to open the inbox from anywhere in the workspace.
      </M3RichTooltip>
    </>
  )
}

export default ShortcutTooltip
