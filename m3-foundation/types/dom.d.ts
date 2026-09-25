export interface Clickable {
  click (): void;
}

export interface Focusable {
  focus (): void;
  blur (): void;
}

export interface Interactable extends Clickable, Focusable {}

export interface ElementReference<ElementType extends Element = HTMLElement> {
  readonly el: ElementType | null;
}
