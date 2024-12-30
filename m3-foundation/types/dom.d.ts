export interface Clickable {
  click (): void;
}

export interface Focusable {
  focus (): void;
  blur (): void;
}

export interface Interactable extends Clickable, Focusable {}
