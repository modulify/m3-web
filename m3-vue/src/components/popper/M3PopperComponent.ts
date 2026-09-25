import type { AllowedComponentProps, ComponentPublicInstance, DefineComponent } from 'vue'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { None } from '~types/scaffolding'
import type { PopperOptions } from '@modulify/m3-foundation/types/components/popper'
import type { Ref } from 'vue'

import M3Popper from './M3Popper.vue'

export interface M3PopperMethods extends ElementReference<HTMLElement> {
  contains (el: Element | null): boolean;
  adjust (): Promise<void>;
  show (): Promise<void>;
  hide (): Promise<void>;
}

export type M3PopperInstance = ComponentPublicInstance & M3PopperMethods

export default M3Popper as unknown as DefineComponent<{
  target: (() => Element | null) | Ref<Element | null>
} & PopperOptions & AllowedComponentProps, None, None, None, {
  contains (el: Element | null): boolean;
  adjust (): Promise<void>;
  show (): Promise<void>;
  hide (): Promise<void>;
}>
