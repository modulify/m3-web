import type { FC } from 'react'

import { M3Button } from '@/components/button'
import { M3RichTooltip } from '@/components/rich-tooltip'

import {
  useM3PopperCloserEffect,
  useM3PopperTarget,
} from '@/components/popper'

const DeleteTooltip: FC = () => {
  const [target, setTarget] = useM3PopperTarget()

  return (
    <>
      <M3Button effects={[setTarget]}>
        Delete
      </M3Button>

      <M3RichTooltip target={target} hideOnMissClick={true}>
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
