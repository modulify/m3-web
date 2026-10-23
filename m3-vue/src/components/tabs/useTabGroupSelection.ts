import type { Ref } from 'vue'
import type { TabNavigation } from '@modulify/m3-foundation/types/components/tabs'

import {
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  watch,
} from 'vue'

import {
  readTabNavigation,
  withTabNavigation,
} from '@modulify/m3-foundation/lib/tabGroup'

interface Options {
  value?: string;
  navigation?: TabNavigation;
  queryKey: string;
}

interface NavigationOptions {
  options: Options;
  getAvailable: () => string[];
  selected: () => string | undefined;
  internalValue: Ref<string | undefined>;
  emit: (name: 'change' | 'update:value', value: string) => void;
}

const useTabGroupNavigation = ({ options, getAvailable, selected, internalValue, emit }: NavigationOptions) => {
  const navigate = (next: string) => {
    if (!options.navigation || typeof window === 'undefined') return
    const current = new URL(window.location.href)
    const url = withTabNavigation(current, options.navigation, next, options.queryKey)
    if (url.href !== current.href) window.history.pushState(window.history.state, '', url)
  }

  const sync = (notify: boolean) => {
    if (!options.navigation || typeof window === 'undefined') return
    const available = getAvailable()
    const requested = readTabNavigation(new URL(window.location.href), options.navigation, options.queryKey)
    const fallback = available.includes(options.value ?? '') ? options.value : available[0]
    const next = requested !== null && available.includes(requested) ? requested : fallback
    if (next === selected()) return
    internalValue.value = next
    if (notify && next) {
      emit('update:value', next)
      emit('change', next)
    }
  }

  const handleNavigation = () => sync(true)
  onMounted(() => {
    sync(false)
    window.addEventListener('popstate', handleNavigation)
    window.addEventListener('hashchange', handleNavigation)
  })
  onUpdated(() => sync(false))
  onBeforeUnmount(() => {
    window.removeEventListener('popstate', handleNavigation)
    window.removeEventListener('hashchange', handleNavigation)
  })

  watch(() => options.value, (next, previous) => {
    if (next === undefined || next === previous || !getAvailable().includes(next)) return
    internalValue.value = next
    navigate(next)
  })
  watch(() => [options.navigation, options.queryKey], () => sync(false), { flush: 'post' })

  return navigate
}

export const useTabGroupSelection = (
  options: Options,
  getAvailable: () => string[],
  emit: (name: 'change' | 'update:value', value: string) => void
) => {
  const internalValue = ref(options.value)
  const selected = () => {
    const available = getAvailable()
    return available.includes(internalValue.value ?? '') ? internalValue.value : available[0]
  }
  const navigate = useTabGroupNavigation({ options, getAvailable, selected, internalValue, emit })

  const activate = (next: string) => {
    if (next === selected() || !getAvailable().includes(next)) return
    internalValue.value = next
    navigate(next)
    emit('update:value', next)
    emit('change', next)
  }

  return { selected, activate }
}
