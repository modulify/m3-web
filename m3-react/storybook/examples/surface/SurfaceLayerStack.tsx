import type { FC } from 'react'
import type { SnackbarHostMethods } from '@/components/snackbar'
import type { StorybookLocale } from '../../i18n'

import { useRef, useState } from 'react'

import { M3Popper } from '@/components/popper'
import { M3SnackbarHost } from '@/components/snackbar'
import { M3Surface } from '@/components/surface'

const copy = {
  'en-US': {
    title: 'UI layer stack',
    description: 'Open the first dialog, then its menu, snackbar, and second dialog. Escape closes the top interaction first.',
    open: 'Open first dialog',
    first: 'First dialog',
    second: 'Second dialog',
    menu: 'Open menu',
    menuAction: 'Menu action',
    snackbar: 'Show snackbar',
    snackbarMessage: 'Saved in the first dialog',
    next: 'Open second dialog',
    close: 'Close',
  },
  'ru-RU': {
    title: 'Стек слоёв интерфейса',
    description: 'Откройте первый диалог, затем его меню, snackbar и второй диалог. Escape закрывает верхнее взаимодействие первым.',
    open: 'Открыть первый диалог',
    first: 'Первый диалог',
    second: 'Второй диалог',
    menu: 'Открыть меню',
    menuAction: 'Пункт меню',
    snackbar: 'Показать snackbar',
    snackbarMessage: 'Сохранено в первом диалоге',
    next: 'Открыть второй диалог',
    close: 'Закрыть',
  },
}

const SurfaceLayerStack: FC<{ locale: StorybookLocale }> = ({ locale }) => {
  const text = copy[locale]
  const [first, setFirst] = useState(false)
  const [second, setSecond] = useState(false)
  const [menuTarget, setMenuTarget] = useState<HTMLButtonElement | null>(null)
  const snackbar = useRef<SnackbarHostMethods | null>(null)

  const closeFirst = () => {
    setSecond(false)
    setFirst(false)
    snackbar.current?.dismiss()
  }

  const dialogStyle = { display: 'grid', alignContent: 'start', gap: 16, padding: 24 }

  return <main style={{ minHeight: '100vh', padding: 32, background: 'var(--m3-sys-surface)' }}>
    <h1>{text.title}</h1>
    <p>{text.description}</p>
    <button onClick={() => setFirst(true)}>{text.open}</button>
    <M3SnackbarHost ref={snackbar} />

    <M3Surface mode="modal" shown={first} anchor="center" width={360} height={280} rounding={28} variant="surface-container-high" onToggle={shown => { if (!shown) closeFirst() }}>
      <div style={dialogStyle}>
        <h2>{text.first}</h2>
        <button ref={setMenuTarget}>{text.menu}</button>
        <M3Popper target={menuTarget} detachTimeout={null} animated>
          <button>{text.menuAction}</button>
        </M3Popper>
        <button onClick={() => { void snackbar.current?.show({ message: text.snackbarMessage, duration: null }) }}>{text.snackbar}</button>
        <button onClick={() => setSecond(true)}>{text.next}</button>
        <button onClick={closeFirst}>{text.close}</button>
      </div>
    </M3Surface>

    <M3Surface mode="modal" shown={second} anchor="center" width={320} height={180} rounding={28} variant="surface-container-high" onToggle={setSecond}>
      <div style={dialogStyle}>
        <h2>{text.second}</h2>
        <button onClick={() => setSecond(false)}>{text.close}</button>
      </div>
    </M3Surface>
  </main>
}

export default SurfaceLayerStack
