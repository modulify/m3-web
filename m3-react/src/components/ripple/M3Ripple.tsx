import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'

export interface M3RippleProps {
  owner: React.RefObject<HTMLElement>;
  centered?: boolean;
}

export interface M3RippleMethods {
  activate: (event: React.KeyboardEvent | React.MouseEvent | MouseEvent) => void;
}

const M3Ripple: React.ForwardRefRenderFunction<
  M3RippleMethods,
  M3RippleProps
> = ({ owner, centered = false }, ref) => {
  const [active, setActive] = useState(false)
  const [diameter, setDiameter] = useState(0)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  const activate = (event: React.KeyboardEvent | React.MouseEvent | MouseEvent) => {
    setActive(false);

    if (!owner.current) {
      return
    }

    const rect = owner.current.getBoundingClientRect()

    setDiameter(Math.max(owner.current.clientWidth, owner.current.clientHeight))
    setX('clientX' in event && !centered ? event.clientX - rect.x : owner.current.clientWidth / 2)
    setY('clientY' in event && !centered ? event.clientY - rect.y : owner.current.clientHeight / 2)

    requestAnimationFrame(() => setActive(true))
  }

  useImperativeHandle(ref, () => ({
    activate,
  }))

  useEffect(() => {
    const el = owner.current
    if (el) {
      el.addEventListener('click', activate, { passive: true })
    }

    return () => {
      if (el) {
        el.removeEventListener('click', activate)
      }
    }
  }, [owner])

  return (
    active ? (
      <span
        className="m3-ripple"
        onAnimationEnd={() => setActive(false)}
        style={{
          width: `${diameter}px`,
          height: `${diameter}px`,
          left: `${x - 0.5 * diameter}px`,
          top: `${y - 0.5 * diameter}px`
        }}
      />
    ) : null
  )
}

export default forwardRef(M3Ripple)