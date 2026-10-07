export interface SearchResultsContext {
  query: string;
  close(): void;
  submit(): void;
}

export interface M3SearchMethods {
  open(): void;
  close(): void;
  focus(): void;
}
