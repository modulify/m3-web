export type SurfaceMotionRect = {
  top: number;
  left: number;
  width: number;
  height: number;
}

export type SurfaceMotionStyle = {
  top: string;
  left: string;
  width: string;
  height: string;
}

export function wait(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}

export function raf(): Promise<void> {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve())
  })
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function measureRelativeRect(
  container: HTMLElement | null,
  element: HTMLElement | null
): SurfaceMotionRect | null {
  if (!container || !element) {
    return null
  }

  const containerRect = container.getBoundingClientRect()
  const elementRect = element.getBoundingClientRect()

  return {
    top: elementRect.top - containerRect.top,
    left: elementRect.left - containerRect.left,
    width: elementRect.width,
    height: elementRect.height,
  }
}

export function measureContainerRect(container: HTMLElement | null): SurfaceMotionRect | null {
  if (!container) {
    return null
  }

  const rect = container.getBoundingClientRect()

  return {
    top: 0,
    left: 0,
    width: rect.width,
    height: rect.height,
  }
}

export function toMotionStyle(motion: SurfaceMotionRect): SurfaceMotionStyle {
  return {
    top: `${motion.top}px`,
    left: `${motion.left}px`,
    width: `${motion.width}px`,
    height: `${motion.height}px`,
  }
}
