import type { FC } from 'react'

import { M3Button } from '@/components/button'
import { useM3PopperCloserEffect } from '@/components/popper'
import { M3RichTooltip } from '@/components/rich-tooltip'

import { useState } from 'react'

const SelectionTooltip: FC = () => {
  const [target, setTarget] = useState<HTMLElement | null>(null)
  const tooltipId = 'selection-tooltip-description'

  return (
    <>
      <span ref={setTarget} style={{ display: 'inline-block' }}>
        <M3Button aria-describedby={tooltipId}>
          Review selection
        </M3Button>
      </span>

      <M3RichTooltip id={tooltipId} target={target} hideOnMissClick={true}>
        <M3RichTooltip.Heading>
          3 items selected
        </M3RichTooltip.Heading>

        Continue with a bulk action or refine the selection before applying changes.

        <M3RichTooltip.Footer>
          <M3Button appearance="text" effects={[useM3PopperCloserEffect()]}>
            Keep editing
          </M3Button>

          <M3Button appearance="text" effects={[useM3PopperCloserEffect()]}>
            Apply labels
          </M3Button>
        </M3RichTooltip.Footer>
      </M3RichTooltip>
    </>
  )
}

export default SelectionTooltip
