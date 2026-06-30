/* eslint-disable max-lines-per-function */
import type {
  CSSProperties,
  MutableRefObject,
} from 'react'

import {
  useEffect,
  useRef,
} from 'react'

import { getSurfaceStateDescriptor } from '@modulify/m3-foundation/lib/surface/descriptor'
import { m3MotionDurations } from '@modulify/m3-foundation/lib/motion'
import {
  raf,
  wait,
} from '@modulify/m3-foundation/lib/surface/orchestration'

import { useStateRef } from './useStateRef'

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

type ModalRole = 'surface-container-low' | 'surface-container-high'
type SurfaceGeometry = {
  width: number;
  insetTop: number;
  insetRight: number;
  insetBottom: number;
}

type UseSurfaceSideSheetMorphResult = {
  sideSheetModal: boolean;
  sideSheetWidth: number;
  transitioning: boolean;
  modalShown: boolean;
  dockedPanelShown: boolean;
  dockedPanelStyle: CSSProperties;
  modalPanelProps: {
    shown: true;
    scrimShown: boolean;
    anchor: 'end';
    fillWidth: false;
    fillHeight: false;
    width: number;
    insetTop: number;
    insetRight: number;
    insetBottom: number;
    roundingTopLeft: number;
    roundingBottomLeft: number;
    roundingTopRight: number;
    roundingBottomRight: number;
    transitionMs: number;
    zIndex: number;
    variant: ModalRole;
    elevation: number;
    overflow: 'auto';
  };
  dockedHostStyle: {
    width: string;
  };
  dockedHostRef: MutableRefObject<HTMLDivElement | null>;
  layoutRootRef: MutableRefObject<HTMLDivElement | null>;
  toggleSideSheetMode: () => Promise<void>;
  closeModalFromPanel: () => Promise<void>;
}

