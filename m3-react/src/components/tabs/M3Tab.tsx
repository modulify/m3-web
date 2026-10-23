import type { ReactNode } from 'react'

export interface M3TabProps {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
  'aria-label'?: string;
  children?: ReactNode;
}

// M3TabGroup reads the descriptor and renders its button and panel in their proper locations.
export const M3Tab = (_props: M3TabProps): null => null
