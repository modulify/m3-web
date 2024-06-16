import type { FC } from 'react'

import { M3Button } from '@/components/button'
import { M3Dialog } from '@/components/dialog'
import { M3Icon } from '@/components/icon'

import { useState } from 'react'

const DialogConfirmation: FC = () => {
  const [opened, setOpened] = useState(false)

  return (
    <>
      <M3Button
        appearance="tonal"
        onClick={() => setOpened(true)}
      >
        Delete
      </M3Button>

      <M3Dialog
        opened={opened}
        role="dialog"
        aria-live="assertive"
        onToggle={setOpened}
      >
        <M3Dialog.Icon>
          <M3Icon name="delete" appearance="outlined" />
        </M3Dialog.Icon>

        <M3Dialog.Header>
          <h3>Permanently delete?</h3>
        </M3Dialog.Header>

        Deleting the selected messages will also remove them from all synced devices.

        <M3Dialog.Footer>
          <M3Button
            appearance="text"
            onClick={() => setOpened(false)}
          >
            Cancel
          </M3Button>

          <M3Button
            appearance="tonal"
            onClick={() => setOpened(false)}
          >
            Delete
          </M3Button>
        </M3Dialog.Footer>
      </M3Dialog>
    </>
  )
}

export default DialogConfirmation
