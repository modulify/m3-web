interface ModalFocusOptions {
  dialog: HTMLElement;
  exempt?: () => Array<HTMLElement | null>;
  onEscape: () => void;
}

interface ModalScope extends ModalFocusOptions {
  previousFocus: HTMLElement | null;
  addedTabIndex: boolean;
}

interface ModalManager {
  scopes: ModalScope[];
  originalInert: Map<HTMLElement, boolean>;
  listeners: AbortController;
  observer: MutationObserver;
  dispose(): void;
}

const managers = new WeakMap<Document, ModalManager>()

const focusableSelector = 'a[href], area[href], button, input, select, textarea, summary, [contenteditable]:not([contenteditable="false"]), [tabindex]'

const focusableIn = (dialog: HTMLElement) => [...dialog.querySelectorAll<HTMLElement>(focusableSelector)]
  .filter(element => (element.tabIndex >= 0 || (element.isContentEditable && !element.hasAttribute('tabindex')))
    && !element.matches(':disabled')
    && !element.closest('[inert]')
    && element.getClientRects().length > 0
    && getComputedStyle(element).visibility !== 'hidden')
  .sort((left, right) => {
    const leftOrder = left.tabIndex > 0 ? left.tabIndex : Infinity
    const rightOrder = right.tabIndex > 0 ? right.tabIndex : Infinity
    return leftOrder === rightOrder ? 0 : leftOrder < rightOrder ? -1 : 1
  })

const focusFirst = (dialog: HTMLElement) => (focusableIn(dialog)[0] ?? dialog).focus()

function restoreInert(manager: ModalManager) {
  manager.originalInert.forEach((inert, element) => element.inert = inert)
  manager.originalInert.clear()
}

function updateInert(document: Document, manager: ModalManager) {
  restoreInert(manager)

  const scope = manager.scopes.at(-1)
  if (!scope) return

  const allowed = [scope.dialog, ...(scope.exempt?.() ?? [])]
    .filter((element): element is HTMLElement => !!element && element.isConnected)

  const paths = new Set<HTMLElement>()
  allowed.forEach(element => {
    for (let current: HTMLElement | null = element; current && current !== document.body; current = current.parentElement) {
      paths.add(current)
    }
  })

  const protectSiblings = (parent: HTMLElement) => {
    for (const child of parent.children) {
      if (!(child instanceof HTMLElement) || allowed.includes(child)) continue

      if (paths.has(child)) {
        protectSiblings(child)
      } else {
        manager.originalInert.set(child, child.inert)
        child.inert = true
      }
    }
  }

  protectSiblings(document.body)
}

function registerModalListeners(document: Document, manager: ModalManager) {
  document.addEventListener('keydown', event => {
    const scope = manager.scopes.at(-1)
    if (!scope) return

    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      scope.onEscape()
      return
    }

    if (event.key !== 'Tab') return

    const items = focusableIn(scope.dialog)
    const first = items[0]
    const last = items.at(-1)
    const active = document.activeElement

    if (!first || !last) {
      event.preventDefault()
      scope.dialog.focus()
    } else if (event.shiftKey && (active === first || !scope.dialog.contains(active))) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && (active === last || !scope.dialog.contains(active))) {
      event.preventDefault()
      first.focus()
    }
  }, { capture: true, signal: manager.listeners.signal })

  document.addEventListener('focusin', event => {
    const scope = manager.scopes.at(-1)
    if (scope && !scope.dialog.contains(event.target as Node)) focusFirst(scope.dialog)
  }, { capture: true, signal: manager.listeners.signal })
}

function createManager(document: Document): ModalManager {
  const manager: ModalManager = {
    scopes: [],
    originalInert: new Map(),
    listeners: new AbortController(),
    observer: new MutationObserver(() => updateInert(document, manager)),
    dispose() {
      this.listeners.abort('Modal focus manager disposed')
      this.observer.disconnect()
      managers.delete(document)
    },
  }

  registerModalListeners(document, manager)
  manager.observer.observe(document.body, { childList: true, subtree: true })
  managers.set(document, manager)
  return manager
}

function createScope({ dialog, exempt, onEscape }: ModalFocusOptions): ModalScope {
  return {
    dialog,
    exempt,
    onEscape,
    previousFocus: dialog.ownerDocument.activeElement instanceof HTMLElement ? dialog.ownerDocument.activeElement : null,
    addedTabIndex: !dialog.hasAttribute('tabindex'),
  }
}

/** Activate modal focus management and return an idempotent disposal function. */
export function activateModalFocus({ dialog, exempt, onEscape }: ModalFocusOptions): () => void {
  const document = dialog.ownerDocument
  const manager = managers.get(document) ?? createManager(document)
  const scope = createScope({ dialog, exempt, onEscape })

  if (scope.addedTabIndex) dialog.tabIndex = -1
  manager.scopes.push(scope)
  updateInert(document, manager)
  focusFirst(dialog)

  let disposed = false

  return () => {
    if (disposed) return
    disposed = true

    const index = manager.scopes.indexOf(scope)
    if (index < 0) return

    const wasTop = index === manager.scopes.length - 1
    manager.scopes.splice(index, 1)
    if (scope.addedTabIndex) dialog.removeAttribute('tabindex')
    updateInert(document, manager)

    if (!manager.scopes.length) manager.dispose()

    if (wasTop) {
      const nextTop = manager.scopes.at(-1)
      queueMicrotask(() => {
        if (manager.scopes.at(-1) !== nextTop) return
        const active = document.activeElement
        if (active !== document.body && !dialog.contains(active)) return

        if (scope.previousFocus?.isConnected && !scope.previousFocus.inert) {
          scope.previousFocus.focus()
        } else if (nextTop) {
          focusFirst(nextTop.dialog)
        }
      })
    }
  }
}
