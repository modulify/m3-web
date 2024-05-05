import type { Delay } from '@modulify/m3-foundation/types/components/popper'

export const normalizeDelay = (delay: number | string | Delay): {
  show: number;
  hide: number;
} => ({
  show: Number(typeof delay === 'object' ? delay.show ?? 0 : delay),
  hide: Number(typeof delay === 'object' ? delay.hide ?? 0 : delay),
})
