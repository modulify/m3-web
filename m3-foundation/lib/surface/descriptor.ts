import type {
  Anchor as SurfaceAnchor,
  Variant as SurfaceVariant,
} from '../../types/components/surface'

export type SurfaceStateKind =
  | 'hidden'
  | 'compact_card'
  | 'page_like_parent_fill'
  | 'docked_side_sheet'
  | 'modal_side_sheet'
  | 'modal_dialog_window'

export type SurfaceLayerFamily = 'layout' | 'modal'
export type SurfaceOverflow = 'visible' | 'auto' | 'hidden'

export type SurfaceCornerRounding = {
  readonly topLeft: number;
  readonly topRight: number;
  readonly bottomRight: number;
  readonly bottomLeft: number;
}

export type SurfaceStateDescriptor = {
  readonly kind: SurfaceStateKind;
  readonly layer: SurfaceLayerFamily;
  readonly anchor: SurfaceAnchor;
  readonly fillWidth: boolean;
  readonly fillHeight: boolean;
  readonly variant: Exclude<SurfaceVariant, 'auto'>;
  readonly elevation: number;
  readonly scrim: boolean;
  readonly overflow: SurfaceOverflow;
  readonly rounding: SurfaceCornerRounding;
}

const SURFACE_STATE_DESCRIPTORS = {
  hidden: {
    kind: 'hidden',
    layer: 'layout',
    anchor: 'none',
    fillWidth: false,
    fillHeight: false,
    variant: 'surface-container-low',
    elevation: 0,
    scrim: false,
    overflow: 'hidden',
    rounding: {
      topLeft: 0,
      topRight: 0,
      bottomRight: 0,
      bottomLeft: 0,
    },
  },
  compact_card: {
    kind: 'compact_card',
    layer: 'layout',
    anchor: 'none',
    fillWidth: true,
    fillHeight: false,
    variant: 'surface-container-low',
    elevation: 1,
    scrim: false,
    overflow: 'auto',
    rounding: {
      topLeft: 24,
      topRight: 24,
      bottomRight: 24,
      bottomLeft: 24,
    },
  },
  page_like_parent_fill: {
    kind: 'page_like_parent_fill',
    layer: 'layout',
    anchor: 'none',
    fillWidth: true,
    fillHeight: true,
    variant: 'surface',
    elevation: 0,
    scrim: false,
    overflow: 'auto',
    rounding: {
      topLeft: 0,
      topRight: 0,
      bottomRight: 0,
      bottomLeft: 0,
    },
  },
  docked_side_sheet: {
    kind: 'docked_side_sheet',
    layer: 'layout',
    anchor: 'end',
    fillWidth: false,
    fillHeight: false,
    variant: 'surface-container-low',
    elevation: 0,
    scrim: false,
    overflow: 'auto',
    rounding: {
      topLeft: 0,
      topRight: 0,
      bottomRight: 0,
      bottomLeft: 0,
    },
  },
  modal_side_sheet: {
    kind: 'modal_side_sheet',
    layer: 'modal',
    anchor: 'end',
    fillWidth: false,
    fillHeight: false,
    variant: 'surface-container-high',
    elevation: 1,
    scrim: true,
    overflow: 'auto',
    rounding: {
      topLeft: 28,
      topRight: 0,
      bottomRight: 0,
      bottomLeft: 28,
    },
  },
  modal_dialog_window: {
    kind: 'modal_dialog_window',
    layer: 'modal',
    anchor: 'center',
    fillWidth: false,
    fillHeight: false,
    variant: 'surface-container-highest',
    elevation: 2,
    scrim: true,
    overflow: 'auto',
    rounding: {
      topLeft: 28,
      topRight: 28,
      bottomRight: 28,
      bottomLeft: 28,
    },
  },
} as const satisfies Record<SurfaceStateKind, SurfaceStateDescriptor>

export function getSurfaceStateDescriptor<TKind extends SurfaceStateKind>(
  kind: TKind
): (typeof SURFACE_STATE_DESCRIPTORS)[TKind] {
  return SURFACE_STATE_DESCRIPTORS[kind]
}
