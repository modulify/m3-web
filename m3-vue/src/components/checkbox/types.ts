export interface M3CheckboxProps<Model = boolean, Value = unknown> {
  id?: string;
  name?: string;
  model?: Model;
  value?: Value;
  indeterminate?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  trueValue?: Model;
  falseValue?: Model;
  equalsFn?: (a: unknown, b: unknown) => boolean;
}
