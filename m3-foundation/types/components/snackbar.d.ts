export type SnackbarResult = 'action' | 'dismiss' | 'timeout' | 'replaced' | 'cleared' | 'disposed'
export type SnackbarLayout = 'inline' | 'stacked'

export interface SnackbarActionContext {
  message: string;
  messageId: string;
  performAction (): void;
  dismiss (): void;
}

export interface SnackbarOptions<Action = unknown> {
  message: string;
  action?: Action | null;
  layout?: SnackbarLayout;
  closable?: boolean;
  closeLabel?: string;
  duration?: number | null;
}

export interface SnackbarHostMethods<Action = unknown> {
  show (options: SnackbarOptions<Action>): Promise<SnackbarResult>;
  replace (options: SnackbarOptions<Action>): Promise<SnackbarResult>;
  dismiss (): void;
  clear (): void;
  focus (): void;
}
