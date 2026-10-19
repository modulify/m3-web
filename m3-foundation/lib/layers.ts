interface ModalEntry {
  host: HTMLElement;
  onEscape: () => void;
}

interface PopoverEntry {
  host: HTMLElement;
  onEscape: () => void;
}

interface LayerManager {
  modals: ModalEntry[];
  popovers: PopoverEntry[];
  listeners: AbortController;
}

const managers = new WeakMap<Document, LayerManager>()
export const LAYER_DEACTIVATED_EVENT = 'm3-layer-deactivated'

function managerFor(document: Document): LayerManager {
  const existing = managers.get(document)
  if (existing) return existing

  const manager: LayerManager = {
    modals: [],
    popovers: [],
    listeners: new AbortController(),
  }

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return

    const topModal = manager.modals.at(-1)
    let topPopover: PopoverEntry | undefined
    for (let index = manager.popovers.length - 1; index >= 0; index--) {
      const entry = manager.popovers[index]
      if (entry.host.isConnected
        && (topModal ? topModal.host.contains(entry.host) : !entry.host.closest('[data-m3-layer="modal"]'))) {
        topPopover = entry
        break
      }
    }
    const onEscape = topPopover?.onEscape ?? topModal?.onEscape
    if (!onEscape) return

    event.preventDefault()
    event.stopPropagation()
    onEscape()
  }, { capture: true, signal: manager.listeners.signal })

  managers.set(document, manager)
  return manager
}

function disposeEmpty(document: Document, manager: LayerManager) {
  if (manager.modals.length || manager.popovers.length) return
  manager.listeners.abort('UI layer manager disposed')
  managers.delete(document)
}

export function createLayerHost(document: Document): HTMLElement {
  const host = document.createElement('div')
  host.className = 'm3-layer'

  const feedback = document.createElement('div')
  feedback.className = 'm3-layer__feedback'
  const popovers = document.createElement('div')
  popovers.className = 'm3-layer__popovers'
  host.append(feedback, popovers)

  return host
}

export function mountLayerHost(host: HTMLElement, container: HTMLElement) {
  container.append(host)
}

export function setLayerModal(host: HTMLElement, modal: boolean) {
  host.dataset.m3Layer = modal ? 'modal' : 'base'
}

export function resolvePopoverContainer(target: Element | null, explicit?: string | HTMLElement): HTMLElement {
  const document = target?.ownerDocument ?? (typeof explicit === 'string' || !explicit ? globalThis.document : explicit.ownerDocument)

  if (explicit) {
    return (typeof explicit === 'string' ? document.querySelector<HTMLElement>(explicit) : explicit) ?? document.body
  }

  const layer = target?.closest<HTMLElement>('[data-m3-layer="modal"]')
  return layer?.querySelector<HTMLElement>(':scope > .m3-layer__popovers') ?? document.body
}

export function resolveFeedbackContainer(anchor: Element | null): HTMLElement | null {
  return anchor?.closest<HTMLElement>('[data-m3-layer="modal"]')
    ?.querySelector<HTMLElement>(':scope > .m3-layer__feedback') ?? null
}

export function mountPopoverHost(host: HTMLElement, target: Element | null, explicit?: string | HTMLElement) {
  resolvePopoverContainer(target, explicit).append(host)
}

export function raisePopover(host: HTMLElement) {
  const manager = managers.get(host.ownerDocument)
  const index = manager?.popovers.findIndex(entry => entry.host === host) ?? -1
  if (index < 0 || !manager) return

  const [entry] = manager.popovers.splice(index, 1)
  manager.popovers.push(entry)
  host.parentElement?.append(host)
}

export function activateModalLayer(host: HTMLElement, onEscape: () => void, raise = true): () => void {
  const document = host.ownerDocument
  const manager = managerFor(document)
  const entry: ModalEntry = { host, onEscape }

  if (raise) host.parentElement?.append(host)
  host.dataset.m3LayerActive = 'true'
  manager.modals.push(entry)

  return () => {
    const index = manager.modals.indexOf(entry)
    if (index >= 0) manager.modals.splice(index, 1)
    delete host.dataset.m3LayerActive
    host.dispatchEvent(new Event(LAYER_DEACTIVATED_EVENT))
    disposeEmpty(document, manager)
  }
}

export function activatePopover(host: HTMLElement, onEscape: () => void): () => void {
  const document = host.ownerDocument
  const manager = managerFor(document)
  const entry: PopoverEntry = { host, onEscape }
  const layer = host.closest<HTMLElement>('[data-m3-layer="modal"]')

  host.parentElement?.append(host)
  layer?.addEventListener(LAYER_DEACTIVATED_EVENT, onEscape)
  manager.popovers.push(entry)

  return () => {
    const index = manager.popovers.indexOf(entry)
    if (index >= 0) manager.popovers.splice(index, 1)
    layer?.removeEventListener(LAYER_DEACTIVATED_EVENT, onEscape)
    disposeEmpty(document, manager)
  }
}
