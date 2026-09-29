import type { FC } from 'react'

import type { StorybookLocale } from '../../i18n'

import { useState } from 'react'

import { M3Button } from '@/components/button'
import { M3Dialog } from '@/components/dialog'
import { M3Icon } from '@/components/icon'

import { localize } from '../../i18n'

interface DialogConfirmationProps {
  locale: StorybookLocale;
}

const messages = {
  'en-US': {
    cancel: 'Cancel',
    delete: 'Delete',
    description: 'Deleting the selected messages will also remove them from all synced devices.',
    title: 'Permanently delete?',
  },
  'ru-RU': {
    cancel: 'Отмена',
    delete: 'Удалить',
    description: 'Выбранные сообщения также будут удалены со всех синхронизированных устройств.',
    title: 'Удалить навсегда?',
  },
}

const DialogConfirmation: FC<DialogConfirmationProps> = ({ locale }) => {
  const [opened, setOpened] = useState(false)
  const dialogTitleId = 'dialog-confirmation-title'
  const dialogDescriptionId = 'dialog-confirmation-description'
  const text = localize(locale, messages)

  return (
    <>
      <M3Button
        appearance="tonal"
        onClick={() => setOpened(true)}
      >
        {text.delete}
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
          <h3 id={dialogTitleId}>{text.title}</h3>
        </M3Dialog.Header>

        <p id={dialogDescriptionId}>
          {text.description}
        </p>

        <M3Dialog.Footer>
          <M3Button
            appearance="text"
            onClick={() => setOpened(false)}
          >
            {text.cancel}
          </M3Button>

          <M3Button
            appearance="tonal"
            onClick={() => setOpened(false)}
          >
            {text.delete}
          </M3Button>
        </M3Dialog.Footer>
      </M3Dialog>
    </>
  )
}

export default DialogConfirmation
