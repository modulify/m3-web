import type {
  CSSProperties,
  FC,
} from 'react'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'
import {
  M3Navigation,
  M3NavigationTab,
} from '@/components/navigation'
import { M3Surface } from '@/components/surface'
import {
  raf,
  wait,
} from '@modulify/m3-foundation/lib/surface/orchestration'
import {
  m3MotionDurations,
  m3MotionEasings,
} from '@modulify/m3-foundation/lib/motion'
import { useStateRef } from '@/components/surface/orchestration/useStateRef'
import { toClassName } from '@/utils/styling'

const DIALOG_TRANSITION_MS = m3MotionDurations.medium2
const DIALOG_TRANSITION_EASING = m3MotionEasings.standard
const DIALOG_ENTRY_OFFSET_PX = 24
const DIALOG_Z_INDEX_BASE = 560
const DIALOG_Z_INDEX_STEP = 40

type NavTab = 'inbox' | 'boards' | 'archive' | 'lab'

type DialogSpec = {
  id: string;
  width: number;
  rounding: number;
  description: string;
}

const dialogChain: DialogSpec[] = [{
  id: 'dialog-1',
  width: 720,
  rounding: 28,
  description: 'First layer in the chain. It opens dialog 2.',
}, {
  id: 'dialog-2',
  width: 620,
  rounding: 26,
  description: 'Second layer keeps the same controls and opens the next dialog.',
}, {
  id: 'dialog-3',
  width: 520,
  rounding: 24,
  description: 'Third layer opens the final nested dialog.',
}, {
  id: 'dialog-4',
  width: 440,
  rounding: 22,
  description: 'Final layer in this scenario: close only, no next dialog action.',
}]

