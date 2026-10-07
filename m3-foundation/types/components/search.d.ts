import type { Breakpoint } from '../breakpoint'

export type SearchAppearance = 'contained' | 'divided'
export type SearchLayout = 'auto' | 'full-screen' | 'docked'
export type ResolvedSearchLayout = Exclude<SearchLayout, 'auto'>

export interface SearchDockedPosition {
  left: number;
  top: number;
  width: number;
}

export interface SearchAnchorRect {
  left: number;
  top: number;
  width: number;
}

export interface SearchViewport {
  width: number;
  height: number;
}

export interface SearchRevealOrigin {
  left: number;
  right: number;
  offsetY: number;
}

export type SearchBreakpoint = Breakpoint
