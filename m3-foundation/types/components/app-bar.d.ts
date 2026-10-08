export type AppBarAppearance =
  | 'search'
  | 'small'
  | 'medium'
  | 'medium-flexible'
  | 'large'
  | 'large-flexible'

export type AppBarAlignment = 'start' | 'center'
export type AppBarScroll = 'pinned' | 'hide' | 'collapse' | 'transparent'

export interface AppBarScrollState {
  under: boolean;
  hidden: boolean;
  collapsed: boolean;
}
