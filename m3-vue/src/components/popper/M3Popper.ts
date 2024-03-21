import type {
  AllowedComponentProps,
  DefineComponent,
  Ref,
} from 'vue'

import type { PopperOptions } from '~types/components/popper'
import type { None } from '~types/scaffolding'

import M3Popper from './M3Popper.vue'

export default M3Popper as unknown as DefineComponent<{
  target: (() => Element | null) | Ref<Element | null>
} & PopperOptions & AllowedComponentProps, None, None, None, {
  contains (el: Element | null): boolean;
  adjust (): Promise<void>;
  show (): Promise<void>;
  hide (): Promise<void>;
}>