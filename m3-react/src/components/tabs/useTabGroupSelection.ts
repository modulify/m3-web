import type { Dispatch, RefObject, SetStateAction } from 'react'
import type { TabNavigation } from '@modulify/m3-foundation/types/components/tabs'

import { useLayoutEffect, useRef, useState } from 'react'

import {
  readTabNavigation,
  withTabNavigation,
} from '@modulify/m3-foundation/lib/tabGroup'

interface Options {
  available: string[];
  value?: string;
  navigation?: TabNavigation;
  queryKey: string;
  onChange: (value: string) => void;
}

interface NavigationOptions extends Pick<Options, 'navigation' | 'queryKey'> {
  availableKey: string;
  availableRef: RefObject<string[]>;
  valueRef: RefObject<string | undefined>;
  selectedRef: RefObject<string | undefined>;
  onChangeRef: RefObject<(value: string) => void>;
  setInternalValue: Dispatch<SetStateAction<string | undefined>>;
}

const useTabGroupNavigation = ({ navigation, queryKey, availableKey, availableRef, valueRef, selectedRef, onChangeRef, setInternalValue }: NavigationOptions) => {
  const navigate = (next: string) => {
    if (!navigation || typeof window === 'undefined') return
    const current = new URL(window.location.href)
    const url = withTabNavigation(current, navigation, next, queryKey)
    if (url.href !== current.href) window.history.pushState(window.history.state, '', url)
  }

  useLayoutEffect(() => {
    if (!navigation || typeof window === 'undefined') return

    const sync = (notify: boolean) => {
      const requested = readTabNavigation(new URL(window.location.href), navigation, queryKey)
      const choices = availableRef.current
      const fallback = choices.includes(valueRef.current ?? '') ? valueRef.current : choices[0]
      const next = requested !== null && choices.includes(requested) ? requested : fallback
      if (next === selectedRef.current) return
      selectedRef.current = next
      setInternalValue(next)
      if (notify && next) onChangeRef.current(next)
    }

    const handleNavigation = () => sync(true)
    sync(false)
    window.addEventListener('popstate', handleNavigation)
    window.addEventListener('hashchange', handleNavigation)
    return () => {
      window.removeEventListener('popstate', handleNavigation)
      window.removeEventListener('hashchange', handleNavigation)
    }
  }, [navigation, queryKey, availableKey])

  return navigate
}

export const useTabGroupSelection = ({ available, value, navigation, queryKey, onChange }: Options) => {
  const [internalValue, setInternalValue] = useState(value)
  const selected = available.includes(internalValue ?? '') ? internalValue : available[0]
  const availableKey = JSON.stringify(available)
  const availableRef = useRef(available)
  const valueRef = useRef(value)
  const selectedRef = useRef(selected)
  const onChangeRef = useRef(onChange)
  const previousValue = useRef(value)

  availableRef.current = available
  valueRef.current = value
  selectedRef.current = selected
  onChangeRef.current = onChange

  const navigate = useTabGroupNavigation({ navigation, queryKey, availableKey, availableRef, valueRef, selectedRef, onChangeRef, setInternalValue })

  useLayoutEffect(() => {
    if (value !== undefined && previousValue.current !== value && available.includes(value)) {
      selectedRef.current = value
      setInternalValue(value)
      navigate(value)
    }
    previousValue.current = value
  }, [value, navigation, queryKey, availableKey])

  const activate = (next: string) => {
    if (next === selectedRef.current || !available.includes(next)) return
    selectedRef.current = next
    setInternalValue(next)
    navigate(next)
    onChange(next)
  }

  return { selected, activate }
}
