export type ToolbarVariant = 'docked' | 'floating'
export type ToolbarOrientation = 'horizontal' | 'vertical'
export type ToolbarColor = 'standard' | 'vibrant'
export type ToolbarScroll = 'pinned' | 'hide' | 'collapse'
export type ToolbarSide = 'start' | 'end'

export interface ToolbarAction {
  id: string;
  label: string;
  icon: string;
  disabled?: boolean;
  selected?: boolean;
  onClick: () => void;
}
