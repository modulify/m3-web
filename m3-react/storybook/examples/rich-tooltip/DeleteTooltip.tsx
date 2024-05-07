import type { FC } from 'react'

import { M3Button } from '@/components/button'
import { M3RichTooltip } from '@/components/rich-tooltip'

import {
  useState,
} from 'react'

const DeleteTooltip: FC = () => {
  const [target, setTarget] = useState<HTMLElement | null>(null)

  return (
    <span ref={setTarget} style={{ display: 'inline-block' }}>
      <M3Button>
        Delete
      </M3Button>

      <M3RichTooltip target={target} hideOnMissClick={true}>
        <M3RichTooltip.Heading>
          Deleting item
        </M3RichTooltip.Heading>

        This action can not be undone

        <M3RichTooltip.Footer>
          <M3Button appearance="text">
            Proceed
          </M3Button>

          <M3Button appearance="text">
            Cancel
          </M3Button>
        </M3RichTooltip.Footer>
      </M3RichTooltip>
    </span>
  )
}

export default DeleteTooltip
