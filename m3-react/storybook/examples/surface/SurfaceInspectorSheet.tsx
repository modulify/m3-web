import type {
  CSSProperties,
  FC,
} from 'react'
import type { M3SelectOption } from '@/components/select'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'
import { M3Select } from '@/components/select'
import { M3Surface, M3SurfacePanel } from '@/components/surface'
import { M3TextField } from '@/components/text-field'

import { useState } from 'react'

type Priority = 'low' | 'normal' | 'high'

const priorityOptions: Array<M3SelectOption<Priority>> = [{
  label: 'Low',
  value: 'low',
}, {
  label: 'Normal',
  value: 'normal',
}, {
  label: 'High',
  value: 'high',
}]

const panelStyle = {
  padding: '18px',
} satisfies CSSProperties

const SurfaceInspectorSheet: FC = () => {
  const [opened, setOpened] = useState(false)
  const [owner, setOwner] = useState('owner@example.com')
  const [priority, setPriority] = useState<Priority | null>('normal')
  const [notes, setNotes] = useState('Coordinate the release notes and schedule rollout approval.')

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, var(--m3-sys-surface) 0%, var(--m3-sys-surface-container-low) 100%)',
      color: 'var(--m3-sys-on-surface)',
      padding: '24px',
      boxSizing: 'border-box',
    }}
    >
      <M3SurfacePanel
        fillHeight={false}
        height={84}
        rounding={24}
        variant="surface-container"
        elevation={0}
        style={{ ...panelStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div>
          <strong style={{ display: 'block', marginBottom: '6px' }}>Scenario: inspector side sheet</strong>
          <span style={{ fontSize: '13px', opacity: 0.82 }}>A supplemental editing surface appears from the edge while the main dashboard stays visible.</span>
        </div>

        <M3Button appearance="tonal" onClick={() => setOpened(true)}>
          Open inspector
        </M3Button>
      </M3SurfacePanel>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px', marginTop: '16px' }}>
        {['Launch plan', 'Dependencies', 'Approvals'].map(label => (
          <M3SurfacePanel
            key={label}
            fillHeight={false}
            height={188}
            rounding={18}
            variant="surface-container-low"
            elevation={1}
            style={panelStyle}
          >
            <h3 style={{ margin: '0 0 8px' }}>{label}</h3>
            <p style={{ margin: 0 }}>Dashboard content keeps its place while the inspector surface is layered above it.</p>
          </M3SurfacePanel>
        ))}
      </div>

      <M3Surface
        mode="modal"
        shown={opened}
        anchor="end"
        fillWidth={false}
        width={360}
        insetTop={0}
        insetRight={0}
        insetBottom={0}
        roundingTopLeft={28}
        roundingBottomLeft={28}
        roundingTopRight={0}
        roundingBottomRight={0}
        elevation={2}
        variant="surface-container-high"
        overflow="auto"
        onToggle={setOpened}
        onDismiss={() => setOpened(false)}
        className="m3-side-sheet surface-inspector-sheet__sheet"
      >
        <header className="m3-side-sheet__header">
          <div className="m3-side-sheet__title">Release inspector</div>

          <div className="m3-side-sheet__affordance">
            <M3IconButton appearance="text" onClick={() => setOpened(false)}>
              <M3Icon name="close" />
            </M3IconButton>
          </div>
        </header>

        <div className="m3-side-sheet__content">
          <div style={{ display: 'grid', gap: '16px', width: '100%', padding: '0 24px 24px' }}>
            <p style={{ margin: 0 }}>Use the side sheet for supporting edits that should not replace the dashboard context.</p>

            <div style={{ display: 'grid', gap: '12px' }}>
              <M3TextField
                value={owner}
                label="Owner email"
                outlined={true}
                onUpdate={setOwner}
              />

              <M3Select<Priority>
                value={priority}
                label="Priority"
                options={priorityOptions}
                outlined={true}
                onUpdate={setPriority}
              />

              <M3TextField
                value={notes}
                label="Notes"
                outlined={true}
                multiline={true}
                onUpdate={setNotes}
              />
            </div>
          </div>
        </div>

        <footer className="m3-side-sheet__footer" style={{ justifyContent: 'flex-end' }}>
          <M3Button appearance="text" onClick={() => setOpened(false)}>
            Dismiss
          </M3Button>

          <M3Button appearance="filled" onClick={() => setOpened(false)}>
            Save changes
          </M3Button>
        </footer>
      </M3Surface>
    </div>
  )
}

export default SurfaceInspectorSheet
