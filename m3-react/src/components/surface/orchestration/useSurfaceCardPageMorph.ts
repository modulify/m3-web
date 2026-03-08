/* eslint-disable max-lines-per-function */
import type {
  CSSProperties,
  MutableRefObject,
} from 'react'

import {
  useEffect,
  useRef,
} from 'react'

import {
  measureContainerRect,
  measureRelativeRect,
  raf,
  toMotionStyle,
  type SurfaceMotionRect,
  wait,
} from '@modulify/m3-foundation/lib/surface/orchestration'

import { useStateRef } from './useStateRef'

type UseSurfaceCardPageMorphResult = {
  expanded: boolean;
  busy: boolean;
  backgroundCollapsed: boolean;
  originHeight: number;
  overlayStyle: CSSProperties;
  canvasRef: MutableRefObject<HTMLDivElement | null>;
  originSlotRef: MutableRefObject<HTMLDivElement | null>;
  toggleCardMode: () => Promise<void>;
}

export function useSurfaceCardPageMorph(transitionMs: number): UseSurfaceCardPageMorphResult {
  const [expanded, setExpanded, expandedRef] = useStateRef(false)
  const [busy, setBusy, busyRef] = useStateRef(false)
  const [backgroundCollapsed, setBackgroundCollapsed, backgroundCollapsedRef] = useStateRef(false)
  const [originHeight, setOriginHeight] = useStateRef(220)
  const [motion, setMotion] = useStateRef<SurfaceMotionRect>({
    top: 16,
    left: 16,
    width: 320,
    height: 220,
  })

  const canvasRef = useRef<HTMLDivElement | null>(null)
  const originSlotRef = useRef<HTMLDivElement | null>(null)
  const syncFrameRef = useRef<number | null>(null)

  const measureOrigin = () => measureRelativeRect(canvasRef.current, originSlotRef.current)

  const measureExpanded = () => measureContainerRect(canvasRef.current)

  const syncMotionToLayout = () => {
    const origin = measureOrigin()

    if (origin) {
      setOriginHeight(origin.height)
    }

    if (expandedRef.current) {
      const full = measureExpanded()

      if (full) {
        setMotion(full)
      }

      return
    }

    if (!origin || backgroundCollapsedRef.current) {
      return
    }

    setMotion(origin)
  }

  const scheduleSyncMotion = () => {
    if (syncFrameRef.current !== null) {
      cancelAnimationFrame(syncFrameRef.current)
    }

    syncFrameRef.current = requestAnimationFrame(() => {
      syncFrameRef.current = null
      syncMotionToLayout()
    })
  }

  const initMotion = async () => {
    await raf()

    const origin = measureOrigin()
    if (!origin) {
      return
    }

    setMotion(origin)
    setOriginHeight(origin.height)
  }

  const expandCard = async () => {
    setBackgroundCollapsed(false)

    const origin = measureOrigin()
    if (origin) {
      setMotion(origin)
      setOriginHeight(origin.height)
    }

    setExpanded(true)
    await raf()

    const full = measureExpanded()
    if (!full) {
      return
    }

    setMotion(full)
    await wait(transitionMs)
    setBackgroundCollapsed(true)
  }

  const collapseCard = async () => {
    if (backgroundCollapsed) {
      setBackgroundCollapsed(false)
      await raf()
    }

    const full = measureExpanded()
    if (full) {
      setMotion(full)
    }

    const origin = measureOrigin()
    if (origin) {
      setOriginHeight(origin.height)
    }

    setExpanded(false)
    await raf()

    if (!origin) {
      return
    }

    setMotion(origin)
    await wait(transitionMs)
  }

  const toggleCardMode = async () => {
    if (busyRef.current) {
      return
    }

    setBusy(true)

    if (expandedRef.current) {
      await collapseCard()
      setBusy(false)
      return
    }

    await expandCard()
    setBusy(false)
  }

  useEffect(() => {
    void initMotion()
  }, [])

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') {
      return
    }

    const observer = new ResizeObserver(() => {
      scheduleSyncMotion()
    })

    if (canvasRef.current) {
      observer.observe(canvasRef.current)
    }

    if (originSlotRef.current) {
      observer.observe(originSlotRef.current)
    }

    return () => {
      observer.disconnect()

      if (syncFrameRef.current !== null) {
        cancelAnimationFrame(syncFrameRef.current)
        syncFrameRef.current = null
      }
    }
  }, [])

  return {
    expanded,
    busy,
    backgroundCollapsed,
    originHeight,
    overlayStyle: toMotionStyle(motion),
    canvasRef,
    originSlotRef,
    toggleCardMode,
  }
}
