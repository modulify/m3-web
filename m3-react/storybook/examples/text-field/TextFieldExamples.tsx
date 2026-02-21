import { M3Icon } from '@/components/icon'
import { M3TextField } from '@/components/text-field'

import { useState } from 'react'

const TextFieldExamples = () => {
  const [filled, setFilled] = useState('')
  const [outlined, setOutlined] = useState('')
  const [multiline, setMultiline] = useState('')
  const [multilineOutlined, setMultilineOutlined] = useState('')

  return (
    <>
      <div style={{ marginBottom: '16px' }}>
        <M3TextField
          value={filled}
          label="E-mail"
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
          label="E-mail"
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
          label="About"
          multiline={true}
          onUpdate={setMultiline}
        />
      </div>

      <div>
        <M3TextField
          value={multilineOutlined}
          label="About"
          multiline={true}
          outlined={true}
          onUpdate={setMultilineOutlined}
        />
      </div>
    </>
  )
}

export default TextFieldExamples
