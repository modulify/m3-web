export /*#__PURE__*/ const isBrowser = typeof window !== 'undefined'

export /*#__PURE__*/ const isIOS = () => {
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
    // @ts-expect-error MSStream is missing in window type
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  }

  return false
}