import type {
  CSSProperties,
  FC,
} from 'react'

import { M3Button } from '@/components/button'
import { M3Surface, M3SurfacePanel } from '@/components/surface'

import { useState } from 'react'

const panelStyle = {
  padding: '18px',
} satisfies CSSProperties

const SurfaceWorkspaceDialog: FC = () => {
  const [opened, setOpened] = useState(false)

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
          <strong style={{ display: 'block', marginBottom: '6px' }}>Scenario: workspace confirmation dialog</strong>
          <span style={{ fontSize: '13px', opacity: 0.82 }}>A blocking decision interrupts the current workspace without replacing the layout beneath it.</span>
        </div>

        <M3Button onClick={() => setOpened(true)}>
          Archive project
        </M3Button>
      </M3SurfacePanel>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginTop: '16px' }}>
        <M3SurfacePanel rounding={20} variant="surface-container-lowest" elevation={0} style={panelStyle}>
          <h3 style={{ margin: '0 0 8px' }}>Workspace overview</h3>
          <p style={{ margin: 0 }}>Main content remains visible under the dialog, so the user keeps the surrounding context while confirming the action.</p>
        </M3SurfacePanel>

        <M3SurfacePanel rounding={20} variant="surface-container-low" elevation={1} style={panelStyle}>
          <h3 style={{ margin: '0 0 8px' }}>Activity</h3>
          <p style={{ margin: 0 }}>12 tasks updated today</p>
        </M3SurfacePanel>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px', marginTop: '16px' }}>
        {['Roadmap', 'Assets', 'Owners'].map(label => (
          <M3SurfacePanel
            key={label}
            fillHeight={false}
            height={180}
            rounding={18}
            variant="surface-container-low"
            elevation={1}
            style={panelStyle}
          >
            <h3 style={{ margin: '0 0 8px' }}>{label}</h3>
            <p style={{ margin: 0 }}>Supporting surface inside the same workspace scene.</p>
          </M3SurfacePanel>
        ))}
      </div>

      <M3Surface
        mode="modal"
        shown={opened}
        anchor="center"
        fillWidth={false}
        fillHeight={false}
        width={520}
        insetTop={24}
        insetBottom={24}
        rounding={28}
        elevation={3}
        variant="surface-container-high"
        onToggle={setOpened}
        onDismiss={() => setOpened(false)}
        style={{ padding: '24px' }}
      >
        <h3 style={{ margin: '0 0 12px' }}>Archive this workspace?</h3>
        <p style={{ margin: '0 0 12px' }}>Archiving hides the project from active planning views but keeps its history available for reporting.</p>

        <M3SurfacePanel
          fillHeight={false}
          height={92}
          rounding={18}
          variant="surface-container"
          elevation={0}
          style={{ ...panelStyle, marginBottom: '16px' }}
        >
          Team members will retain read access until the workspace is restored.
        </M3SurfacePanel>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <M3Button appearance="text" onClick={() => setOpened(false)}>
            Cancel
          </M3Button>

          <M3Button appearance="filled" onClick={() => setOpened(false)}>
            Archive
          </M3Button>
        </div>
      </M3Surface>
    </div>
  )
}

export default SurfaceWorkspaceDialog