export function useSurfaceSideSheetMorph(): UseSurfaceSideSheetMorphResult {
  const [sideSheetModal, setSideSheetModal, sideSheetModalRef] = useStateRef(false)
  const [sideSheetWidth, setSideSheetWidth, sideSheetWidthRef] = useStateRef(SIDE_SHEET_WIDTH_MIN)
  const [dockedHostExpanded, setDockedHostExpanded, dockedHostExpandedRef] = useStateRef(true)
  const [dockedPanelShown, setDockedPanelShown] = useStateRef(true)
  const [dockedPanelHidden, setDockedPanelHidden] = useStateRef(false)
  const [modalShown, setModalShown] = useStateRef(false)
  const [modalScrimShown, setModalScrimShown] = useStateRef(false)
  const [modalWidth, setModalWidth] = useStateRef(sideSheetWidthRef.current)
  const [modalInsetTop, setModalInsetTop] = useStateRef(MODAL_INSET_TOP)
  const [modalInsetRight, setModalInsetRight] = useStateRef(MODAL_INSET_END)
  const [modalInsetBottom, setModalInsetBottom] = useStateRef(MODAL_INSET_BOTTOM)
  const [modalRadiusLeft, setModalRadiusLeft] = useStateRef<number>(DOCKED_SIDE_SHEET_DESCRIPTOR.rounding.topLeft)
  const [modalElevation, setModalElevation] = useStateRef<number>(DOCKED_SIDE_SHEET_DESCRIPTOR.elevation)
  const [modalRole, setModalRole] = useStateRef<ModalRole>(DOCKED_SIDE_SHEET_DESCRIPTOR.variant)
  const [modalTransitionMs, setModalTransitionMs] = useStateRef<number>(PANEL_TRANSITION_MS)
  const [transitioning, setTransitioning, transitioningRef] = useStateRef(false)
  const [, setLastDockedGeometry, lastDockedGeometryRef] = useStateRef<SurfaceGeometry | null>(null)

  const dockedHostRef = useRef<HTMLDivElement | null>(null)
  const layoutRootRef = useRef<HTMLDivElement | null>(null)

  const measureDockedGeometry = () => {
    const host = dockedHostRef.current
    if (!host) {
      return null
    }

    const rect = host.getBoundingClientRect()
    const width = Math.round(rect.width)

    if (width > 0) {
      setSideSheetWidth(width)
    }

    return {
      width: width > 0 ? width : sideSheetWidthRef.current,
      insetTop: Math.round(rect.top),
      insetRight: Math.round(window.innerWidth - rect.right),
      insetBottom: Math.round(window.innerHeight - rect.bottom),
    }
  }

  const measureDockedPanelGeometry = (): SurfaceGeometry | null => {
    const panel = dockedHostRef.current?.querySelector('[data-panel-mode="docked"]') as HTMLElement | null
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

    setSideSheetWidth(geometry.width)
    setLastDockedGeometry(geometry)

    return geometry
  }

  const syncDockedGeometry = () => {
    requestAnimationFrame(() => {
      const docked = measureDockedPanelGeometry() ?? measureDockedGeometry()
      if (!docked || sideSheetModalRef.current) {
        return
      }

      setModalWidth(docked.width)
      setModalInsetTop(docked.insetTop)
      setModalInsetRight(docked.insetRight)
      setModalInsetBottom(docked.insetBottom)
    })
  }

  const switchDockedToModal = async () => {
    const docked = measureDockedPanelGeometry() ?? measureDockedGeometry()
    if (!docked) {
      return
    }

    setModalTransitionMs(PANEL_TRANSITION_MS)
    setModalWidth(docked.width)
    setModalInsetTop(docked.insetTop)
    setModalInsetRight(docked.insetRight)
    setModalInsetBottom(docked.insetBottom)
    setModalRadiusLeft(DOCKED_SIDE_SHEET_DESCRIPTOR.rounding.topLeft)
    setModalElevation(DOCKED_SIDE_SHEET_DESCRIPTOR.elevation)
    setModalRole(DOCKED_SIDE_SHEET_DESCRIPTOR.variant)
    setDockedPanelShown(true)
    setDockedPanelHidden(true)
    setModalShown(true)

    await raf()

    setModalScrimShown(MODAL_SIDE_SHEET_DESCRIPTOR.scrim)
    setDockedHostExpanded(false)
    setSideSheetModal(true)
    setModalWidth(docked.width)
    setModalInsetTop(MODAL_INSET_TOP)
    setModalInsetRight(MODAL_INSET_END)
    setModalInsetBottom(MODAL_INSET_BOTTOM)
    setModalRadiusLeft(MODAL_SIDE_SHEET_DESCRIPTOR.rounding.topLeft)
    setModalElevation(MODAL_SIDE_SHEET_DESCRIPTOR.elevation)
    setModalRole(MODAL_SIDE_SHEET_DESCRIPTOR.variant)

    await wait(PANEL_TRANSITION_MS)

    setDockedPanelShown(false)
  }

  const switchModalToDocked = async () => {
    setDockedHostExpanded(true)
    setDockedPanelShown(true)
    setDockedPanelHidden(true)

    await raf()

    const dockedTarget = lastDockedGeometryRef.current ?? measureDockedPanelGeometry() ?? measureDockedGeometry()
    if (!dockedTarget) {
      return
    }

    setModalTransitionMs(PANEL_TRANSITION_MS)
    setModalScrimShown(false)
    setModalElevation(DOCKED_SIDE_SHEET_DESCRIPTOR.elevation)
    setModalRole(DOCKED_SIDE_SHEET_DESCRIPTOR.variant)
    setModalRadiusLeft(DOCKED_SIDE_SHEET_DESCRIPTOR.rounding.topLeft)
    setModalWidth(dockedTarget.width)
    setModalInsetTop(dockedTarget.insetTop)
    setModalInsetRight(dockedTarget.insetRight)
    setModalInsetBottom(dockedTarget.insetBottom)

    await wait(PANEL_TRANSITION_MS)

    setSideSheetModal(false)
    setModalShown(false)
    setDockedPanelHidden(false)
  }

  const toggleSideSheetMode = async () => {
    if (transitioningRef.current) {
      return
    }

    setTransitioning(true)

    if (!sideSheetModalRef.current) {
      await switchDockedToModal()
      setTransitioning(false)
      return
    }

    await switchModalToDocked()
    setTransitioning(false)
  }

  const closeModalFromPanel = async () => {
    if (!sideSheetModalRef.current || transitioningRef.current) {
      return
    }

    setTransitioning(true)
    await switchModalToDocked()
    setTransitioning(false)
  }

  useEffect(() => {
    const onResize = () => {
      if (dockedHostExpandedRef.current) {
        syncDockedGeometry()
      }
    }

    syncDockedGeometry()
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return {
    sideSheetModal,
    sideSheetWidth,
    transitioning,
    modalShown,
    dockedPanelShown,
    dockedPanelStyle: {
      visibility: dockedPanelHidden ? 'hidden' : 'visible',
    },
    modalPanelProps: {
      shown: true,
      scrimShown: modalScrimShown,
      anchor: MODAL_SIDE_SHEET_DESCRIPTOR.anchor,
      fillWidth: MODAL_SIDE_SHEET_DESCRIPTOR.fillWidth,
      fillHeight: MODAL_SIDE_SHEET_DESCRIPTOR.fillHeight,
      width: modalWidth,
      insetTop: modalInsetTop,
      insetRight: modalInsetRight,
      insetBottom: modalInsetBottom,
      roundingTopLeft: modalRadiusLeft,
      roundingBottomLeft: modalRadiusLeft,
      roundingTopRight: MODAL_SIDE_SHEET_DESCRIPTOR.rounding.topRight,
      roundingBottomRight: MODAL_SIDE_SHEET_DESCRIPTOR.rounding.bottomRight,
      transitionMs: modalTransitionMs,
      zIndex: 520,
      variant: modalRole,
      elevation: modalElevation,
      overflow: MODAL_SIDE_SHEET_DESCRIPTOR.overflow,
    },
    dockedHostStyle: {
      width: dockedHostExpanded ? DOCKED_HOST_WIDTH : '0px',
    },
    dockedHostRef,
    layoutRootRef,
    toggleSideSheetMode,
    closeModalFromPanel,
  }
}
