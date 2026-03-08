/* eslint-disable max-lines-per-function */
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'

import { getSurfaceStateDescriptor } from '@modulify/m3-foundation/lib/surface/descriptor'
import { m3MotionDurations } from '@modulify/m3-foundation/lib/motion'

import {
  raf,
  wait,
} from '@modulify/m3-foundation/lib/surface/orchestration'

const SIDE_SHEET_WIDTH_MIN = 280
const SIDE_SHEET_WIDTH_MAX = 360
const SIDE_SHEET_WIDTH_RATIO = 32

const MODAL_INSET_TOP = 0
const MODAL_INSET_BOTTOM = 0
const MODAL_INSET_END = 0
const PANEL_TRANSITION_MS = m3MotionDurations.medium2
const DOCKED_SIDE_SHEET_DESCRIPTOR = getSurfaceStateDescriptor('docked_side_sheet')
const MODAL_SIDE_SHEET_DESCRIPTOR = getSurfaceStateDescriptor('modal_side_sheet')
const DOCKED_HOST_WIDTH = `clamp(${SIDE_SHEET_WIDTH_MIN}px, ${SIDE_SHEET_WIDTH_RATIO}%, ${SIDE_SHEET_WIDTH_MAX}px)`

export function useSurfaceSideSheetMorph() {
  type SurfaceGeometry = {
    width: number;
    insetTop: number;
    insetRight: number;
    insetBottom: number;
  }

  const sideSheetModal = ref(false)
  const sideSheetWidth = ref(SIDE_SHEET_WIDTH_MIN)
  const dockedHostExpanded = ref(true)
  const dockedPanelShown = ref(true)
  const dockedPanelHidden = ref(false)
  const modalShown = ref(false)
  const modalScrimShown = ref(false)
  const modalWidth = ref(sideSheetWidth.value)
  const modalInsetTop = ref(MODAL_INSET_TOP)
  const modalInsetRight = ref(MODAL_INSET_END)
  const modalInsetBottom = ref(MODAL_INSET_BOTTOM)
  const modalRadiusLeft = ref<number>(DOCKED_SIDE_SHEET_DESCRIPTOR.rounding.topLeft)
  const modalElevation = ref<number>(DOCKED_SIDE_SHEET_DESCRIPTOR.elevation)
  const modalRole = ref<'surface-container-low' | 'surface-container-high'>(DOCKED_SIDE_SHEET_DESCRIPTOR.variant)
  const modalTransitionMs = ref<number>(PANEL_TRANSITION_MS)
  const transitioning = ref(false)
  const lastDockedGeometry = ref<SurfaceGeometry | null>(null)
  const dockedHost = ref<HTMLElement | null>(null)
  const layoutRoot = ref<HTMLElement | null>(null)

  function measureDockedGeometry() {
    const host = dockedHost.value
    if (!host) {
      return null
    }

    const rect = host.getBoundingClientRect()
    const width = Math.round(rect.width)

    if (width > 0) {
      sideSheetWidth.value = width
    }

    return {
      width: width > 0 ? width : sideSheetWidth.value,
      insetTop: Math.round(rect.top),
      insetRight: Math.round(window.innerWidth - rect.right),
      insetBottom: Math.round(window.innerHeight - rect.bottom),
    }
  }

  function measureDockedPanelGeometry(): SurfaceGeometry | null {
    const panel = dockedHost.value?.querySelector('[data-panel-mode="docked"]') as HTMLElement | null
    if (!panel) {
      return null
    }

    const rect = panel.getBoundingClientRect()
    const geometry = {
      width: Math.round(rect.width),
      insetTop: Math.round(rect.top),
      insetRight: Math.round(window.innerWidth - rect.right),
      insetBottom: Math.round(window.innerHeight - rect.bottom),
    }

    sideSheetWidth.value = geometry.width
    lastDockedGeometry.value = geometry

    return geometry
  }

  async function syncDockedGeometry() {
    await nextTick()
    await raf()

    const docked = measureDockedPanelGeometry() ?? measureDockedGeometry()
    if (!docked || sideSheetModal.value) {
      return
    }

    modalWidth.value = docked.width
    modalInsetTop.value = docked.insetTop
    modalInsetRight.value = docked.insetRight
    modalInsetBottom.value = docked.insetBottom
  }

  async function switchDockedToModal() {
    const docked = measureDockedPanelGeometry() ?? measureDockedGeometry()
    if (!docked) {
      return
    }

    modalTransitionMs.value = PANEL_TRANSITION_MS
    modalWidth.value = docked.width
    modalInsetTop.value = docked.insetTop
    modalInsetRight.value = docked.insetRight
    modalInsetBottom.value = docked.insetBottom
    modalRadiusLeft.value = DOCKED_SIDE_SHEET_DESCRIPTOR.rounding.topLeft
    modalElevation.value = DOCKED_SIDE_SHEET_DESCRIPTOR.elevation
    modalRole.value = DOCKED_SIDE_SHEET_DESCRIPTOR.variant
    dockedPanelShown.value = true
    dockedPanelHidden.value = true
    modalShown.value = true

    await nextTick()
    await raf()

    modalScrimShown.value = MODAL_SIDE_SHEET_DESCRIPTOR.scrim
    dockedHostExpanded.value = false
    sideSheetModal.value = true
    modalWidth.value = docked.width
    modalInsetTop.value = MODAL_INSET_TOP
    modalInsetRight.value = MODAL_INSET_END
    modalInsetBottom.value = MODAL_INSET_BOTTOM
    modalRadiusLeft.value = MODAL_SIDE_SHEET_DESCRIPTOR.rounding.topLeft
    modalElevation.value = MODAL_SIDE_SHEET_DESCRIPTOR.elevation
    modalRole.value = MODAL_SIDE_SHEET_DESCRIPTOR.variant

    await wait(PANEL_TRANSITION_MS)

    dockedPanelShown.value = false
  }

  async function switchModalToDocked() {
    dockedHostExpanded.value = true
    dockedPanelShown.value = true
    dockedPanelHidden.value = true

    await nextTick()
    await raf()

    const dockedTarget = lastDockedGeometry.value ?? measureDockedPanelGeometry() ?? measureDockedGeometry()
    if (!dockedTarget) {
      return
    }

    modalTransitionMs.value = PANEL_TRANSITION_MS
    modalScrimShown.value = false
    modalElevation.value = DOCKED_SIDE_SHEET_DESCRIPTOR.elevation
    modalRole.value = DOCKED_SIDE_SHEET_DESCRIPTOR.variant
    modalRadiusLeft.value = DOCKED_SIDE_SHEET_DESCRIPTOR.rounding.topLeft
    modalWidth.value = dockedTarget.width
    modalInsetTop.value = dockedTarget.insetTop
    modalInsetRight.value = dockedTarget.insetRight
    modalInsetBottom.value = dockedTarget.insetBottom

    await wait(PANEL_TRANSITION_MS)

    sideSheetModal.value = false
    modalShown.value = false
    dockedPanelHidden.value = false
  }

  async function toggleSideSheetMode() {
    if (transitioning.value) {
      return
    }

    transitioning.value = true

    if (!sideSheetModal.value) {
      await switchDockedToModal()
      transitioning.value = false
      return
    }

    await switchModalToDocked()
    transitioning.value = false
  }

  async function closeModalFromPanel() {
    if (!sideSheetModal.value || transitioning.value) {
      return
    }

    transitioning.value = true
    await switchModalToDocked()
    transitioning.value = false
  }

  async function onResize() {
    if (dockedHostExpanded.value) {
      await syncDockedGeometry()
    }
  }

  onMounted(async () => {
    await syncDockedGeometry()
    window.addEventListener('resize', onResize, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize)
  })

  const dockedHostStyle = computed(() => ({
    width: dockedHostExpanded.value ? DOCKED_HOST_WIDTH : '0px',
  }))

  const dockedPanelStyle = computed(() => ({
    visibility: dockedPanelHidden.value ? 'hidden' : 'visible',
  }))

  const modalPanelProps = computed(() => ({
    shown: true as const,
    scrimShown: modalScrimShown.value,
    anchor: MODAL_SIDE_SHEET_DESCRIPTOR.anchor,
    fillWidth: MODAL_SIDE_SHEET_DESCRIPTOR.fillWidth,
    fillHeight: MODAL_SIDE_SHEET_DESCRIPTOR.fillHeight,
    width: modalWidth.value,
    insetTop: modalInsetTop.value,
    insetRight: modalInsetRight.value,
    insetBottom: modalInsetBottom.value,
    roundingTopLeft: modalRadiusLeft.value,
    roundingBottomLeft: modalRadiusLeft.value,
    roundingTopRight: MODAL_SIDE_SHEET_DESCRIPTOR.rounding.topRight,
    roundingBottomRight: MODAL_SIDE_SHEET_DESCRIPTOR.rounding.bottomRight,
    transitionMs: modalTransitionMs.value,
    zIndex: 520,
    variant: modalRole.value,
    elevation: modalElevation.value,
    overflow: MODAL_SIDE_SHEET_DESCRIPTOR.overflow,
  }))

  return {
    sideSheetModal,
    sideSheetWidth,
    transitioning,
    modalShown,
    dockedPanelShown,
    dockedHost,
    layoutRoot,
    dockedHostStyle,
    dockedPanelStyle,
    modalPanelProps,
    toggleSideSheetMode,
    closeModalFromPanel,
  }
}
