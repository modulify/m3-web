import type {
  SnackbarActionContext as BaseSnackbarActionContext,
  SnackbarHostMethods as BaseSnackbarHostMethods,
  SnackbarOptions as BaseSnackbarOptions,
} from '@modulify/m3-foundation/types/components/snackbar'
import type { VNodeChild } from 'vue'

export interface SnackbarActionContext extends BaseSnackbarActionContext {
  buttonProps: {
    appearance: 'text';
    class: string;
    'aria-describedby': string;
    onClick: () => void;
  };
}

export type SnackbarActionRenderer = (context: SnackbarActionContext) => VNodeChild
export type SnackbarOptions = BaseSnackbarOptions<SnackbarActionRenderer>
export type SnackbarHostMethods = BaseSnackbarHostMethods<SnackbarActionRenderer>
