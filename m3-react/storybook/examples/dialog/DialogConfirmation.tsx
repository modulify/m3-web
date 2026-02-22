import type { FC } from 'react'

import { M3Button } from '@/components/button'
import { M3Dialog } from '@/components/dialog'
import { M3Icon } from '@/components/icon'

import { useState } from 'react'

const DialogConfirmation: FC = () => {
  const [opened, setOpened] = useState(false)
  const dialogTitleId = 'dialog-confirmation-title'
  const dialogDescriptionId = 'dialog-confirmation-description'

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
        aria-modal="true"
        aria-labelledby={dialogTitleId}
        aria-describedby={dialogDescriptionId}
        onToggle={setOpened}
      >
        <M3Dialog.Icon>
          <M3Icon name="delete" appearance="outlined" />
        </M3Dialog.Icon>

        <M3Dialog.Header>
          <h3 id={dialogTitleId}>Permanently delete?</h3>
        </M3Dialog.Header>

        <p id={dialogDescriptionId}>
          Deleting the selected messages will also remove them from all synced devices.
        </p>

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
