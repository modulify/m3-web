import { useState } from 'react'

import { M3Icon } from '@/components/icon'
import { M3TextField } from '@/components/text-field'

import { localize, useStorybookLocale } from '../../i18n'

const TextFieldExamples = () => {
  const text = localize(useStorybookLocale(), {
    'en-US': { about: 'About', email: 'E-mail' },
    'ru-RU': { about: 'О себе', email: 'Электронная почта' },
  })
  const [filled, setFilled] = useState('')
  const [outlined, setOutlined] = useState('')
  const [multiline, setMultiline] = useState('')
  const [multilineOutlined, setMultilineOutlined] = useState('')

  return (
    <>
      <div style={{ marginBottom: '16px' }}>
        <M3TextField
          value={filled}
          label={text.email}
          onUpdate={setFilled}
        >
          <M3TextField.LeadingIcon>
            <M3Icon name="mail" />
          </M3TextField.LeadingIcon>
        </M3TextField>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <M3TextField
          value={outlined}
          label={text.email}
          outlined={true}
          onUpdate={setOutlined}
        >
          <M3TextField.LeadingIcon>
            <M3Icon name="mail" />
          </M3TextField.LeadingIcon>
        </M3TextField>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <M3TextField
          value={multiline}
          label={text.about}
          multiline={true}
          onUpdate={setMultiline}
        />
      </div>

      <div>
        <M3TextField
          value={multilineOutlined}
          label={text.about}
          multiline={true}
          outlined={true}
          onUpdate={setMultilineOutlined}
        />
      </div>
    </>
  )
}

export default TextFieldExamples
