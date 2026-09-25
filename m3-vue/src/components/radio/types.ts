export interface M3RadioProps<Value = boolean> {
  id?: string;
  name?: string;
  model?: Value;
  value?: Value;
  invalid?: boolean;
  disabled?: boolean;
  equalsFn?: (a: Value | undefined, b: Value) => boolean;
}