const SurfaceNestedDialogsChain: FC = () => {
  const [activeNavTab, setActiveNavTab] = useStateRef<NavTab>('inbox')
  const [dialogMounted, setDialogMounted, dialogMountedRef] = useStateRef<boolean[]>(
    Array.from({ length: dialogChain.length }, () => false)
  )
  const [dialogVisible, setDialogVisible] = useStateRef<boolean[]>(
    Array.from({ length: dialogChain.length }, () => false)
  )

  const chainOpened = dialogMounted.some(Boolean)

  const topDialogLevel = (() => {
    for (let index = dialogChain.length - 1; index >= 0; index -= 1) {
      if (dialogMounted[index]) {
        return index
      }
    }

    return -1
  })()

  const hasNextDialog = (level: number) => level < dialogChain.length - 1
  const isTopDialog = (level: number) => topDialogLevel === level

  const dialogMode = (level: number): 'standard' | 'modal' => {
    return isTopDialog(level) ? 'modal' : 'standard'
  }

  const dialogZIndex = (level: number) => DIALOG_Z_INDEX_BASE + (level * DIALOG_Z_INDEX_STEP)

  const dialogElevation = (level: number) => Math.min(5, 2 + level)

  const dialogInlineStyle = (level: number): CSSProperties => {
    const visible = dialogVisible[level]

    return {
      position: 'fixed',
      top: '50%',
      left: '50%',
      zIndex: dialogZIndex(level),
      opacity: visible ? 1 : 0,
      transform: visible
        ? 'translate(-50%, -50%)'
        : `translate(-50%, calc(-50% + ${DIALOG_ENTRY_OFFSET_PX}px))`,
      transition: `opacity ${DIALOG_TRANSITION_MS}ms ${DIALOG_TRANSITION_EASING}, transform ${DIALOG_TRANSITION_MS}ms ${DIALOG_TRANSITION_EASING}`,
      pointerEvents: visible ? 'auto' : 'none',
    }
  }

  const openDialog = async (level: number) => {
    if (level < 0 || level >= dialogChain.length || dialogMountedRef.current[level]) {
      return
    }

    if (level > 0 && !dialogMountedRef.current[level - 1]) {
      return
    }

    setDialogMounted((previous) => {
      const next = [...previous]
      next[level] = true
      return next
    })

    setDialogVisible((previous) => {
      const next = [...previous]
      next[level] = false
      return next
    })

    await raf()

    setDialogVisible((previous) => {
      const next = [...previous]
      next[level] = true
      return next
    })
  }

  const closeFrom = async (level: number) => {
    if (level < 0 || level >= dialogChain.length) {
      return
    }

    let hasMountedDialog = false
    for (let index = level; index < dialogChain.length; index += 1) {
      if (dialogMountedRef.current[index]) {
        hasMountedDialog = true
        break
      }
    }

    if (!hasMountedDialog) {
      return
    }

    setDialogVisible((previous) => {
      const next = [...previous]

      for (let index = dialogChain.length - 1; index >= level; index -= 1) {
        if (dialogMountedRef.current[index]) {
          next[index] = false
        }
      }

      return next
    })

    await wait(DIALOG_TRANSITION_MS)

    setDialogMounted((previous) => {
      const next = [...previous]

      for (let index = level; index < dialogChain.length; index += 1) {
        next[index] = false
      }

      return next
    })

    setDialogVisible((previous) => {
      const next = [...previous]

      for (let index = level; index < dialogChain.length; index += 1) {
        next[index] = false
      }

      return next
    })
  }

  return (
    <div
      className="surface-dialog-chain"
      data-top-level={String(topDialogLevel)}
    >
      <M3Surface
        className="surface-dialog-chain__topbar"
        fillHeight={false}
        height={72}
        variant="surface-container"
        elevation={0}
      >
        <div className="surface-dialog-chain__topbar-content">
          <div>
            <strong>Surface orchestration: nested dialogs chain</strong>
            <p>Rail layout opens a nested dialog chain with one active scrim on the topmost dialog.</p>
          </div>

          <M3Button
            appearance="filled"
            disabled={chainOpened}
            data-testid="surface-dialog-chain-open-root"
            onClick={() => void openDialog(0)}
          >
            {chainOpened ? 'Dialog chain is open' : 'Open dialog chain'}
          </M3Button>
        </div>
      </M3Surface>

      <M3Navigation
        className="surface-dialog-chain__nav"
        appearance="rail"
        alignment="top"
      >
        <M3NavigationTab
          label="Inbox"
          active={activeNavTab === 'inbox'}
          onNavigate={() => setActiveNavTab('inbox')}
        >
          <M3Icon name="inbox" />
        </M3NavigationTab>

        <M3NavigationTab
          label="Boards"
          active={activeNavTab === 'boards'}
          onNavigate={() => setActiveNavTab('boards')}
        >
          <M3Icon name="dashboard" />
        </M3NavigationTab>

        <M3NavigationTab
          label="Archive"
          active={activeNavTab === 'archive'}
          onNavigate={() => setActiveNavTab('archive')}
        >
          <M3Icon name="archive" />
        </M3NavigationTab>

        <M3NavigationTab
          label="Lab"
          active={activeNavTab === 'lab'}
          onNavigate={() => setActiveNavTab('lab')}
        >
          <M3Icon name="science" />
        </M3NavigationTab>
      </M3Navigation>

      <div className="surface-dialog-chain__body">
        <div className="surface-dialog-chain__workspace">
          <M3Surface
            className="surface-dialog-chain__workspace-intro"
            fillHeight={false}
            height={124}
            rounding={20}
            variant="surface-container-lowest"
            elevation={0}
          >
            <h3>Workspace</h3>
            <p>Page composition stays stable while dialogs are stacked progressively.</p>
          </M3Surface>

          <M3Surface
            className="surface-dialog-chain__canvas"
            rounding={20}
            variant="surface-container-low"
            elevation={0}
          >
            <h4>Background content</h4>
            <p>Open dialog 1 from top action, then continue through the chain.</p>
          </M3Surface>
        </div>
      </div>

      {dialogChain.map((dialog, level) => {
        if (!dialogMounted[level]) {
          return null
        }

        return (
          <M3Surface
            key={dialog.id}
            className={toClassName([
              'surface-dialog-chain__dialog',
              `surface-dialog-chain__dialog_level-${level + 1}`,
            ])}
            mode={dialogMode(level)}
            shown={dialogMounted[level]}
            anchor="center"
            fillWidth={false}
            fillHeight={false}
            width={dialog.width}
            insetTop={24}
            insetBottom={24}
            rounding={dialog.rounding}
            transitionMs={DIALOG_TRANSITION_MS}
            transitionTiming={DIALOG_TRANSITION_EASING}
            zIndex={dialogZIndex(level)}
            variant="surface-container-highest"
            elevation={dialogElevation(level)}
            overflow="visible"
            style={dialogInlineStyle(level)}
            data-testid={`surface-dialog-chain-level-${level + 1}`}
            onDismiss={() => void closeFrom(level)}
          >
            <div className="surface-dialog-chain__dialog-head">
              <h3>Dialog {level + 1} of {dialogChain.length}</h3>

              <M3IconButton
                appearance="standard"
                aria-label={`Close dialog ${level + 1}`}
                onClick={() => void closeFrom(level)}
              >
                <M3Icon name="close" />
              </M3IconButton>
            </div>

            <p>{dialog.description}</p>

            <div className="surface-dialog-chain__dialog-actions">
              <M3Button
                appearance="text"
                data-testid={`surface-dialog-chain-close-${level + 1}`}
                onClick={() => void closeFrom(level)}
              >
                Close
              </M3Button>

              {hasNextDialog(level) ? (
                <M3Button
                  appearance="filled"
                  disabled={dialogMounted[level + 1]}
                  data-testid={`surface-dialog-chain-open-next-${level + 1}`}
                  onClick={() => void openDialog(level + 1)}
                >
                  Open dialog {level + 2}
                </M3Button>
              ) : null}
            </div>
          </M3Surface>
        )
      })}
    </div>
  )
}

export default SurfaceNestedDialogsChain
