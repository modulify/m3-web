import type { FC } from 'react'

import { M3Button } from '@/components/button'
import { M3RichTooltip } from '@/components/rich-tooltip'

import { useM3PopperCloserEffect } from '@/components/popper'
import { useTarget } from '@/hooks'

const DeleteTooltip: FC = () => {
  const [target, setTarget] = useTarget()
  const tooltipId = 'delete-tooltip-description'

  return (
    <>
      <M3Button effects={[setTarget]} aria-describedby={tooltipId}>
        Delete
      </M3Button>

      <M3RichTooltip id={tooltipId} target={target} hideOnMissClick={true}>
        <M3RichTooltip.Heading>
          Deleting item
        </M3RichTooltip.Heading>

        This action can not be undone

        <M3RichTooltip.Footer>
          <M3Button appearance="text" effects={[useM3PopperCloserEffect()]}>
            Proceed
          </M3Button>

          <M3Button appearance="text" effects={[useM3PopperCloserEffect()]}>
            Cancel
          </M3Button>
        </M3RichTooltip.Footer>
      </M3RichTooltip>
    </>
  )
}

export default DeleteTooltip
