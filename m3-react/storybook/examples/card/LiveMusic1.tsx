import type { FC } from 'react'

import { M3Card } from '@/components/card'

const LiveMusic1: FC<{
  interactive?: boolean
}> = ({ interactive = false }) => (
  <M3Card interactive={interactive}>
    <M3Card.Media>
      <img src="../../assets/piano-640x427.jpg" alt=""/>
    </M3Card.Media>

    <M3Card.Heading>
      <h3 className="mb-0">
        Live music coming soon to The Hideout
      </h3>
    </M3Card.Heading>

    Watch exclusive live performances at The Hideout every saturday at 7 p.m.
  </M3Card>
)

export default LiveMusic1